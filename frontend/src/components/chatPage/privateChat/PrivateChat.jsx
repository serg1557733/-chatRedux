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
import notifSound from '../../../assets/get.mp3'


export const PrivateChat = () => {

    const dispatch = useDispatch();
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const SERVER_URL =process.env.REACT_APP_SERVER_URL

    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)

    const userNamesOnlineSet =  new Set(usersOnline.map( i => i.userName))

    const storeMessageId = useSelector(state => state.messageReducer.messageId)


    const [startMessages, setStartMessages] = useState([])   
    let endMessages = useRef(null);

socket.on('send privat messages', (messages)=> {
    setStartMessages(messages)
  });

  const newMessages = [];

  ///need to test not working
socket.on("private message", (message, from)=> {
    newMessages.push(message)
    console.log(newMessages)
  });  
  

    const [isEditing, setIsEditing] = useState(false)   
    const [isEditiedMessage, setIsEditiedMessage] = useState(false) //need to type in the bottom of message after message was edited

    const regYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; //for youtube video
    const messages = startMessages.concat(newMessages)  

    const [play] = useSound(notifSound);


    useEffect(() => {
        if (!isEditing) {
            scrollToBottom((endMessages)) 
        } 
      }, [newMessages]);
           
    // useEffect(()=> {
    //     if(newMessages.length > 0 && newMessages[newMessages.length-1].userName !== user.userName){
    //        // play()                 
    //     }
    // }, [newMessages])

    return (             
            <Box className='messageBox'>  
                {
                messages.map((item, i) =>
                    <div key={i + 1} className={ 
                        (item.fromUser === user._id)? 'message myMessage' :'message'}
                        onClick = {(e) => {
                            console.log(e.target)
                            if(e.target.closest("div").className.includes('myMessage') && (item.userName === user.userName) && (item.text === e.target.textContent)){
                                e.currentTarget.className += ' editMessage'  
                                dispatch(editMessage({socket, editMessage: e.target.textContent, messageId: item._id}))  
                                setIsEditing(true)
                                }
                        }}
                        > 
                        {storeMessageId === item._id ? <MessageEditorMenu />: ""} 
                        <span
                            style={{'alignItems': 'center',
                                    marginLeft: 5, 
                                    fontStyle: 'italic', 
                                    fontWeight: 800
                                }}

                        > {item.fromUser}</span>
                        <div 
                            key={i}
                        
                            className={ 
                                (item.fromUser === user._id)? 'message myMessage' :'message'}>
                           
                           { 
                           item.text.match(regYoutube) ?
                           <iframe 
                                width="280" 
                                height="160" 
                                style={{'maxWidth': "90%"}}
                                src={`https://www.youtube.com/embed/`+ (item.text.match(regYoutube)[1])}
                                title="YouTube video player" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen> 
                                
                            </iframe>
                            :
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
                        {isEditiedMessage && <i>Edited</i>}
                        <div className={ 
                                 (item.fromUser === user._id)? 'myDate' :'date'}>
                                {dateFormat(item).time}
                        </div>
                    </div>
                )}

                <div ref={endMessages}></div>

            </Box>
    )
} 