import { useDispatch, useSelector} from 'react-redux';
import { useState } from 'react';
import { editMessage } from '../../reducers/messageReducer';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { storeMessage } from '../../reducers/messageReducer';
import { deleteMessage } from '../../reducers/messageReducer';

//test
export const MessageEditorMenu = () => {

    const dispatch = useDispatch();

    const editOldMessage = useSelector(state => state.messageReducer.editMessage)
    const messageId = useSelector(state => state.messageReducer.messageId)
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const [message, setMessage] = useState({message: editOldMessage});



    return (
        <div>
            <button
             onClick={() => {
                dispatch(editMessage({socket, editMessage: message, messageId }))
                dispatch(editMessage({socket: null, editMessage: '', messageId: '' }))
                
            }}
            > Edit</button>
            <button
             onClick={() => {
                dispatch(deleteMessage({socket, messageId}))  
                dispatch(editMessage({socket: null, editMessage: '', messageId: '' })) 
                
            }}
            
            > Delete </button>
            <button
                onClick={() => {
                    dispatch(editMessage({socket: null, editMessage: '', messageId: '' }))  
                }}
            > cancel</button>
               <TextareaAutosize
                            id="outlined-basic" 
                            variant="outlined" 
                            value={message.message }
                            placeholder='type you message...'
                            minRows={3}
                            maxRows={4}
                            className='textArea'
                            onChange={e => { 
                                   dispatch(storeMessage({message: e.target.value}))
                                   setMessage({message: e.target.value})
                                }
                            } 
                        
                        /> 
        </div>
    )
}
