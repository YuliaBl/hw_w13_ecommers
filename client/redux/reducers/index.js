import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import cardreducer from './cardreducer'
import logsreducer from './logsreducer'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    cardreducer,
    logsreducer
  })

export default createRootReducer
