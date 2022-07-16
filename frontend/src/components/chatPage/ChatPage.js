import { useEffect, useMemo, useRef, Fragment} from 'react';
import { MessageForm } from './messageForm/MessageForm';
import {Button,Avatar, Box} from '@mui/material';
import { UserInfo } from './userInfo/UserInfo';
import { dateFormat } from './utils/dateFormat';
import './chatPage.scss';
import { scrollToBottom } from './utils/scrollToBottom';
import { banUser } from './service/banUser';
import { muteUser } from './service/muteUser';
import {sendMessage} from './service/sendMessage';
import { store } from '../../store';
import { removeToken} from '../../reducers/userDataReducer'
import { useDispatch, useSelector } from 'react-redux';
import {getSocket} from'../../reducers/socketReducer';

export const ChatPage = () => {

    const dispatch = useDispatch();
    const token = useSelector(state => localStorage.getItem('token') || state.userDataReducer.token);

    const startMessages = useSelector(state => state.getUserSocketReducer.startMessages)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)
    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const socket = useSelector(state => state.getUserSocketReducer.socket)


    const randomColor = require('randomcolor'); 
    const endMessages = useRef(null);
    
    useEffect(() => {
        if(token){
            dispatch(getSocket())
        }
    }, [])


    useEffect(() => {
        scrollToBottom(endMessages)
      }, [startMessages]);

    const userColor = useMemo(() => randomColor(),[]);//color for myavatar

    return (
        <div className='rootContainer'>
            <Box 
                sx={{
                    display: 'flex',
                    height: '100vh'
                }}>
                <Box
                sx={{
                    display: 'flex',
                    flexGrow:'2',
                    maxWidth: '75%',
                    flexDirection: 'column',                    
                }}>
                    <Box className='messageBox'>                     
                        {
                        startMessages.map((item, i) =>
                        <Fragment key={i} >
                            <Avatar 
                                sx={
                                    (item.userName == user.userName)
                                    ? 
                                    {
                                        alignSelf: 'flex-end',
                                        fontSize: 10,
                                        width: '60px',
                                        height: '60px',
                                        color:'black',
                                        backgroundColor: userColor
                                    }
                                    :
                                    {
                                        backgroundColor:  (usersOnline.map(current => {
                                            if(item.userName == current.userName ) {
                                                return current.color
                                            }
                                          
                                        } )),
                                        fontSize: 10,
                                        width: '60px',
                                        height: '60px',
                                        color:'black'
                                    }
                                    }> 
                                    {item.userName}
                            </Avatar>   
                            <div 
                                key={item._id}
                                onClick = {(e) => {
                                    if(e.target.className.includes('myMessage')){
                                        e.currentTarget.className += ' editMessage' 
                                    }
                                    //add function to edit message
                                }}

                                className={ 
                                (item.userName === user.userName)
                                ? 
                                'message myMessage' 
                                :
                                'message'}
                                >
                                    <p>{item.text}</p>  
                                    <div
                                     style={{fontStyle:'italic',
                                            color: 'grey',
                                            fontSize: 14}}>
                                            {dateFormat(item).time}
                                    </div> 
                                    <div 
                                    style={{fontStyle:'italic',
                                            fontSize: 12,
                                            color: 'grey'}}>
                                            {dateFormat(item).year}
                                    </div>
                            </div>
                     
                        </Fragment>
                        )}
                        <div ref={endMessages}></div>
    
                        </Box>
                            <MessageForm />
                        </Box>

                        <Box
                        className='usersBox'
                        sx={{
                            overflow: 'scroll',  
                        }}>
                        <Button 
                                sx={{margin:'10px 5px'}}
                                variant="outlined"
                                onClick={()=> {
                                        localStorage.removeItem('token');
                                        socket.disconnect(); 
                                        dispatch(removeToken());
                                            }}>
                                Logout
                        </Button>

                        <UserInfo 
                            data = {user.userName} 
                            color={userColor}/>
                            {
                                user.isAdmin 
                                ? 
                                allUsers.map((item) =>
                                <div 
                                    key={item._id}
                                    className='online'>
                                    <div style={
                                        {color: (usersOnline.map(current =>{
                                                if(item.userName == current.userName ) {
                                                    return current.color
                                                }
                                            
                                            }))}}>{item.userName}</div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={()=>{
                                                   //muteUser(item.userName, item?.isMutted, socket)
                                                    }}
                                                sx={{
                                                    margin:'3px',
                                                    height: '25px'
                                                }}>
                                                    {/* {item.isMutted
                                                    ? 
                                                    'unmute'
                                                    : 'mute'} */}
                                            </Button>

                                            <Button
                                                variant="contained"
                                                onClick={()=>{
                                                //banUser(item.userName, item.isBanned, socket)
                                                }}
                                                sx={{
                                                    margin:'3px',
                                                    height: '25px'
                                                }}>
                                                    {item?.isBanned
                                                ? 'unban'
                                                : 'ban'}
                                            </Button>

                                        </div>
                                {
                                usersOnline.map((user, i) =>{
                                                    if(item.userName == user.userName){
                                                    return <span key={i} style={{color: 'green'}}>online</span>
                                                    }
                                                })
                                }
                                </div>) 
                                :
                                usersOnline.map((item, i) =>
                                        <div 
                                            key={i}
                                            className='online'>  
                                            <div style={{color: item.color}}>
                                                {item.userName}
                                            </div>
                                            <span style={{color: 'green'}}>
                                                online
                                            </span>
                                        </div>)
                            }
                </Box>
            </Box>
        </div>
    )
}