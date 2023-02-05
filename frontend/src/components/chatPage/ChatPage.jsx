import { useEffect, useState} from 'react';
import {Button, Box} from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { MessageForm } from './messageForm/MessegaForm';
import { UserInfo } from './userInfo/UserInfo';
import { store } from '../../store';
import { removeToken, isPrivatChat, privateMessage} from '../../reducers/userDataReducer'
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
import { PrivateChat } from './privateChat/PrivateChat';
import { PrivatChatHeader } from './privateChat/PrivatChatHeader';

export const ChatPage = () => {

    const SOCKET_EVENTS = ['allmessages', 'usersOnline', 'allDbUsers']

    const dispatch = useDispatch();

    const token = useSelector(state => localStorage.getItem('token') || state.userDataReducer.token);
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const editOldMessage = useSelector(state => state.messageReducer.editMessage)
    let showUserInfoBox = useSelector(state => state.messageReducer.showUserInfoBox)// || localStorage.getItem('showBox');
    const toUser = useSelector(state => state.userDataReducer.toUser)
    const chatId = useSelector(state => state.userDataReducer.toUser.socketId)
    const isPrivatChat = useSelector(state => state.userDataReducer.isPrivatChat)

    const [message, setMessage] = useState({message: ''});
    const [isUserTyping, setUserTyping] = useState([]);
    const [isCamActiv, setisCamActiv] = useState(false);
    const [showSpinner, setshowSpinner] = useState(false);
    const [loadingPercentage, setLoadPercentage] = useState(0)
    
    const isTabletorMobile = (window.screen.width < 730);

    const [play] = useSound(getNotif, {volume: 0.005});


    const axiosConfig =   {
        headers: {
            "Content-type": "multipart/form-data"
          },
        onUploadProgress: (progress) => {
        const {loaded, total} = progress;
        const loadStatus = Math.floor(loaded * 100 / total); 
        setLoadPercentage(loadStatus)   
        if(loadStatus == 100) {
            setshowSpinner(false)
        }
    }}

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



    const sendPrivateMessage = () => {
        socket.emit("private message", {
            fromUser: user,
            message: message.message,
            to: chatId,
            toUser
          })
    }


    



    useEffect(() => {
        if(socket) {
            socket.on('writing', (data) => { 
                    setUserTyping(data) 
                    setTimeout(() => setUserTyping([]), 500 )
                })  
            socket.on("private message", ({ content, from }) => {
                    console.log(content, from)
                
                  });
        }
   }, [])


    useEffect(() => {
   
        if(token){
          //  const events = ['allmessages', 'usersOnline', 'allDbUsers'] // if start page dont get users or add dispatch for this events
            dispatch(getSocket('allmessages')) //use const SOCKETS EVENT
            dispatch(getSocket('allDbUsers'))
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
                    {isPrivatChat? <PrivateChat/>   : <MessageForm/>}
                   


                    {isUserTyping.isTyping && (isUserTyping.userName !== user.userName)? <span> User {isUserTyping.userName} typing..</span> : ""}

                    <Box 

                        component="form" 
                        onSubmit = {e  => {
                                        e.preventDefault()
                                        if (message.message.length){
                                            isPrivatChat? sendPrivateMessage() : dispatch(sendMessage({user, socket}));
                                            isPrivatChat && dispatch(getSocket('allmessages'))
                                            isPrivatChat &&dispatch(editMessage({editMessage: ''}))
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
                            disabled={showSpinner}
                            variant="contained" 
                            component="label"
                            sx = {showSpinner? 
                                {
                                minWidth: 'auto'}
                                :
                                {
                                minWidth: 'auto',
                                backgroundImage:'url(' + imgBtn + ')' ,
                                backgroundPosition: 'center', 
                                backgroundRepeat: "no-repeat", 
                                backgroundSize: '20px 20px'

                            }}
                            style = {{color: 'green'}}
                        >
                        <input
                            onChange={e =>{
                                setshowSpinner(true)
                                dispatch(fileMessage({files: e.target.files, axiosConfig}))
                            }}

                            type="file"
                            multiple
                            hidden
                        />

                       {showSpinner? loadingPercentage : ""}
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
                                    isPrivatChat? sendPrivateMessage() : dispatch(sendMessage({user, socket}));
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
                            // onFocus={ e => {
                            //     if (isTabletorMobile) {
                            //        e.target.className = 'focus' 
                                   
                            //     } 
                            // }}
                            // onBlur={e=> {
                            //     e.target.className = 'blur'

                            // }}
                        
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