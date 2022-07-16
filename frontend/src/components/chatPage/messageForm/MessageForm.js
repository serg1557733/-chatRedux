import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, storeMessage } from '../../../reducers/messageReducer';
import {  useState} from 'react';


export const MessageForm = () => {

    const dispatch = useDispatch();  
      
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const [message, setMessage] = useState({message: ''});



    return (
        <Box 
            component="form" 
            onSubmit = {e  =>
                {
                    e.preventDefault()
                     dispatch(sendMessage({user, socket}))
                     setMessage({message: ''})
                }}
                
                sx={{
                    display: 'flex',
                    margin: '20px 5px'
                }}>
        
                    <TextareaAutosize
                        id="outlined-basic" 
                        label="Type a message..." 
                        variant="outlined" 
                        value={message.message}
                        placeholder='type you message...'
                        minRows={3}
                        maxRows={4}
                        // onKeyPress={(e) => {
                        //     if (e.key === "Enter")   {
                        //         e.preventDefault();
                        //         dispatch(sendStoreMessage())
                        //         dispatch(setMessage({message: ''}));// add localstorage save message later
                        //     }
                        // }}
                        onChange={e => { 
                            dispatch(storeMessage({message: e.target.value}))
                            setMessage({message: e.target.value})}
                        } 
                        style={{
                            width: '80%',
                            resize: 'none',
                            borderRadius: '4px',
                        }}
                        /> 
                    <Button 
                        variant="contained" 
                        type='submit'
                        disabled={user?.isMutted}
                        style={{
                            width: '20%',
                        }}
                    >
                        Send
                    </Button>
        </Box>            
    )

}