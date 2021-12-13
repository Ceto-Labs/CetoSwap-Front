export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const PairDataInfo = IDL.Record({
    'Reserve0' : IDL.Nat,
    'Reserve1' : IDL.Nat,
    'TotalLiquidity' : IDL.Nat,
  });
  const UserTokens = IDL.Record({
    'Token0Num' : IDL.Nat,
    'Token1Num' : IDL.Nat,
    'Liquidity' : IDL.Nat,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(PairDataInfo, UserTokens),
    'err' : IDL.Text,
  });
  const Time = IDL.Int;
  const FailRecord = IDL.Record({
    'to' : IDL.Text,
    'status' : IDL.Nat8,
    'updatetime' : Time,
    'tokenCID' : IDL.Principal,
    'from' : IDL.Text,
    'createtime' : Time,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
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
  const Result_2 = IDL.Variant({ 'ok' : UserTokens, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'err' : IDL.Text,
  });
  const Pair = IDL.Service({
    'addLiquidity' : IDL.Func(
        [
          IDL.Principal,
          IDL.Nat,
          IDL.Principal,
          IDL.Nat,
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
        ],
        [Result],
        [],
      ),
    'approve' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'balanceOf' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'cycle' : IDL.Func([], [IDL.Nat], []),
    'dealFail' : IDL.Func([IDL.Nat64], [], ['oneway']),
    'estimateLiquidity' : IDL.Func([IDL.Nat], [IDL.Nat, IDL.Nat], ['query']),
    'flashSwap' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'getAllData' : IDL.Func([IDL.Principal], [Result_3], ['query']),
    'getAmountOut' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat], [IDL.Nat], []),
    'getCumulativePrices' : IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    'getFailRecord' : IDL.Func([], [IDL.Vec(FailRecord)], []),
    'getOpRecList' : IDL.Func([IDL.Nat, IDL.Nat], [ResOpRecord], ['query']),
    'getPairData' : IDL.Func([], [PairDataInfo], ['query']),
    'getPrimitiveData' : IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat], []),
    'getReserves' : IDL.Func([], [IDL.Nat, IDL.Nat], []),
    'getTokens' : IDL.Func([], [IDL.Principal, IDL.Principal], ['query']),
    'getTotalLiqudity' : IDL.Func([], [IDL.Nat], ['query']),
    'getTotalSwapFee' : IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    'getUserData' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    'removeLiquidity' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Nat],
        [Result_1],
        [],
      ),
    'setData' : IDL.Func([IDL.Vec(IDL.Int64)], [], ['oneway']),
    'skim' : IDL.Func([IDL.Principal], [], []),
    'swapWithTransferTokens' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Principal, IDL.Nat, IDL.Principal],
        [Result],
        [],
      ),
    'sync' : IDL.Func([], [], ['oneway']),
    'transferFrom' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat], [IDL.Bool], []),
  });
  return Pair;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal];
};
