//import getUserSocketReducer from './reducers/socketReducer'
import userDataReducer from './reducers/userDataReducer';
import getUserSocketReducer from './reducers/socketReducer';
import messageReducer from './reducers/messageReducer';
import { configureStore } from '@reduxjs/toolkit';



export  const store = configureStore({
    reducer: {userDataReducer,messageReducer, getUserSocketReducer },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
      }),
    devTools: process.env.NODE_ENV !== 'production',
})


