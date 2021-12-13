export const idlFactory = ({ IDL }) => {
  const ResControllerList = IDL.Record({
    'Limit' : IDL.Nat,
    'Data' : IDL.Vec(IDL.Principal),
    'Offset' : IDL.Nat,
    'Total' : IDL.Nat,
  });
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
  const Stats = IDL.Record({
    'cyclesPerToken' : IDL.Nat,
    'owner' : IDL.Principal,
    'numTokens' : IDL.Nat,
    'cycles' : IDL.Nat,
    'maxNumTokensPerId' : IDL.Nat,
    'maxNumTokens' : IDL.Nat,
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
  const TokenInfo = IDL.Record({
    'decimals' : IDL.Nat64,
    'owner' : IDL.Principal,
    'icon' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'index' : IDL.Nat,
    'symbol' : IDL.Text,
    'canisterId' : IDL.Principal,
  });
  const ControllerSetType = IDL.Variant({
    'add' : IDL.Null,
    'remove' : IDL.Null,
  });
  const TokenRegistry = IDL.Service({
    'createToken' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64, IDL.Nat, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [IDL.Principal],
        [],
      ),
    'deposit' : IDL.Func([], [], []),
    'getControllerList' : IDL.Func([IDL.Nat, IDL.Nat], [ResControllerList], []),
    'getMaxTokenNumber' : IDL.Func([], [IDL.Nat], ['query']),
    'getMaxTokenNumberPerUser' : IDL.Func([], [IDL.Nat], ['query']),
    'getOpRecList' : IDL.Func([IDL.Nat, IDL.Nat], [ResOpRecord], ['query']),
    'getStats' : IDL.Func([], [Stats], ['query']),
    'getTokenCanisterStatus' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(CanisterStatus)],
        [],
      ),
    'getTokenCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getTokenInfo' : IDL.Func([IDL.Principal], [IDL.Opt(TokenInfo)], ['query']),
    'getTokenList' : IDL.Func([], [IDL.Vec(TokenInfo)], ['query']),
    'getUserTokenList' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(TokenInfo)],
        ['query'],
      ),
    'isControler' : IDL.Func([], [IDL.Bool], []),
    'setCyclesPerToken' : IDL.Func([IDL.Nat], [], ['oneway']),
    'setMaxTokenNumber' : IDL.Func([IDL.Nat], [], ['oneway']),
    'setMaxTokenNumberPerUser' : IDL.Func([IDL.Nat], [], ['oneway']),
    'setOwner' : IDL.Func([IDL.Principal], [], ['oneway']),
    'setTokenController' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setUserController' : IDL.Func(
        [IDL.Principal, ControllerSetType],
        [IDL.Bool],
        [],
      ),
    'updateTokenListInfo' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'wallet_balance' : IDL.Func([], [IDL.Nat], ['query']),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return TokenRegistry;
};
export const init = ({ IDL }) => { return []; };
