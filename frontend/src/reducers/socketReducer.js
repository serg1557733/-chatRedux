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
    newPrivateMessagesArray: []
}

const SOCKET_URL = process.env.REACT_APP_SERVER_URL;


const connectToSocket = (event) => {
        try {
            const token = localStorage.getItem('token');
            if(token){
                const socket = io.connect(    //need to add other function for connecting
                    SOCKET_URL, 
                    {auth: {token}})
                    socket.on('connected', data => {
                                store.dispatch(getUser(data));
                               // socketEventsDispatch(socket)
                            })
                            .on(event, (data) => {
                                   switch (event){
                                    case 'allmessages':
                                        store.dispatch(getAllMessages(data));
                                        break;
                                    case 'allDbUsers':
                                        store.dispatch(getAllUsers(data));
                                        break;
                                    default: 
                                        break;
                                    }
                                })
                                
                            .on('newmessage', (data) => {
                                store.dispatch(addNewMessage(data))
                                })
                            .on('private', (data) => {
                               store.dispatch(addNewPrivateMessage(data))
                                   })
                            .on('ban', (data) => {
                                store.dispatch(removeToken()); 
                                localStorage.removeItem('token');
                                })
                            .on('usersOnline', (data) => {
                                    store.dispatch(getUsersOnline(data))
                                })
                            .on('friends', data => {
                                    console.log('friends from server', data)
                                })
                            .on('disconnect', (data) => {
                                if( data === 'io server disconnect') {
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

// const socketEventsDispatch = (socket) => {
//     socket
//         .on('writing', (data) => {
//                 console.log(data)
//                 store.dispatch(writing(data));   
//      })
// }


export const getUserSocketSlice = createSlice({
    name: 'userSocket',
    initialState,
    reducers: {
        removeSocket: state => {
            state.socket = null
            state.socketStatus = 'disconnected'},
        getSocket: (state, action) => {
            state.socket = connectToSocket(action.payload);
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
    writing
    } = actions;