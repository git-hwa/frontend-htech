import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable'
import { createBrowserHistory } from 'history'

import createRootReducer from 'store/reducers'
import rootSaga from 'store/sagas'

const transformerConfig = {
  whitelistPerReducer: {},
}

const persistConfig = {
  key: 'bam',
  storage,
  whitelist: ['visitor'],

  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator(transformerConfig)],
}

export default () => {
  const history = createBrowserHistory()
  const middleware = [thunkMiddleware, routerMiddleware(history)]
  
  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  let enhancer = applyMiddleware(...middleware)

  const persistedReducer = persistReducer(
    persistConfig,
    createRootReducer(history),
  )

  const store = createStore(persistedReducer, enhancer)

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga)

  return { store, persistor, history }
}