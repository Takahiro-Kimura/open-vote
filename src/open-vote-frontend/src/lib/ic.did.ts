import { IDL } from "@dfinity/candid";

const PollOption = IDL.Record({
  text: IDL.Text,
  votes: IDL.Nat64,
});

const Poll = IDL.Record({
  id: IDL.Text,
  question: IDL.Text,
  options: IDL.Vec(PollOption),
  end_time: IDL.Opt(IDL.Nat64),
  creator: IDL.Text,
});

const CreatePollRequest = IDL.Record({
  question: IDL.Text,
  options: IDL.Vec(IDL.Text),
  end_time: IDL.Opt(IDL.Nat64),
});

const VoteRequest = IDL.Record({
  option: IDL.Text,
});

const PollResult = IDL.Record({
  votes: IDL.Nat64,
  percentage: IDL.Float64,
});

const PollResults = IDL.Record({
  results: IDL.Vec(IDL.Record({ option_text: IDL.Text, PollResult })),
});

const ResultPollResults = IDL.Variant({ Ok: PollResults, Err: IDL.Text });

const Vote = IDL.Record({
    poll_id: IDL.Text,
    option: IDL.Text,
    voter: IDL.Text,
});

export const idlFactory = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    create_poll: IDL.Func([CreatePollRequest], [IDL.Text], ["update"]),
    get_poll: IDL.Func([IDL.Text], [IDL.Opt(Poll)], ["query"]),
    get_poll_results: IDL.Func([IDL.Text], [ResultPollResults], ["query"]),
    get_polls: IDL.Func([], [IDL.Vec(Poll)], ["query"]),
    get_principal: IDL.Func([], [IDL.Text], ["query"]),
    get_user_polls: IDL.Func([IDL.Text], [IDL.Vec(Poll)], ["query"]),
    get_user_votes: IDL.Func([IDL.Text], [IDL.Vec(Vote)], ["query"]),
    vote: IDL.Func([IDL.Text, VoteRequest], [[IDL.Text, IDL.Text]], ["update"]),
  });
};
