import { Avatar, Box, Button} from '@mui/material';
import { dateFormat } from '../utils/dateFormat';
import { useSelector } from 'react-redux';   
import { useRef, useEffect, useState} from 'react';
import { scrollToBottom } from '../utils/scrollToBottom';
import { useDispatch } from 'react-redux';
import { editMessage } from '../../../reducers/messageReducer';
import { MessageEditorMenu } from '../MessageEditorMenu.jsx';
import imgBtn from '../../../assets/img/gg.png';
import useSound from 'use-sound';
import { PrivatChatHeader } from './PrivatChatHeader';
import { privateMessage } from '../../../reducers/userDataReducer';
import notifSound from '../../../assets/get.mp3'
import {isNewPrivateMessages} from "../../../reducers/dataReducers";
import { UserInfoButton } from '../generalChat/UserInfoButton';
import { YoutubeMessage } from '../YoutubeMessage';

//need to fix update wenn message sendet and icon for new private messages

export const PrivateChat = () => {

    const dispatch = useDispatch();
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const SERVER_URL =process.env.NODE_ENV == "development"? process.env.REACT_APP_SERVER_URL : process.env.REACT_APP_PUBLIC_URL;

    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const storeMessageId = useSelector(state => state.messageReducer.messageId)
    const selectedUser = useSelector(state => state.dataReducer.selectedUser)
    const newPrivateMessages = useSelector(state => state.getUserSocketReducer.newPrivateMessages)

    const [startMessages, setStartMessages] = useState([])   
    let endMessages = useRef(null);
    socket.on('send privat messages', (messages)=> {
        setStartMessages(messages)
    });
  
// bug need to fix****************



    const [isEditing, setIsEditing] = useState(false)   
    const [isEditiedMessage, setIsEditiedMessage] = useState(false) //need to type in the bottom of message after message was edited

    const [play] = useSound(notifSound);
    const regYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; //for youtube video

    
      useEffect(() => {
        if(startMessages.length > 0){
           setStartMessages([...startMessages, newPrivateMessages]) 
        }
        }, [newPrivateMessages]);


        useEffect(() => {
            if (!isEditing) {
                scrollToBottom((endMessages)) 
            }
    
          }, [startMessages]);
           
    return (  

        <>
       
            <PrivatChatHeader/>
                <Box className='messageBox'>  
                
                    {
                    startMessages.map((item, i) =>
                        <div key={i + 1} className={ 
                            (item.fromUser === user._id)? 'message myMessage' :'message'}
                            onClick = {(e) => {
                                if(e.target.closest("div").className.includes('myMessage') && (item.userName === user.userName) && (item.text === e.target.textContent)){
                                    e.currentTarget.className += ' editMessage'  
                                    dispatch(editMessage({socket, editMessage: e.target.textContent, messageId: item._id}))  
                                    setIsEditing(true)
                                    }
                            }}
                            > 
                            {storeMessageId === item._id ? <MessageEditorMenu />: ""} 
                 
                            <div 
                                key={i}
                            
                                className={ 
                                    (item.fromUser === user._id)? 'message myMessage' :'message'}>
                            
                            { 
                            item.text.match(regYoutube) ? <YoutubeMessage item = {item} />: 
                                (item.file && item.fileType && item.fileType.split('/')[0] !== 'image') ? 

                                <div style={{'display': 'flex', 'alignItems': 'center'}} >

                                    <a href={SERVER_URL + '/' +item.file} download> 
                                        <Button
                                            variant="contained" 
                                            component="label"
                                            sx = {{
                                                minWidth: 'auto',
                                                minHeight: '25px',
                                                backgroundImage:'url(' + imgBtn + ')' ,
                                                backgroundPosition: 'center', 
                                                backgroundRepeat: "no-repeat", 
                                                backgroundSize: '15px 20px',
                                                backgroundColor: '#d3d3d3'

                                            }}  
                                        >
                                        </Button>  
                                    </a>
                                    <p style={{'marginLeft': '15px'}}  >{item.text}</p>  
                                </div>
                            : 
                                <p>{item.text}</p>
                            
                            }

                            { 
                                (item.file && item.fileType && item.fileType.split('/')[0] == 'image' ) //need to fix for other type files
                                ? 
                                    <img width={'auto'} style={{'maxWidth': "90%"}} src={ SERVER_URL + '/' + item.file} alt={'error load image'}/>
                                :
                                ''
                            }

                            </div>

                            <div className={ 
                                (item.userName === user.userName)? 'myDate' :'date'}>
                                {dateFormat(item)}
                            </div>
                            {isEditiedMessage && <i>Edited</i>}
                            {/* <div className={ 
                                    (item.fromUser === user._id)? 'myDate' :'date'}>
                                    {dateFormat(item).time}
                            </div> */}
                        </div>
                    )}

                    <div ref={endMessages}></div>

            </Box>
        </>      
    )

    
} 