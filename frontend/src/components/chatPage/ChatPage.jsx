import { useEffect, useState} from 'react';
import {Button, Box} from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { MessageForm } from './messageForm/MessegaForm';
import { UserInfo } from './userInfo/UserInfo';
import { store } from '../../store';
import { removeToken} from '../../reducers/userDataReducer'
import { useDispatch, useSelector } from 'react-redux';
import {getSocket} from'../../reducers/socketReducer';
import { sendMessage, storeMessage, fileMessage } from '../../reducers/messageReducer';
import { editMessage } from '../../reducers/messageReducer';
import { SwitchButton } from './SwitchButton';
import { MessageEditorMenu } from './MessageEditorMenu.jsx';
import imgBtn from '../../assets/img/gg.png';
import imgBtnPhoto from '../../assets/img/photo.png'
import './chatPage.scss';
import WebcamCapture from './service/webCam/WebcamCapture';
import useSound from 'use-sound';
import getNotif from '../../assets/sendSound.mp3'

export const ChatPage = () => {

    const SOCKET_EVENTS = ['allmessages', 'usersOnline', 'allDbUsers']

    const dispatch = useDispatch();

    const token = useSelector(state => localStorage.getItem('token') || state.userDataReducer.token);
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const editOldMessage = useSelector(state => state.messageReducer.editMessage)
    let showUserInfoBox = useSelector(state => state.messageReducer.showUserInfoBox)// || localStorage.getItem('showBox');

    const [message, setMessage] = useState({message: ''});
    const [isUserTyping, setUserTyping] = useState([]);
    const [isCamActiv, setisCamActiv] = useState(false);
    
    const isTabletorMobile = (window.screen.width < 730);

    const [play] = useSound(getNotif);



    const webcamEventHandler = async () => {
            let stream = null;
            try {
              stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300 }});
              if (stream){
                setisCamActiv(!isCamActiv)
              }
            } catch(err) {
              console.log(err)
            }
            setisCamActiv(!isCamActiv) // test camera
    }


    useEffect(() => {
        if(socket) {
            socket.on('writing', (data) => { 
                    setUserTyping(data) 
                    setTimeout(() => setUserTyping([]), 500 )
                })  
        }
   }, [socket])


    useEffect(() => {
   
        if(token){
            SOCKET_EVENTS.map(event => dispatch(getSocket(event)))   
        }
    }, [token, editOldMessage, showUserInfoBox])

  
 
    return (
        
        <div className='rootContainer'>

            <Box className = {isTabletorMobile?'mobileRootBox':'rootBox'}>
           

            <Box className={isTabletorMobile?'usersBoxMobile':'usersBox'}
                  sx = {showUserInfoBox ? {
                        transform: "translateX(100%)",
                        display: "none"
                        }: { }}>      
                    <UserInfo/> 
                    { isTabletorMobile ? <SwitchButton/> : null}
                    <Button 
                        style={isTabletorMobile ? 
                            {
                                maxHeight:'20px', 
                                maxWidth: '15px',
                                fontSize: '10px',
                                marginLeft: '25px',
                                marginRight: '10px'} 
                            :{margin:'10px 5px'}}
                        variant="contained"
                        onClick={()=> {
                                localStorage.removeItem('token');
                                dispatch(removeToken());
                                socket.disconnect(); 
                                }}>
                        Logout
                    </Button>
                   
                    
                   
                </Box>
            
               
                <Box className ={isTabletorMobile ? 'rootMessageFormMobile':'rootMessageForm'} >
                {isCamActiv ? 
                <div>  
                    <Button
                        variant="contained" 
                        component="label"
                        onClick = {() => webcamEventHandler()}
                    >
                        close camera
                    </Button> 
                    <WebcamCapture />   
                 </div> 
                 :
                 ""}
                    <MessageForm/>

                    {isUserTyping.isTyping && (isUserTyping.userName !== user.userName)? <span> User {isUserTyping.userName} typing..</span> : ""}

                    <Box 

                        component="form" 
                        onSubmit = {e  => {
                                        e.preventDefault()
                                        if (message.message.length){
                                            dispatch(sendMessage({user, socket}))
                                            dispatch(getSocket('allmessages'))
                                            dispatch(editMessage({editMessage: ''}))
                                            setMessage({message: ''})
                                            play()
                                        }
                                      
                                    }}
                        sx={(isTabletorMobile)?{
                            display: 'flex',
                            margin: '10px 2px'}
                        :{
                            display: 'flex',
                            margin: '20px 5px'}
                           
                        }>
                        <Button
                            variant="contained" 
                            component="label"
                            sx = {{
                                minWidth: 'auto',
                                backgroundImage:'url(' + imgBtn + ')' ,
                                backgroundPosition: 'center', 
                                backgroundRepeat: "no-repeat", 
                                backgroundSize: '20px 40px'

                            }}
                        >
                        <input
                            onChange={e =>{
                                dispatch(fileMessage(e.target.files))
                            }}

                            type="file"
                            multiple
                            hidden
                        />

                       
                        </Button>    
                        <Button
                            variant="contained" 
                            component="label"
                            sx = {{
                                minWidth: 'auto',
                                backgroundImage:'url(' + imgBtnPhoto + ')' ,
                                backgroundPosition: 'center', 
                                backgroundRepeat: "no-repeat", 
                                backgroundSize: '20px 20px'

                            }}

                            onClick = {() => webcamEventHandler()}
                        >
                        </Button>          

                        <TextareaAutosize
                            id="outlined-basic" 
                            label="Type a message..." 
                            variant="outlined" 
                            value={message.message}
                            placeholder='type you message...'
                            minRows={2}
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
                                socket.emit('userWriting');
                                setMessage({message: e.target.value})}
                            } 
                            onFocus={ e => {
                                if (isTabletorMobile) {
                                   e.target.className = 'focus' 
                                   
                                } 
                            }}
                            onBlur={e=> {
                                e.target.className = 'blur'

                            }}
                        
                        /> 

                        <Button 
                            variant="contained" 
                            type='submit'
                            disabled={user?.isMutted || !message.message.length}
                            style={{width: '20%'}}
                        >
                            Send
                        </Button>

                    </Box>            
                </Box>
                
            </Box>
        </div>
    )
}