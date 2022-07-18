import { isValidPayload } from "../utils/validations/isValidPayload";
import { isValidUserName } from '../utils/validations/isValidUserName';
import { sendForm } from '../utils/sendForm';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userName:'',
    password: '',
    userLoadingStatus: 'idle',
    token: '',
    socket: null, 
    responseMessage: '',
    showUserInfoBox: true
}

const POST_URL =  process.env.REACT_APP_POST_URL || 'http://localhost:5000/login';

export const getUserData = createAsyncThunk(
    'userData/getUser',
     ( t , thunkAPI) => {
      const userData = thunkAPI.getState().userDataReducer;
        if(userData.userName){
            if(isValidPayload({...userData}) && isValidUserName({...userData}))
                try {
                    const response =  sendForm(POST_URL, userData);
                    return response;
                }catch (err) {
                    console.log('error getUserData thunk', err)
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
            
        removeToken: state => {
            state.token = ''
        },
        deleteResponseMessage: state => {state.responseMessage = ''},
        showUserInfoBox: state => {
            state.showUserInfoBox = !state.showUserInfoBox  //replace later to other reducer file
            localStorage.setItem('showBox', !state.showUserInfoBox)
        },
    },
    extraReducers: (builder) => { 
       builder
          .addCase(getUserData.fulfilled, (state, action) => {
            if(action.payload?.token){
                state.token = action.payload.token
                state.userLoadingStatus = 'success'
                localStorage.setItem('token', action.payload.token)
            }
            if(action.payload?.message){
                state.responseMessage = action.payload.message
                state.userLoadingStatus = 'error';
            }
          })
           .addCase(getUserData.rejected, (state, action) => {
               state.userLoadingStatus = 'error';
               if(action.payload?.message){
                state.responseMessage = action.payload.message
            }
            state.responseMessage = 'Something went wrong...'
          })
        },
        
});

const {actions, reducer} = getUserDataSlice;
const userDataReducer = reducer;

export default userDataReducer;
export const {
    setUserName,
    setUserPassword,
    removeToken,
    deleteResponseMessage,
    showUserInfoBox
} = actions;
