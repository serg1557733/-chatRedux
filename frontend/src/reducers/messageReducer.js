import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    startMessages: [],
    message:'',
    editMessage: ''
}

export const sendMessageToSocket = (state, data) => {
             if (state.message && state.message.length < 200) {    //remove to other file
                data.socket.emit('message', {...data.user, message: state.message}); 
                   
            } 
    };


export const editMessageToSocket = (state, data) => {
        if (state.message && state.message.length < 200) {    
           data.socket.emit('editmessage', {...data.user, message: state.message}); //add backend functional later find by id and edit   
       } 
};




const messageReducerSlice = createSlice({
    name: 'messageReducer',
    initialState,
    reducers: {
        storeMessage: (state, action) => {state.message = action.payload.message},
        editMessage: (state, action) => {state.editMessage = action.payload.editMessage},
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
    clearMessage,
    editMessage
    } = actions;
