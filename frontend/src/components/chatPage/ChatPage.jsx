import { useEffect, useState} from 'react';
import {Button, Box} from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { MessageForm } from './messageForm/MessegaForm';
import { UserInfo } from './userInfo/UserInfo';
import { store } from '../../store';
import { removeToken} from '../../reducers/userDataReducer'
import { useDispatch, useSelector } from 'react-redux';
import {getSocket} from'../../reducers/socketReducer';
import { sendMessage, storeMessage } from '../../reducers/messageReducer';
import { editMessage } from '../../reducers/messageReducer';
import { SwitchButton } from './SwitchButton';
import './chatPage.scss';


export const ChatPage = () => {

    const SOCKET_EVENTS = process.env.REACT_APP_SERVER_URL || ['allmessages', 'usersOnline', 'allDbUsers']

    const dispatch = useDispatch();

    const token = useSelector(state => localStorage.getItem('token') || state.userDataReducer.token);
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const editOldMessage = useSelector(state => state.messageReducer.editMessage)
    let showUserInfoBox = useSelector(state => state.messageReducer.showUserInfoBox)// || localStorage.getItem('showBox');

    const [message, setMessage] = useState({message: ''});
    const isTabletorMobile = (window.screen.width < 730);

    useEffect(() => {
        if(token){
            SOCKET_EVENTS.map(event => dispatch(getSocket(event)))       
        }
    }, [token, editOldMessage, showUserInfoBox])
 
    return (
        <div className='rootContainer'>

            <Box className = 'rootBox'>


                { isTabletorMobile ? <SwitchButton/> : null}
                
                <Box className ={isTabletorMobile ? 'rootMessageFormMobile':'rootMessageForm'} >
                    
                    <MessageForm/>

                    <Box 
                        component="form" 
                        onSubmit = {e  => {
                                        e.preventDefault()
                                        dispatch(sendMessage({user, socket}))
                                        dispatch(getSocket('allmessages'))
                                        dispatch(editMessage({editMessage: ''}))
                                        setMessage({message: ''})
                                    }}
                        sx={(isTabletorMobile)?{
                            display: 'flex',
                            margin: '10px 2px'}
                        :{
                            display: 'flex',
                            margin: '20px 5px'}
                           
                        }>
            
                        <TextareaAutosize
                            id="outlined-basic" 
                            label="Type a message..." 
                            variant="outlined" 
                            value={message.message || editOldMessage}
                            placeholder='type you message...'
                            minRows={3}
                            maxRows={4}
                            className='textArea'
                            onKeyPress={(e) => {
                                if (e.key === "Enter")   {
                                    e.preventDefault();
                                    dispatch(sendMessage({user, socket}))
                                    dispatch(getSocket('allmessages'))
                                    dispatch(editMessage({editMessage: ''}))
                                    setMessage({message: ''})
                                }
                            }}
                            onChange={e => { 
                                dispatch(storeMessage({message: e.target.value}))
                                setMessage({message: e.target.value})}
                            } 
                        
                        /> 

                        <Button 
                            variant="contained" 
                            type='submit'
                            disabled={user?.isMutted}
                            style={{width: '20%'}}
                        >
                            Send
                        </Button>

                    </Box>            
                </Box>
                <Box className={isTabletorMobile?'usersBoxMobile':'usersBox'}
                  sx = {showUserInfoBox ? {
                        transform: "translateX(100%)",
                        display: "none"
                        }: {}}>
                    <Button 
                        sx={isTabletorMobile ? 
                            {
                                maxHeight:'25px', 
                                maxWidth: '20px'} 
                            :{margin:'10px 5px'}}
                        variant="outlined"
                        onClick={()=> {
                                localStorage.removeItem('token');
                                socket.disconnect(); 
                                dispatch(removeToken());
                                }}>
                        Logout
                    </Button>

                    <UserInfo/>

                </Box>

            </Box>
        </div>
    )
}