import { isValidPayload } from "../utils/validations/isValidPayload";
import { isValidUserName } from '../utils/validations/isValidUserName';
import { sendForm } from '../utils/sendForm';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    userName:'',
    password: '',
    userLoadingStatus: 'idle',
    token: '',
    socket: null, 
    responseMessage: '',
    showUserInfoBox: false,
    isPrivatChat: false,
    toUser: {},
    avatar: ''
}
const POST_URL =  process.env.REACT_APP_SERVER_URL + '/login';
const GET_AVATAR_URL = process.env.REACT_APP_SERVER_URL +  '/avatar';

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


    export const getUserAvatar = createAsyncThunk(
        'userData/getUserAvatar',
        async (file) => {
             try {
                const token = localStorage.getItem('token') ; //use axios becose fetch dont send files
                const formData = new FormData()
                formData.append('file', file)
                formData.append('token', token)
                const response = await axios.post(GET_AVATAR_URL, formData);
                return await response;
            }catch (err) {
                console.log('error getUserData thunk', err)
                return err?.message
            }
        });
                    

const getUserDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        privateMessage: (state, action)=> {
            state.isPrivatChat = true;
            state.toUser = action.payload.toUser
        },
        generalMessage: (state, action)=> {
            state.isPrivatChat = false;
        },
        setUserName: (state, action) => {state.userName = action.payload.userName},
        setUserPassword: (state, action) => {state.password = action.payload.password},
            
        removeToken: state => {
            state.token = ''
        },
        deleteResponseMessage: state => {state.responseMessage = ''},
        showUserInfoBox: state => {
            state.showUserInfoBox = !state.showUserInfoBox  //replace later to other reducer file
          //localStorage.setItem('showBox', !state.showUserInfoBox)
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
            state.responseMessage = `Something went wrong...`
        })
            .addCase(getUserAvatar.fulfilled, (state, action) => {
                state.avatar = action.payload.data?.avatarUrl
                
        })
            .addCase(getUserAvatar.rejected, (state, action) => {
                console.log('get avatar rejected', action.payload)
        })
    }}   
);

const {actions, reducer} = getUserDataSlice;
const userDataReducer = reducer;

export default userDataReducer;
export const {
    setUserName,
    setUserPassword,
    removeToken,
    deleteResponseMessage,
    showUserInfoBox,
    privateMessage,
    generalMessage
} = actions;
