import { createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';


const initialState = {
    message:'',
    editMessage: '',
    messageId: '', 
    files: [],
    percentage: 0,
    ref: null
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const POST_FILES_URL = SERVER_URL + '/files';

export const sendMessageToSocket = (state, data) => {
             if (!!state.message && state.message.length < 200) {    //remove to other file
                data.socket.emit('message', {...data.user, message: state.message}); 
            } 
    };

export const deleteMessageHandler = (state, data) => {
    data.socket.emit('deleteMessage', {messageId: data.messageId, token: data.socket.auth.token});  
};

    
export const editMessageHandler = (state, data) => {
    if(data.socket){
         data.socket.emit('editmessage', {messageNewText: data.editMessage.message, messageId: data.messageId, token: data.socket.auth.token}); //add backend functional later find by id and edit 
    }
};

export const fileMessage = createAsyncThunk(
    'messageReducer/fileMessage',
    async (files) => {
        const token = localStorage.getItem('token')
        try {
            const formData = new FormData();
            if(files.length) {
                 for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i])
                }
            } else {
                formData.append('files', files)
            }
            formData.append('token', token)
            const response = await axios.post(POST_FILES_URL, formData,{
                // onUploadProgress: (progress) => {
                //     const {loaded, total} = progress;
                //     const persentage = Math.floor(loaded * 100 / total);
                // },
                    headers: {
                      "Content-type": "multipart/form-data",
                    }
                  });
                  
            return await response;
            
        } catch (err) {
            console.log('error messageReducer thunk', err)
                return err?.message
            
            }
        })


        
const messageReducerSlice = createSlice({
    name: 'messageReducer',
    initialState,
    reducers: {
        storeMessage: (state, action) => {state.message = action.payload.message},
        editMessage: (state, action) => {
             editMessageHandler(state, action.payload)
             state.editMessage = action.payload.editMessage;
             state.messageId = action.payload.messageId;
             state.ref = action.payload.ref;
            },
        deleteMessage: (state, action) => {
            deleteMessageHandler(state, action.payload)
           
        },
        sendMessage: (state, action) => sendMessageToSocket(state, action.payload),
        clearMessage: (state) => {state.message = ''},
        extraReducers: (bilder) => 
            bilder
            .addCase(fileMessage.fulfilled, (state, action) => {
                state.files = action.payload.data?.files
                
        })
            .addCase(fileMessage.rejected, (state, action) => {
                console.log('post file rejected', action.payload)
        })
        
    },
});

const {actions, reducer} = messageReducerSlice;
const messageReducer = reducer;

export default messageReducer;

export const {
    storeMessage, 
    sendMessage,
    clearMessage,
    editMessage,
    deleteMessage
    } = actions;
