import { isValidPayload } from "../components/loginForm/utils/validations/isValidPayload";
import { isValidUserName } from '../components/loginForm/utils/validations/isValidUserName';
import { sendForm } from '../components/loginForm/utils/sendForm';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userName:'',
    password: '',
    userLoadingStatus: 'idle',
    token: '',
    socket: null,
    responseMessage: ''
}


const POST_URL =  process.env.REACT_APP_POST_URL || 'http://localhost:5000/login';

export const getUserData = createAsyncThunk(
    'userData/getUser',
     ( t , thunkAPI) => {
      const userData = thunkAPI.getState().userDataReducer;
          if(userData.userName){
        if(isValidPayload({...userData}) && isValidUserName({...userData}))
            console.log('getUserData', userData)
            try {
                const response =  sendForm(POST_URL, userData);
                return response;
            }catch (err) {
                console.log('err', err)
                return err?.message
            }
        }
    });

const getUserDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserName: (state, action) => {state.userName = action.payload.userName},
        setUserPassword: (state, action) => {state.password = action.payload.password},
        removeToken: (state, action) => {state.token = ''}
    },
    extraReducers: (builder) => { 
       builder
          .addCase(getUserData.fulfilled, (state, action) => {
            state.userLoadingStatus = 'fulfilled'
            if(action.payload.token){
                state.token = action.payload.token
                localStorage.setItem('token', action.payload.token)
            }
            if(action.payload?.message){
                state.responseMessage = action.payload.message
                localStorage.setItem('token', action.payload.token)
            }
            console.log('fulfilled',action.payload, action.payload.message)
          })
           .addCase(getUserData.rejected, (state) => {
               state.userLoadingStatus = 'error';
               console.log('rejected', state)
          })
        }
});

const {actions, reducer} = getUserDataSlice;
const userDataReducer = reducer;

export default userDataReducer;
export const {
    setUserName,
    setUserPassword,
    removeToken
} = actions;
