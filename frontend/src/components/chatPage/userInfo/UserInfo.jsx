import {Avatar} from '@mui/material';
import { StyledAvatar } from '../messageForm/StyledAvatar';
import { useSelector } from 'react-redux';
import './userInfo.scss';
import { useDispatch } from 'react-redux';
import { getUserAvatar } from '../../../reducers/userDataReducer';
import { useState, useCallback } from 'react';
import { UserInfoButton } from '../generalChat/UserInfoButton';
import { AdminUserInfiButton } from '../generalChat/AdminUserInfiButton';
import { MainChatButtton } from '../generalChat/MainChatButtton';
import { FindUserBox } from '../generalChat/FindUserBox';
import './userInfo.scss';


export const UserInfo = () => {

    const PC_AVATAR_STYLE =    {
        bgcolor: 'grey',
        width: '100px',
        height: '100px',
        fontSize: 14,
        margin: '20px auto',
        cursor: 'pointer'
        };


    const MOBILE_AVATAR_STYLE =  { margin: '5px auto'};
 
    const [displayType, setDisplayType] = useState('none');

    const dispatch = useDispatch();

    const loadAvatarHandler = () => {
        setDisplayType('block')
        setTimeout(() => {
            setDisplayType('none')
        }, 4000)
    }
    const SERVER_URL = process.env.REACT_APP_SERVER_URL

    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline);
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const isTabletorMobile = (window.screen.width < 730);
    const storeUserAvatar = useSelector(state => state.userDataReducer.avatar)
    const chatId = useSelector(state => state.userDataReducer.chatId)

    const newPrivateMessages = useSelector(state => state.getUserSocketReducer.newPrivateMessages)


    let userAvatarUrl = storeUserAvatar || user.avatar;

    const inputHandler = (e) => {
        const file = e.target.files[0]
        dispatch(getUserAvatar(file))
        setDisplayType('none')
    }

    // if(socket){
    //     socket.on('my chats', (data)=> console.log('my chats', data))
    // }

console.log(user)
        
    return (
            <>  
                <h4 style={{color:'white'}}> Hello, {user.userName} </h4>
               
                <Avatar
                    sx={isTabletorMobile ? MOBILE_AVATAR_STYLE : PC_AVATAR_STYLE} //add deleting function after update avatar
                    onClick={() => loadAvatarHandler()}
                    src={userAvatarUrl ? SERVER_URL +'/'+ userAvatarUrl : ""}
                    >
                </Avatar>  
                
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    name='file'
                    style = {{
                            display: displayType
                        }}
                    onChange = {e => inputHandler(e)}/>

                   
                <MainChatButtton/>     

                <FindUserBox/>     
                
                    { user.isAdmin && !isTabletorMobile ? 
                            allUsers.map((item, i) =>
                            (user.userName !== item?.userName) 
                                && <AdminUserInfiButton item={item} i={i} key={i}/>) 
                        :
                            !isTabletorMobile 
                            && usersOnline.map((item, i) =>
                                    (user.userName !== item.userName) && <UserInfoButton item = {item} i = {i}  key={i} />                
                            )
                    }
               
            </>
        )
}