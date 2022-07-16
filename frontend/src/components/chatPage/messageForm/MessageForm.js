import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../../reducers/messageReducer';
import { sendMessage } from '../../../reducers/messageReducer';


export const MessageForm = () => {

    const dispatch = useDispatch();    
    const message = useSelector(state => state.userName);
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    

    return (
        <Box 
            component="form" 
            onSubmit = {e  =>
                {
                    e.preventDefault()
                     dispatch(sendMessage({user, socket}))
                    
                }}
                
                sx={{
                    display: 'flex',
                    margin: '20px 5px'
                }}>
        
                    <TextareaAutosize
                        id="outlined-basic" 
                        label="Type a message..." 
                        variant="outlined" 
                        value={message}
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
                        onChange={e => dispatch(setMessage({message: e.target.value}))} 
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