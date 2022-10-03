import { Avatar, Box, Button} from '@mui/material';
import { dateFormat } from '../utils/dateFormat';
import { useSelector } from 'react-redux';   
import { useRef, useEffect, useState} from 'react';
import { scrollToBottom } from '../utils/scrollToBottom';
import { useDispatch } from 'react-redux';
import { editMessage } from '../../../reducers/messageReducer';
import { StyledAvatar } from './StyledAvatar';
import { MessageEditorMenu } from '../MessageEditorMenu.jsx';
import imgBtn from '../../../assets/img/gg.png';


export const MessageForm = () => {

    const dispatch = useDispatch();
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const SERVER_URL = process.env.REACT_APP_SERVER_URL|| 'http://localhost:5000/';

    const startMessages = useSelector(state => state.getUserSocketReducer.startMessages)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)
    const userNamesOnlineSet =  new Set(usersOnline.map( i => i.userName))
    const storeMessageId = useSelector(state => state.messageReducer.messageId)

    let endMessages = useRef(null);
    const [isEditing, setIsEditing] = useState(false)   
    const [isEditiedMessage, setisEditiedMessage] = useState(false) 

    const regYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; //for youtube video

    useEffect(() => {
        if (!isEditing) {
            scrollToBottom((endMessages)) 
        }
      }, [startMessages]);
                  
    return (             
            <Box className='messageBox'>  
                {
                startMessages.map((item, i) =>
                    <div key={i + 1} className={ 
                        (item.userName === user.userName)? 'message myMessage' :'message'}
                        onClick = {(e) => {
                            if(e.target.className.includes('myMessage') && (item.userName === user.userName) && (item.text === e.target.textContent)){
                                e.currentTarget.className += ' editMessage'  
                                dispatch(editMessage({socket, editMessage: e.target.textContent, messageId: item._id}))  
                                setIsEditing(true)
                                }
                        }}
                        > 
                        {storeMessageId === item._id ? <MessageEditorMenu />: ""} 
                        

                        <StyledAvatar

                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  
                            variant = {userNamesOnlineSet.has(item.userName)? 'dot' : ''}
                                   
                            >
                            <Avatar 
                                key={i} 
                                src= {SERVER_URL + item?.user?.avatar}
                                sx={
                                    (item.userName == user.userName)
                                    ? 
                                    {
                                        alignSelf: 'flex-end',
                                    }
                                    :
                                    {}
                                }
                                
                                > 
                                {item?.userName.slice(0, 1)}
                            </Avatar>   

                        
                        </StyledAvatar>
                        <div 
                            key={i}
                        
                            className={ 
                                (item.userName === user.userName)? 'message myMessage' :'message'}>
                           
                           { 
                           item.text.match(regYoutube) ?
                           <iframe 
                                width="280" 
                                height="160" 
                                src={`https://www.youtube.com/embed/`+ (item.text.match(regYoutube)[1])}
                                title="YouTube video player" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen> 
                                
                            </iframe>
                            :
                           
                            (item.file && item.fileType && item.fileType.split('/')[0] !== 'image') ? 

                            <div style={{'display': 'flex', 'alignItems': 'center'}} >
                          
                                <a href={SERVER_URL + item.file} download> 
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

                                 <img width={150} height={150} src={ SERVER_URL + item.file} alt={'error load image'}/>
                            :
                            ''
                        }

                        </div>
                        {isEditiedMessage && <i>Edited</i>}
                        <div className={ 
                                (item.userName === user.userName)? 'myDate' :'date'}>
                                {dateFormat(item).time}
                        </div>
                    </div>
                )}

                <div ref={endMessages}></div>

            </Box>
    )
} 