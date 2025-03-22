import type { Poll, CreatePoll, VoteRequest } from '@shared/schema';
// import { Actor, HttpAgent } from '@dfinity/agent';
// import { idlFactory } from './ic.did';
import { open_vote_backend } from 'declarations/open-vote-backend';

class ICClient {
  //private agent: HttpAgent;
  private actor: any;

  constructor() {
    // // グローバルFetchの設定
    // const fetch = window.fetch.bind(window);

    // this.agent = new HttpAgent({
    //   host: process.env.NODE_ENV === 'production' 
    //     ? 'https://ic0.app' 
    //     : 'http://127.0.0.1:4943',
    //   fetch: fetch // 明示的にfetchを指定
    // });

    // // ローカル開発時はフェッチルートの証明をスキップ
    // if (process.env.NODE_ENV !== "production") {
    //   this.agent.fetchRootKey().catch(err => {
    //     console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    //     console.error(err);
    //   });
    // }

    this.actor = open_vote_backend
  }

  async createPoll(poll: any): Promise<string> {  // todo: anyをCreatePollにする
    try {
      console.log('Creating poll with data:', poll);
      const result = await this.actor.create_poll(poll);
      console.log('Create poll result:', result);
      return result;
    } catch (error) {
      console.error('Failed to create poll:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  async getPoll(id: string): Promise<Poll | null> {
    try {
      console.log('Getting poll:', id);
      const result = await this.actor.get_poll(id);
      console.log('Get poll result:', result);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Failed to get poll:', error);
      return null;
    }
  }

  async getPolls(): Promise<Poll[]> {
    try {
      console.log('Fetching polls...');
      const polls = await this.actor.get_polls();
      console.log('Fetched polls:', polls);
      return polls || [];
    } catch (error) {
      console.error('Failed to get polls:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      return []; // エラー時は空配列を返す
    }
  }

  async getUserPolls(principal: string): Promise<Poll[]> {
    try {
      console.log('Fetching user polls for principal:', principal);
      const polls = await this.actor.get_user_polls(principal);
      console.log('Fetched user polls:', polls);
      return polls || [];
    } catch (error) {
      console.error('Failed to get user polls:', error);
      return []; // エラー時は空配列を返す
    }
  }

  async vote(request: VoteRequest): Promise<void> {
    try {
      console.log('Submitting vote:', request);
      await this.actor.vote(request);
      console.log('Vote submitted successfully');
    } catch (error) {
      console.error('Failed to vote:', error);
      throw error;
    }
  }

  async getPrincipal(): Promise<string> {
    try {
      const principal = await this.actor.get_principal();
      console.log('Got principal:', principal);
      return principal;
    } catch (error) {
      console.error('Failed to get principal:', error);
      return 'anonymous';
    }
  }
}

export const ic = new ICClient();