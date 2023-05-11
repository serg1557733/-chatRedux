import { createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendMessageToSocket } from '../utils/messagesSocketEvents';
import { deleteMessageHandler } from '../utils/messagesSocketEvents';
import { editMessageHandler } from '../utils/messagesSocketEvents';

const initialState = {
    message:'',
    editMessage: '',
    messageId: '', 
    files: [],
    isLoading: false,
    loadingPercentage: 0,
    ref: null
}

const POST_FILES_URL = process.env.NODE_ENV == "development"? process.env.REACT_APP_SERVER_URL + `/files` : process.env.REACT_APP_PUBLIC_URL + `/files`;

export const fileMessage = createAsyncThunk(
    'messageReducer/fileMessageStatus',
    async (payload) => {
        const {files, axiosConfig} = payload;
        const token = localStorage.getItem('token')
        try {
            const formData = new FormData();
            if(files?.length) {
                 for (let i = 0; i < files?.length; i++) {
                formData.append('files', files[i])
                }
            } else {
                formData.append('files', files)
            }
            formData.append('token', token)
            const response = await axios.post(POST_FILES_URL, formData,axiosConfig);
            return await response;
            
        } catch (err) {
            console.log('Error messageReducer thunk', err)
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
        clearMessage: (state) => {state.message = ''}

    },
    extraReducers: (bilder) => {
    bilder
    .addCase(fileMessage.fulfilled, (state, action) => {
        state.files = action.payload.data?.files           
    })  
    .addCase(fileMessage.pending, (state, action) => {
        console.log('pending', fileMessage.pending())
    })
    .addCase(fileMessage.rejected, (state, action) => {
            console.log('post file rejected', action.payload)
    })}
});

const {actions, reducer} = messageReducerSlice;
const messageReducer = reducer;

export default messageReducer;

export const {
    storeMessage, 
    sendMessage,
    sendPrivateMessage,
    clearMessage,
    editMessage,
    deleteMessage
    } = actions;
