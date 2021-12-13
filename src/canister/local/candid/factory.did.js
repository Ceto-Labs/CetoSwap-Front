export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Principal, 'err' : IDL.Text });
  const Time = IDL.Int;
  const OpRecord = IDL.Record({
    'opFunc' : IDL.Text,
    'updatetime' : Time,
    'createtime' : Time,
    'aefterBalance' : IDL.Opt(IDL.Nat),
    'caller' : IDL.Principal,
    'index' : IDL.Nat,
    'input' : IDL.Opt(IDL.Text),
    'beforeBalance' : IDL.Opt(IDL.Nat),
  });
  const ResOpRecord = IDL.Record({
    'Limit' : IDL.Nat,
    'Offset' : IDL.Nat,
    'Total' : IDL.Nat,
    'OpRec' : IDL.Vec(OpRecord),
  });
  const Status = IDL.Variant({
    'stopped' : IDL.Null,
    'stopping' : IDL.Null,
    'running' : IDL.Null,
  });
  const CanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Opt(IDL.Nat),
    'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'memory_allocation' : IDL.Opt(IDL.Nat),
    'compute_allocation' : IDL.Opt(IDL.Nat),
  });
  const CanisterStatus = IDL.Record({
    'status' : Status,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : CanisterSettings,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const PairDataInfo = IDL.Record({
    'Reserve0' : IDL.Nat,
    'Reserve1' : IDL.Nat,
    'TotalLiquidity' : IDL.Nat,
  });
  const TokenInfo = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat64,
    'token' : IDL.Principal,
    'deployTime' : Time,
    'owner' : IDL.Principal,
    'icon' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'cycles' : IDL.Nat,
    'userNumber' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Tokens = IDL.Record({ 'token0' : TokenInfo, 'token1' : TokenInfo });
  const PairInfo = IDL.Record({
    'Tvl' : IDL.Nat,
    'Reward' : IDL.Nat,
    'PairCID' : IDL.Principal,
    'Tokens' : Tokens,
  });
  const UserType = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : IDL.Text,
  });
  const Roles = IDL.Variant({
    'controller' : IDL.Null,
    'owner' : IDL.Null,
    'custome' : IDL.Null,
  });
  const UserInfo = IDL.Record({
    'role' : Roles,
    'tokens' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Bool, IDL.Bool),
    'err' : IDL.Text,
  });
  const Factory = IDL.Service({
    'addTokenSub' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'createPair' : IDL.Func([IDL.Principal, IDL.Principal], [Result_1], []),
    'cycle' : IDL.Func([], [IDL.Nat], []),
    'deposit' : IDL.Func([], [], []),
    'existPair' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'getAirDropInfo' : IDL.Func(
        [],
        [IDL.Opt(IDL.Principal), IDL.Opt(IDL.Principal), IDL.Bool, IDL.Nat],
        ['query'],
      ),
    'getOpRecList' : IDL.Func([IDL.Nat, IDL.Nat], [ResOpRecord], []),
    'getPair' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Opt(IDL.Principal)],
        [],
      ),
    'getPairCanisterStatus' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(CanisterStatus)],
        [],
      ),
    'getPairData' : IDL.Func([IDL.Principal], [PairDataInfo], []),
    'getPairList' : IDL.Func([], [IDL.Vec(PairInfo)], []),
    'getTokenList' : IDL.Func([], [IDL.Vec(TokenInfo)], ['query']),
    'getUserInfo' : IDL.Func([IDL.Opt(UserType)], [IDL.Opt(UserInfo)], []),
    'isControllerRole' : IDL.Func([], [IDL.Bool], []),
    'isUserGetAirDrop' : IDL.Func([], [IDL.Bool], ['query']),
    'manageSet' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'registerUser' : IDL.Func([], [Result], []),
    'removeTokenSub' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setAirDropInfo' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Opt(IDL.Principal), IDL.Bool, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'setData' : IDL.Func([IDL.Principal, IDL.Vec(IDL.Int64)], [], ['oneway']),
    'setPairController' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setUserRole' : IDL.Func([IDL.Principal, Roles], [IDL.Bool], []),
    'sortTokens' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Principal, IDL.Principal],
        [],
      ),
    'updateTokenInfo' : IDL.Func([], [], ['oneway']),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Factory;
};
export const init = ({ IDL }) => { return []; };
