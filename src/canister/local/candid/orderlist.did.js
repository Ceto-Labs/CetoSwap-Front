export const idlFactory = ({ IDL }) => {
  const UUID = IDL.Text;
  const CoinType = IDL.Record({
    'id' : UUID,
    'cid' : IDL.Opt(IDL.Principal),
    'decimals' : IDL.Nat,
    'name' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const UUID__1 = IDL.Text;
  const ExchangePair = IDL.Record({
    'A' : CoinType,
    'B' : CoinType,
    'id' : UUID__1,
  });
  const UUID__3 = IDL.Text;
  const UUID__2 = IDL.Text;
  const Time = IDL.Int;
  const OrderStatus = IDL.Variant({
    'AllDone' : IDL.Null,
    'PartDone' : IDL.Null,
    'NoDeal' : IDL.Null,
    'Cancel' : IDL.Null,
  });
  const OrderSideType__1 = IDL.Variant({
    'asks' : IDL.Null,
    'bids' : IDL.Null,
  });
  const OrderInfo = IDL.Record({
    'id' : UUID__2,
    'creaetTime' : Time,
    'status' : OrderStatus,
    'oids' : IDL.Vec(IDL.Tuple(UUID__2, IDL.Nat, IDL.Nat)),
    'side' : OrderSideType__1,
    'user' : IDL.Principal,
    'allQuantity' : IDL.Nat,
    'lastUpdateTime' : Time,
    'quantity' : IDL.Nat,
    'price' : IDL.Nat,
  });
  const OrderPriceLevel = IDL.Record({
    'quantity' : IDL.Nat,
    'price' : IDL.Nat,
  });
  const PriceListing = IDL.Record({
    'asks' : IDL.Vec(OrderPriceLevel),
    'bids' : IDL.Vec(OrderPriceLevel),
    'bestPrice' : IDL.Nat,
  });
  const CurrencyInfo = IDL.Record({
    'lockAmount' : IDL.Nat,
    'availableAmount' : IDL.Nat,
    'coinId' : UUID,
    'amount' : IDL.Nat,
  });
  const AssetsInfo = IDL.Record({
    'uid' : IDL.Principal,
    'currencys' : IDL.Vec(IDL.Tuple(UUID, CurrencyInfo)),
  });
  const UserInfos = IDL.Record({
    'ordersDone' : IDL.Vec(OrderInfo),
    'pricelisting' : PriceListing,
    'orders' : IDL.Vec(OrderInfo),
    'asstes' : AssetsInfo,
  });
  const RespDelOrder = IDL.Variant({
    'ok' : UserInfos,
    'err' : IDL.Variant({
      'PoolNotMatch' : IDL.Null,
      'UserAssetError' : IDL.Null,
      'DelError' : IDL.Null,
    }),
  });
  const ExchangePair__1 = IDL.Record({
    'A' : CoinType,
    'B' : CoinType,
    'id' : UUID__1,
  });
  const RespOrderInfo = IDL.Variant({
    'ok' : OrderInfo,
    'err' : IDL.Variant({ 'Other' : IDL.Null, 'NotExisit' : IDL.Null }),
  });
  const RespListing = IDL.Variant({
    'ok' : PriceListing,
    'err' : IDL.Variant({ 'LISTING_SYSTEMERROR' : IDL.Null }),
  });
  const QuotationsInfo = IDL.Record({
    'low' : IDL.Nat,
    'date' : Time,
    'high' : IDL.Nat,
    'close' : IDL.Nat,
    'open' : IDL.Nat,
    'volume' : IDL.Nat,
  });
  const RespQuotationsInfo = IDL.Variant({
    'ok' : IDL.Vec(QuotationsInfo),
    'err' : IDL.Variant({ 'QUOTATIONS_SYSTEMERROR' : IDL.Null }),
  });
  const RespAsset = IDL.Variant({
    'ok' : AssetsInfo,
    'err' : IDL.Variant({ 'NotExisit' : IDL.Null }),
  });
  const RespUserInfos = IDL.Variant({
    'ok' : UserInfos,
    'err' : IDL.Variant({ 'NotExisit' : IDL.Null }),
  });
  const RespUserOrderInfo = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Vec(OrderInfo), IDL.Vec(OrderInfo)),
    'err' : IDL.Variant({ 'Other' : IDL.Null, 'NotExisit' : IDL.Null }),
  });
  const RequestMint = IDL.Record({ 'coinId' : UUID__1, 'amount' : IDL.Nat });
  const MintInfo = IDL.Record({
    'lockAmount' : IDL.Nat,
    'availableAmount' : IDL.Nat,
    'coinId' : UUID,
    'amount' : IDL.Nat,
  });
  const RespMint = IDL.Variant({
    'ok' : MintInfo,
    'err' : IDL.Variant({
      'InvalidCoinId' : IDL.Null,
      'InvalidAmount' : IDL.Null,
      'MintError' : IDL.Null,
    }),
  });
  const OrderSideType = IDL.Variant({ 'asks' : IDL.Null, 'bids' : IDL.Null });
  const RequestNewOrder = IDL.Record({
    'side' : OrderSideType,
    'quantity' : IDL.Nat,
    'price' : IDL.Nat,
    'poolID' : IDL.Text,
  });
  const RespNewOrder = IDL.Variant({
    'ok' : IDL.Record({ 'userinfo' : UserInfos, 'order' : OrderInfo }),
    'err' : IDL.Variant({
      'UserAssetAmountLockError' : IDL.Null,
      'ProcessError' : IDL.Null,
      'InvalidPrice' : IDL.Null,
      'PoolNotMatch' : IDL.Null,
      'InvalidQuantity' : IDL.Null,
      'UserAssetError' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const Orderlist = IDL.Service({
    'burn' : IDL.Func([], [], []),
    'calcelOrder' : IDL.Func([UUID__3], [RespDelOrder], []),
    'cancelAllOrder' : IDL.Func([], [RespDelOrder], []),
    'exchangepair' : IDL.Func([], [ExchangePair__1], ['query']),
    'getOrder' : IDL.Func([UUID__3], [RespOrderInfo], ['query']),
    'getPriceLevelListing' : IDL.Func([], [RespListing], ['query']),
    'getQuotations' : IDL.Func([], [RespQuotationsInfo], ['query']),
    'getUserAssets' : IDL.Func([], [RespAsset], []),
    'getUserInfo' : IDL.Func([], [RespUserInfos], []),
    'getUserOrders' : IDL.Func([], [RespUserOrderInfo], []),
    'getUsersInfo' : IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    'mint' : IDL.Func([RequestMint], [RespMint], []),
    'newOrder' : IDL.Func([RequestNewOrder], [RespNewOrder], []),
    'wallet_balance' : IDL.Func([], [IDL.Nat], ['query']),
    'wallet_receive' : IDL.Func([], [], []),
  });
  return Orderlist;
};
export const init = ({ IDL }) => {
  const UUID = IDL.Text;
  const CoinType = IDL.Record({
    'id' : UUID,
    'cid' : IDL.Opt(IDL.Principal),
    'decimals' : IDL.Nat,
    'name' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const UUID__1 = IDL.Text;
  const ExchangePair = IDL.Record({
    'A' : CoinType,
    'B' : CoinType,
    'id' : UUID__1,
  });
  return [IDL.Principal, ExchangePair];
};
