export const idlFactory = ({ IDL }) => {
  const ResAccounts = IDL.Record({
    'Limit' : IDL.Nat,
    'Accounts' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    'Offset' : IDL.Nat,
    'Total' : IDL.Nat,
  });
  const Time = IDL.Int;
  const Operation__1 = IDL.Variant({
    'burn' : IDL.Null,
    'init' : IDL.Null,
    'mint' : IDL.Null,
    'approve' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const StorageActor = IDL.Service({
    'addRecord' : IDL.Func(
        [
          IDL.Principal,
          Operation__1,
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Nat,
          IDL.Nat,
          Time,
        ],
        [IDL.Nat],
        [],
      ),
  });
  const Metadata = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat64,
    'deployTime' : Time,
    'owner' : IDL.Principal,
    'icon' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'cycles' : IDL.Nat,
    'storageCanister' : IDL.Opt(StorageActor),
    'userNumber' : IDL.Nat,
    'symbol' : IDL.Text,
    'feeTo' : IDL.Principal,
  });
  const Status = IDL.Variant({ 'completed' : IDL.Null, 'failed' : IDL.Null });
  const Operation = IDL.Variant({
    'burn' : IDL.Null,
    'init' : IDL.Null,
    'mint' : IDL.Null,
    'approve' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const TransRec = IDL.Record({
    'id' : IDL.Nat,
    'to' : IDL.Text,
    'fee' : IDL.Nat,
    'status' : Status,
    'Type' : Operation,
    'from' : IDL.Text,
    'hash' : IDL.Text,
    'memo' : IDL.Nat,
    'timestamp' : IDL.Int,
    'amount' : IDL.Nat,
    'feeTo' : IDL.Text,
  });
  const ResTrans = IDL.Record({
    'Limit' : IDL.Nat,
    'Offset' : IDL.Nat,
    'Total' : IDL.Nat,
    'Trans' : IDL.Vec(TransRec),
  });
  const Token = IDL.Service({
    'allowance' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], ['query']),
    'approve' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'balanceOf' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'burn' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'decimals' : IDL.Func([], [IDL.Nat64], ['query']),
    'getAccounts' : IDL.Func([IDL.Nat, IDL.Nat], [ResAccounts], ['query']),
    'getFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getMetadata' : IDL.Func([], [Metadata], ['query']),
    'getSomeAllowed' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getSomeAllowedNumber' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getTrans' : IDL.Func([IDL.Nat, IDL.Nat], [ResTrans], ['query']),
    'getTransByAccount' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [ResTrans],
        ['query'],
      ),
    'getUserNumber' : IDL.Func([], [IDL.Nat], ['query']),
    'mint' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'owner' : IDL.Func([], [IDL.Principal], ['query']),
    'setFee' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Opt(IDL.Nat)],
        [IDL.Bool],
        [],
      ),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'transferFrom' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [IDL.Bool], []),
    'uploadIcon' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], []),
    'wallet_balance' : IDL.Func([], [IDL.Nat], ['query']),
    'wallet_receive' : IDL.Func([], [], []),
    'wallet_send' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Nat, IDL.Nat], []),
  });
  return Token;
};
export const init = ({ IDL }) => {
  return [
    IDL.Text,
    IDL.Text,
    IDL.Nat64,
    IDL.Nat,
    IDL.Principal,
    IDL.Opt(IDL.Vec(IDL.Nat8)),
  ];
};
