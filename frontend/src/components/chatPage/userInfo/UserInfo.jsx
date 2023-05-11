import {Avatar} from '@mui/material';
import { StyledAvatar } from '../messageForm/StyledAvatar';
import { useSelector } from 'react-redux';
import './userInfo.scss';
import { useDispatch } from 'react-redux';
import { getUserAvatar } from '../../../reducers/userDataReducer';
import { useState } from 'react';
import { UserInfoButton } from '../generalChat/UserInfoButton';
import { AdminUserInfiButton } from '../generalChat/AdminUserInfiButton';
import { MainChatButtton } from '../generalChat/MainChatButtton';
import { FindUserBox } from '../generalChat/FindUserBox';
import './userInfo.scss';


export const UserInfo = () => {

 
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
    const showUserInfoBox = useSelector(state => state.userDataReducer.showUserInfoBox)
    const newPrivateMessages = useSelector(state => state.getUserSocketReducer.newPrivateMessages)
    const newMessage = useSelector(state => state.getUserSocketReducer.newMessages)

    const friends = useSelector(state => state.getUserSocketReducer.friends)
    const friendsIds = friends.map(friend => friend._id)
    let userAvatarUrl = storeUserAvatar || user.avatar;

    const inputHandler = (e) => {
        const file = e.target.files[0]
        dispatch(getUserAvatar(file))
        setDisplayType('none')
    }

console.log(user)

    // if(socket){
    //     socket.on('my chats', (data)=> console.log('my chats', data))
    // }
        

    return (
            <>  
                <h4 style={{color:'white'}}> Hello, {user.userName} </h4>
               
                <Avatar
                    className={isTabletorMobile ? 'mobileAvatar' : 'pcUsersAvatar'} //add deleting function after update avatar
                    onClick={() => loadAvatarHandler()}
                    src={userAvatarUrl ? SERVER_URL +'/'+ userAvatarUrl : ""}
                    >
                </Avatar>  
                
               <div
                    className={isTabletorMobile ? 'mobileUsersInfoBox' : 'pcUsersInfoBox'} 
                    style={showUserInfoBox && isTabletorMobile ? {'transform':'translate(-100%)'}:{ 'transform':'translate(0)'}}   
                >
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    name='file'
                    style = {{
                            display: displayType
                        }}
                    onChange = {e => inputHandler(e)}/>


                 
                {friends.map((item, i) =>(user.userName !== item.userName) && <UserInfoButton item = {item} i = {i}  key={i} 
                /> )}
                    
                   
                <MainChatButtton/>     

                <FindUserBox/>     
                
                    { user.isAdmin && !isTabletorMobile ? 
                            allUsers.map((item, i) =>
                            (user.userName !== item?.userName) 
                                && <AdminUserInfiButton item={item} i={i} key={i}/>) 
                        :

                            usersOnline.map((item, i) =>
                                    (user.userName !== item.userName && !friendsIds.includes(item._id) ) && <UserInfoButton item = {item} i = {i}  key={i} />                   
                            )
                    }

                    {
                    newPrivateMessages.length > 0 
                        && newPrivateMessages.map((item, i) => 
                       // <UserInfoButton item = {item} i = {i}  key={i} />
                       console.log(item)
                        )

                    }

                </div>
            </>
        )
}