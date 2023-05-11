import { store } from "../../../store";
import { privateMessage } from "../../../reducers/userDataReducer";
import { useSelector } from "react-redux";
import { StyledAvatar } from "../messageForm/StyledAvatar";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import {selectedUser} from "../../../reducers/dataReducers";
import { AddToFriends } from "./AddToFriends";

export const UserInfoButton = ({item, i}) => {


    const SERVER_URL = process.env.REACT_APP_SERVER_URL

    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const isPrivatChat = useSelector(state => state.userDataReducer.isPrivatChat)
    const chatId = useSelector(state => state.userDataReducer.toUser.socketId)
    const storeUserAvatar = useSelector(state => state.userDataReducer.avatar)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)
    const userNamesOnlineSet =  new Set(usersOnline.map( i => i.userName))
    
    let userAvatarUrl = storeUserAvatar || user.avatar;

    const newPrivateMessages = useSelector(state => state.getUserSocketReducer.newPrivateMessages)

    const [isPrivate, setIsPrivate] = useState(false)

  //  console.log('usersinfobutton Item',item)


    const privateChatHandler = (item) => {
        socket.emit('privat chat', {
            user,
            to: item.socketId,
            toUser: item
          })
    }

    useEffect(() => {
        if(newPrivateMessages.text && newPrivateMessages?.sender[0].userName === item.userName){
         setIsPrivate(!!newPrivateMessages.text)
         }
    },[newPrivateMessages])
   
    return (
        <div 
        className={(item.socketId&&isPrivatChat&&(chatId === item.socketId))? 'online active' :'online' }                       
        onClick={(e) => {
            store.dispatch(selectedUser(item))
            store.dispatch(privateMessage({toUser: item}))
            setIsPrivate(false) 
            socket.emit('privat chat', {
                user,
                to: item.socketId,
                toUser: item
              })
            }
        }
        >  
         {isPrivate && item.userName && <span style={{color:'red'}} > new </span>} 
            <div style={{color: item.color}}>
            <StyledAvatar  key={i}  sx={{ marginRight:2}} 
                           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  
                           variant = {userNamesOnlineSet.has(item.userName)? 'dot' : ''}

>
    
                <Avatar 
                    src= {SERVER_URL + '/'+ item?.avatar}
                    sx={{ alignSelf: 'flex-end'}}
                    
                    > 
                    {item?.userName.slice(0, 1)}
                </Avatar>   

           

            </StyledAvatar>
                {item.userName}  
            </div>
            <AddToFriends user = {item}/>
    </div>
    )
}