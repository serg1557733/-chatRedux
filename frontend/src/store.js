//import getUserSocketReducer from './reducers/socketReducer'
import userDataReducer from './reducers/userDataReducer';
import getUserSocketReducer from './reducers/socketReducer';
import messageReducer from './reducers/messageReducer';
import dataReducer from './reducers/dataReducers';
import { configureStore } from '@reduxjs/toolkit';



export  const store = configureStore({
    reducer: {userDataReducer, getUserSocketReducer, messageReducer, dataReducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
      }),
    devTools: process.env.NODE_ENV !== 'production',
})


