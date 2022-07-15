import socketReducer from './reducers/socketReducer';
import userDataReducer from './reducers/userDataReducer';

import { configureStore } from '@reduxjs/toolkit'


export  const store = configureStore({
    reducer: {socketReducer, userDataReducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
})


