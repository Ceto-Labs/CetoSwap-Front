// import { fromJS } from 'immutable'
import * as constants from './constants'

const initState = {
  isAuth: false,
  identity: '',
  authToken: '',
  accountId: ''
}
const reducer = (state = initState, action) => {
  switch (action.type) {
    case constants.SET_AUTH_STATUS:
      return { ...state, isAuth: action.value }
    case constants.SET_IDENTITY:
      return { ...state, identity: action.value }
    case constants.SET_AUTH_TOKEN:
      return { ...state, authToken: action.value }
    case constants.SET_ACCOUNT_ID:
      return { ...state, accountId: action.value }
    default:
      return state
  }
}

export default reducer
