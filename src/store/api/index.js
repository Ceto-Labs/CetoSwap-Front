const constants = {
  SET_AUTH_STATUS: 'apiData/SET_AUTH_STATUS',
  SET_USER_INFO: 'USER_INFO',
  SET_USER_ASSETS: 'USER_ASSETS',
  SET_USER_ORDERS: 'USER_ORDERS',
  SET_PRICE_LISTING: 'PRICE_LISTING',
  SET_BEST_PRICE: 'BEST_PRICE',
  SET_QUOTATION: 'QUOTATION'
}
const actions = {
  setAuthStatus: (value) => ({
    type: constants.SET_AUTH_STATUS,
    value
  }),
  setUserInfo: (value) => ({
    type: constants.SET_USER_INFO,
    value
  }),
  setUserAssets: (value) => ({
    type: constants.SET_USER_ASSETS,
    value
  }),
  setUserOrders: (value) => ({
    type: constants.SET_USER_ORDERS,
    value: value
  }),
  setPriceListing: (value) => ({
    type: constants.SET_PRICE_LISTING,
    value: value
  }),
  setBestPrice: (value) => ({
    type: constants.SET_BEST_PRICE,
    value: value
  }),
  setQuotation: (value) => ({
    type: constants.SET_QUOTATION,
    value: value
  })
}
const initState = {
  isAuth: false,
  user_assets: '',
  user_orders: '',
  pricelisting: '',
  bestprice: '',
  quotation: ''
}
const reducer = (state = initState, action) => {
  switch (action.type) {
    case constants.SET_AUTH_STATUS:
      return { ...state, isAuth: action.value }
    case constants.SET_USER_INFO:
      return {
        ...state,
        user_assets: action?.value?.asstes,
        user_orders: { orders: action?.value?.orders, ordersDone: action?.value?.ordersDone },
        pricelisting: action?.value?.pricelisting,
        bestprice: action?.value?.pricelisting?.bestPrice
      }
    case constants.SET_USER_ASSETS:
      return { ...state, user_assets: action.value }
    case constants.SET_USER_ORDERS:
      return { ...state, user_orders: action.value }
    case constants.SET_PRICE_LISTING:
      return { ...state, pricelisting: action.value }
    case constants.SET_BEST_PRICE:
      return { ...state, bestprice: action.value }
    case constants.SET_QUOTATION:
      return { ...state, quotation: action.value }
    default:
      return state
  }
}
export { constants, actions, reducer }
