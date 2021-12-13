// import { combineReducers } from 'redux-immutable'
import { combineReducers } from 'redux'

import { reducer as authReducer } from '../components/Auth/store'
import { reducer as apiData } from './api'
// import { reducer as headerReducer } from '../components/TopHeader/store'
// import { reducer as uploadReducer } from '../components/Upload/store'
// import { reducer as poolReducer } from '../pages/Pool/store'

export default combineReducers({
  auth: authReducer,
  apiData : apiData,
  // header: headerReducer,
  // upload: uploadReducer,
  // pool: poolReducer
})
