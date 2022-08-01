import { Avatar, Box, StyledBadge } from '@mui/material';
import { dateFormat } from '../utils/dateFormat';
import { useSelector } from 'react-redux';   
import { useRef, useEffect, useState} from 'react';
import { scrollToBottom } from '../utils/scrollToBottom';
import { useDispatch } from 'react-redux';
import { editMessage } from '../../../reducers/messageReducer';
import { StyledAvatar } from './StyledAvatar';
import { MessageEditorMenu } from '../MessageEditorMenu.jsx';

export const MessageForm = () => {

    const dispatch = useDispatch();

    const SERVER_URL = process.env.REACT_APP_SERVER_URL|| 'http://localhost:5000/';

    const startMessages = useSelector(state => state.getUserSocketReducer.startMessages)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)
    const userNamesOnlineSet =  new Set(usersOnline.map( i => i.userName))
    const storeMessageId = useSelector(state => state.messageReducer.messageId)


    const endMessages =useRef(null);

    const regYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; //for youtube video


    useEffect(() => {
        scrollToBottom(endMessages)
      }, [startMessages, usersOnline]);
                  
    return (             
            <Box className='messageBox'>  
                {
                startMessages.map((item, i) =>
                    <div key={item.id} className={ 
                        (item.userName === user.userName)? 'message myMessage' :'message'}
                        onClick = {(e) => {
                            if(e.target.className.includes('myMessage') && (item.userName === user.userName) && (item.text === e.target.textContent)){
                                e.currentTarget.className += ' editMessage'  
                                dispatch(editMessage({editMessage: e.target.textContent, messageId: item._id}))   
                                }
                        }}
                        > 

                        {storeMessageId === item._id ? <MessageEditorMenu/> : ""} 

                        <StyledAvatar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  
                             variant = {userNamesOnlineSet.has(item.userName)? 'dot' : ''}
                                   
                            >
                            <Avatar 

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
                            key={item._id + 1}
                        
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
                            <p>{item.text}</p>  
                           }

                        </div>

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