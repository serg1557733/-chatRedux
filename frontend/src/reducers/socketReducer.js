import {createSlice } from '@reduxjs/toolkit';
import {io} from 'socket.io-client';
import { store } from '../store';
import { removeToken } from './userDataReducer';
import { privateMessage } from './userDataReducer';


const initialState = {
    socketStatus: 'idle',
    socket: null,
    socketUserData: {},
    usersOnline: [],
    startMessages: [],
    allUsers: [],
    writing: false,
    usersWriting: [],
    newMessages : [],
    newPrivateMessages: {},
<<<<<<< HEAD
    newPrivateMessagesArray: []
=======
    friends: []
>>>>>>> new-branch
}



export const getUserSocketSlice = createSlice({
    name: 'userSocket',
    initialState,
    reducers: {
        removeSocket: state => {
            state.socket = null
            state.socketStatus = 'disconnected'},
        getSocket: (state, action) => {
            state.socket = action.payload
            state.socketStatus = 'connected';
        },
        getUser: (state, action) => {state.socketUserData = action.payload},
        getAllMessages: (state, action) => {state.startMessages = action.payload},
        getUsersOnline: (state, action) => {state.usersOnline = action.payload},
        getAllUsers: (state, action) => {state.allUsers = action.payload},
        addNewMessage: (state, action) => {state.newMessages.push(action.payload)}, 
<<<<<<< HEAD
        addNewPrivateMessage: (state, action) => {
            state.newPrivateMessages = action.payload
            state.newPrivateMessagesArray.push(action.payload)
        }, 
=======
        addNewPrivateMessage: (state, action) => {state.newPrivateMessages = action.payload}, 
        friendsFromSocket:(state, action) => {state.friends = action.payload}
>>>>>>> new-branch
        }
    }
);


const {actions, reducer} = getUserSocketSlice;
const getUserSocketReducer = reducer;

export default getUserSocketReducer;
export const {
    removeSocket,
    getSocket, 
    getUser,
    getAllMessages,
    getUsersOnline,
    addNewMessage,
    addNewPrivateMessage,
    getAllUsers,
    friendsFromSocket,
    writing
    } = actions;