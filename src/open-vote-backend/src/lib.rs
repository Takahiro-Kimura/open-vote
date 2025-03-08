use candid::CandidType;
use ic_cdk::caller;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
//use uuid::Uuid;

type PollId = String;
type Principal = String;

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct Poll {
    id: PollId,
    question: String,
    options: Vec<String>,
    end_time: Option<u64>,
    creator: Principal,
    total_votes: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct Vote {
    poll_id: PollId,
    option: String,
    voter: Principal,
}

thread_local! {
    static POLLS: RefCell<Vec<Poll>> = RefCell::new(Vec::new());
    static VOTES: RefCell<Vec<Vote>> = RefCell::new(Vec::new());
}

#[derive(CandidType, Serialize, Deserialize)]
struct CreatePollRequest {
    question: String,
    options: Vec<String>,
    end_time: Option<u64>,
}

/// 投票を作成します。
///
/// # Arguments
///
/// * `req` - 投票作成リクエスト (CreatePollRequest)
///
/// # Returns
///
/// * `Result<PollId, String>` -
///   - `Ok(PollId)`: 成功した場合、投票IDを返します。
///   - `Err(String)`: 失敗した場合、エラーメッセージを返します。
#[ic_cdk::update]
fn create_poll(req: CreatePollRequest) -> Result<PollId, String> {
    // 投票IDを生成 (現在は固定値)
    let poll_id = "100".to_string(); // Uuid::new_v4().to_string();
    // 投票作成者のPrincipalを取得
    let creator = caller().to_string();

    // バリデーション: 質問が長すぎる場合
    if req.question.len() > 500 {
        return Err("Question is too long".to_string());
    }

    // バリデーション: 選択肢が多すぎる場合
    if req.options.len() > 10 {
        return Err("Too many options".to_string());
    }

    // 投票オブジェクトを作成
    let poll = Poll {
        id: poll_id.clone(),
        question: req.question,
        options: req.options,
        end_time: req.end_time,
        creator,
        total_votes: 0,
    };

    // 投票をグローバル変数に追加
    POLLS.with(|polls| {
        polls.borrow_mut().push(poll);
    });

    // 投票IDを返す
    Ok(poll_id)
}

/// すべての投票を取得します。
///
/// # Returns
///
/// * `Vec<Poll>` - 投票のリスト
#[ic_cdk::query]
fn get_polls() -> Vec<Poll> {
    POLLS.with(|polls| polls.borrow().clone())
}

/// 特定の投票を取得します。
///
/// # Arguments
///
/// * `poll_id` - 投票ID
///
/// # Returns
///
/// * `Option<Poll>` -
///   - `Some(Poll)`: 投票が見つかった場合、投票を返します。
///   - `None`: 投票が見つからなかった場合、Noneを返します。
#[ic_cdk::query]
fn get_poll(poll_id: String) -> Option<Poll> {
    POLLS.with(|polls| {
        polls.borrow().iter().find(|poll| poll.id == poll_id).cloned()
    })
}

#[derive(CandidType, Serialize, Deserialize)]
struct VoteRequest {
    option: String,
}

/// 投票を行います。
///
/// # Arguments
///
/// * `poll_id` - 投票ID
/// * `req` - 投票リクエスト (VoteRequest)
///
/// # Returns
///
/// * `Result<String, String>` -
///   - `Ok(String)`: 成功した場合、"Vote cast successfully" を返します。
///   - `Err(String)`: 失敗した場合、エラーメッセージを返します。
#[ic_cdk::update]
fn vote(poll_id: String, req: VoteRequest) -> Result<String, String> {
    let voter = caller().to_string();

    POLLS.with(|polls| {
        let mut polls = polls.borrow_mut();
        let poll = polls.iter_mut().find(|poll| poll.id == poll_id);

        match poll {
            Some(poll) => {
                if poll.options.contains(&req.option) {
                    // Check if user has already voted
                    let already_voted = VOTES.with(|votes| {
                        votes.borrow().iter().any(|vote| vote.poll_id == poll_id && vote.voter == voter)
                    });

                    if already_voted {
                        return Err("You have already voted in this poll".to_string());
                    }

                    // Create vote
                    let vote = Vote {
                        poll_id: poll_id.clone(),
                        option: req.option.clone(),
                        voter: voter.clone(),
                    };

                    // Add vote
                    VOTES.with(|votes| {
                        votes.borrow_mut().push(vote);
                    });

                    poll.total_votes += 1;
                    return Ok("Vote cast successfully".to_string());
                } else {
                    return Err("Invalid option".to_string());
                }
            }
            None => return Err("Poll not found".to_string()),
        }
    })
}

use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize)]
struct PollResult {
    votes: u64,
    percentage: f64,
}

/// 投票結果を取得します。
///
/// # Arguments
///
/// * `poll_id` - 投票ID
///
/// # Returns
///
/// * `Result<(HashMap<String, PollResult>, u64), String>` -
///   - `Ok((HashMap<String, PollResult>, u64))`: 成功した場合、投票結果と総投票数を返します。
///   - `Err(String)`: 失敗した場合、エラーメッセージを返します。
#[ic_cdk::query]
fn get_poll_results(poll_id: String) -> Result<(HashMap<String, PollResult>, u64), String> {
    POLLS.with(|polls| {
        let polls = polls.borrow();
        let poll = polls.iter().find(|poll| poll.id == poll_id);

        match poll {
            Some(poll) => {
                let total_votes = poll.total_votes;
                let mut results: HashMap<String, PollResult> = HashMap::new();

                for option in &poll.options {
                    let votes = VOTES.with(|votes| {
                        votes.borrow().iter().filter(|vote| vote.poll_id == poll_id && vote.option == *option).count() as u64
                    });

                    let percentage = if total_votes > 0 {
                        (votes as f64 / total_votes as f64) * 100.0
                    } else {
                        0.0
                    };

                    results.insert(option.clone(), PollResult { votes, percentage });
                }

                Ok((results, total_votes))
            }
            None => Err("Poll not found".to_string()),
        }
    })
}

/// 呼び出し元のプリンシパルを取得します。
///
/// # Returns
///
/// * `String` - 呼び出し元のプリンシパル
#[ic_cdk::query]
fn get_principal() -> String {
    caller().to_string()
}

/// 特定のユーザーが作成した投票を取得します。
///
/// # Arguments
///
/// * `principal` - ユーザーのプリンシパル
///
/// # Returns
///
/// * `Vec<Poll>` - ユーザーが作成した投票のリスト
#[ic_cdk::query]
fn get_user_polls(principal: String) -> Vec<Poll> {
    POLLS.with(|polls| {
        polls.borrow().iter().filter(|poll| poll.creator == principal).cloned().collect()
    })
}

/// 特定のユーザーが行った投票を取得します。
///
/// # Arguments
///
/// * `principal` - ユーザーのプリンシパル
///
/// # Returns
///
/// * `Vec<Vote>` - ユーザーが行った投票のリスト
#[ic_cdk::query]
fn get_user_votes(principal: String) -> Vec<Vote> {
    VOTES.with(|votes| {
        votes.borrow().iter().filter(|vote| vote.voter == principal).cloned().collect()
    })
}