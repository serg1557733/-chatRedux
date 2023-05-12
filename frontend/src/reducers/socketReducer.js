import {createSlice } from '@reduxjs/toolkit';

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
    newPrivateMessagesArray: [],
    friends: []
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
        addNewPrivateMessage: (state, action) => {
            state.newPrivateMessages = action.payload
            state.newPrivateMessagesArray.push(action.payload)
        }, 
        // addNewPrivateMessage: (state, action) => {state.newPrivateMessages = action.payload}, 
        friendsFromSocket:(state, action) => {state.friends = action.payload}
        
        }
    });


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