import { IDL } from '@dfinity/candid';

const VoteOption = IDL.Record({
  'id': IDL.Text,
  'text': IDL.Text,
  'count': IDL.Nat,
});

const Poll = IDL.Record({
  'id': IDL.Text,
  'title': IDL.Text,
  'description': IDL.Text,
  'options': IDL.Vec(VoteOption),
  'createdBy': IDL.Text,
  'createdAt': IDL.Text,
  'endDate': IDL.Text,
  'isActive': IDL.Bool,
});

const CreatePoll = IDL.Record({
  'title': IDL.Text,
  'description': IDL.Text,
  'options': IDL.Vec(IDL.Record({ 'text': IDL.Text })),
  'endDate': IDL.Text,
  'isActive': IDL.Bool,
});

const VoteRequest = IDL.Record({
  'pollId': IDL.Text,
  'optionId': IDL.Text,
});

export const idlFactory = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    'create_poll': IDL.Func([CreatePoll], [IDL.Text], ['update']),
    'get_poll': IDL.Func([IDL.Text], [IDL.Opt(Poll)], ['query']),
    'get_polls': IDL.Func([], [IDL.Vec(Poll)], ['query']),
    'get_user_polls': IDL.Func([IDL.Principal], [IDL.Vec(Poll)], ['query']),
    'vote': IDL.Func([VoteRequest], [], ['update']),
    'get_principal': IDL.Func([], [IDL.Principal], ['query']),
  });
};