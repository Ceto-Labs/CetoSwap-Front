export const idlFactory = ({ IDL }) => {
  const TokenID = IDL.Text;
  const Time = IDL.Int;
  const Order = IDL.Record({
    'id' : TokenID,
    'end' : Time,
    'owner' : IDL.Principal,
    'start' : Time,
    'price' : IDL.Nat,
    'belongCID' : IDL.Principal,
  });
  const Error = IDL.Variant({
    'Nft721Unregister' : IDL.Null,
    'Param' : IDL.Null,
    'Authorize' : IDL.Null,
    'InOrderBook' : IDL.Null,
    'Insufficient' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'UnsupportedStandard' : IDL.Null,
    'NotExist' : IDL.Null,
    'NoPermission' : IDL.Null,
    'Existed' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const ContractInfo = IDL.Record({
    'memory_size' : IDL.Nat,
    'max_live_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'heap_size' : IDL.Nat,
    'authorized_users' : IDL.Vec(IDL.Principal),
  });
  const Contract = IDL.Variant({
    'ContractAuthorize' : IDL.Record({
      'isAuthorized' : IDL.Bool,
      'user' : IDL.Principal,
    }),
    'AddOrder' : IDL.Record({ 'id' : TokenID, 'price' : IDL.Nat }),
    'CancelOrder' : IDL.Record({ 'id' : TokenID, 'price' : IDL.Nat }),
    'ExchangeOrder' : IDL.Record({
      'id' : TokenID,
      'seller' : IDL.Principal,
      'buyer' : IDL.Principal,
      'price' : IDL.Nat,
    }),
  });
  const Token = IDL.Variant({
    'Authorize' : IDL.Record({
      'tokenID' : IDL.Principal,
      'isAuthorized' : IDL.Bool,
      'user' : IDL.Principal,
    }),
    'Transfer' : IDL.Record({
      'to' : IDL.Principal,
      'tokenID' : TokenID,
      'from' : IDL.Principal,
      'amount' : IDL.Nat,
    }),
  });
  const Message = IDL.Record({
    'createdAt' : IDL.Int,
    'event' : IDL.Variant({ 'ContractEvent' : Contract, 'TokenEvent' : Token }),
  });
  const NftOrder = IDL.Service({
    'addOrder' : IDL.Func([Order], [Result], []),
    'buy' : IDL.Func([TokenID], [Result], []),
    'cycle' : IDL.Func([], [IDL.Nat], []),
    'getAllOrders' : IDL.Func([], [IDL.Vec(Order)], []),
    'getContractInfo' : IDL.Func([], [ContractInfo], []),
    'getEvents' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'getSupportStandards' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'getUserNfts' : IDL.Func([IDL.Bool], [IDL.Vec(TokenID)], ['query']),
    'getUserOrders' : IDL.Func([], [IDL.Opt(IDL.Vec(Order))], ['query']),
    'pauseOrder' : IDL.Func([IDL.Text], [Result], []),
    'preOrder' : IDL.Func([IDL.Principal, TokenID], [Result], []),
    'updateContractOwners' : IDL.Func([IDL.Principal, IDL.Bool], [Result], []),
    'updateNftCategory' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'wallet_receive' : IDL.Func([], [], []),
    'withdrawNft' : IDL.Func([IDL.Principal, TokenID], [Result], []),
  });
  return NftOrder;
};
export const init = ({ IDL }) => { return []; };
