import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import devTools from 'remote-redux-devtools'

import { createLogger } from 'redux-logger'

import Reducers from './reducer'

const loggerMiddleware = createLogger()

const Store = createStore(Reducers, compose(applyMiddleware(thunkMiddleware, loggerMiddleware), devTools()))

export default Store