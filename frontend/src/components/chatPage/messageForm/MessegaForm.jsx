import { Avatar, Box, StyledBadge } from '@mui/material';
import { dateFormat } from '../utils/dateFormat';
import { useSelector } from 'react-redux';   
import { Fragment, useRef, useEffect, useMemo} from 'react';
import { scrollToBottom } from '../utils/scrollToBottom';
import { useDispatch } from 'react-redux';
import { editMessage } from '../../../reducers/messageReducer';
import { TimeAgoMessage } from '../TimeAgoMessage';
import { StyledAvatar } from './StyledAvatar';




export const MessageForm = () => {

    const dispatch = useDispatch();
    const SERVER_URL = process.env.REACT_APP_SERVER_URL|| 'http://localhost:5000/';

    const startMessages = useSelector(state => state.getUserSocketReducer.startMessages)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)
    const userNamesOnlineSet =  new Set(usersOnline.map( i => i.userName))

    const endMessages = useRef(null);


    useEffect(() => {
        scrollToBottom(endMessages)
      }, [startMessages, usersOnline]);
                  
    return (             
            <Box className='messageBox'>                     
                {
                startMessages.map((item, i) =>
                    <div key={i} className={ 
                        (item.userName === user.userName)? 'message myMessage' :'message'}>   
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
                                }> 
                                {item?.userName.slice(0, 1)}
                            </Avatar>   
                        </StyledAvatar>
                        <div 
                            key={item._id}
                            onClick = {(e) => {
                                if(e.target.className.includes('myMessage')){
                                    e.currentTarget.className += ' editMessage' 
                                    startMessages.map( item => {
                                        if((item.userName === user.userName) && (item.text === e.target.textContent)){
                                            console.log('edit message',e.target.textContent )
                                            dispatch(editMessage({editMessage: e.target.textContent}))                                        
                                        }
                                        })}
                            }}
                            className={ 
                                (item.userName === user.userName)? 'message myMessage' :'message'}>

                            <p>{item.text}</p>  

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