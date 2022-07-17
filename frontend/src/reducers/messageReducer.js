import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    startMessages: [],
    message:''
}

export const sendMessageToSocket = (state, data) => {
             if (state.message && state.message.length < 200) {    //remove to other file
                data.socket.emit('message', {...data.user, message: state.message}); 
                   
            } 
    };

const messageReducerSlice = createSlice({
    name: 'messageReducer',
    initialState,
    reducers: {
        storeMessage: (state, action) => {state.message = action.payload.message},
        sendMessage: (state, action) => sendMessageToSocket(state, action.payload),
        clearMessage: (state) => {state.message = ''}
        
    },
});

const {actions, reducer} = messageReducerSlice;
const messageReducer = reducer;

export default messageReducer;

export const {
    storeMessage, 
    sendMessage,
    clearMessage
    } = actions;
