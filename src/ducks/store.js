import userReducer from './userReducer'
import gameReducer from './gameReducer'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'

let rootReducer = combineReducers({
    user: userReducer, game: gameReducer
})

export default createStore(rootReducer, applyMiddleware(promiseMiddleware))