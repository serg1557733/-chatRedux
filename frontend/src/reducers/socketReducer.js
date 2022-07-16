import {createSlice } from '@reduxjs/toolkit';
import {io} from 'socket.io-client';
import { store } from '../store';
import { removeToken } from './userDataReducer';


const initialState = {
    socketStatus: 'idle',
    socket: null,
    socketUserData: {},
    usersOnline: [],
    startMessages: [],
    allUsers: []
}

const SOCKET_URL =  process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'; 

const connectToSocket = () => {
        try {
            const token = localStorage.getItem('token');
            if(token){
                const socket = io.connect( 
                    SOCKET_URL, 
                    {auth: {token}})
                    socket.on('connected', data => {
                                store.dispatch(getUser(data));
                            })
                            .on('allmessages', (data) => {
                                store.dispatch(getAllMessages(data));
                            })
                            .on('usersOnline', (data) => {
                                store.dispatch(getUsersOnline(data));
                            })
                            .on('allDbUsers', (data) => {
                                store.dispatch(getAllUsers(data));
                            })
                            .on('disconnect', (data) => {
                                if(data === 'io server disconnect') {
                                    socket.disconnect();
                                    store.dispatch(removeToken()); 
                                }
                            })
                            .on('error', e => {console.log('On connected', e)}); 
                return socket;       
            }   
        } catch (error) {
            console.log('error connecting to socket ', error)
        } 
    };

    
export const getUserSocketSlice = createSlice({
    name: 'userSocket',
    initialState,
    reducers: {
        removeSocket: state => {
            state.socket = null
            state.socketStatus = 'disconnected'},
        getSocket: state => {
            state.socket = connectToSocket();
            state.socketStatus = 'connected';
        },
        getUser: (state, action) => {state.socketUserData = action.payload},
        getAllMessages: (state, action) => {state.startMessages = action.payload},
        getUsersOnline: (state, action) => {state.usersOnline = action.payload},
        getAllUsers: (state, action) => {state.allUsers = action.payload}
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
    getAllUsers
} = actions;