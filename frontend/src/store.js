import tokenReducer from './reducers/tokenReducer';
import socketReducer from './reducers/socketReducer';
import userDataReducer from './reducers/userDataReducer';

import { configureStore } from '@reduxjs/toolkit'


export  const store = configureStore({
    reducer: {tokenReducer, socketReducer, userDataReducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
})


