import { useState } from "react";
import { useSelector } from 'react-redux';


export const AddToFriends = (user) => {

    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const isTabletorMobile = (window.screen.width < 730);

    const usersFriends = useSelector(state => state.getUserSocketReducer.socketUserData).friends

    let isMyFriend = false;
    if(usersFriends) {
        isMyFriend = usersFriends.find(friend => friend._id === user.user._id)
    }

    const [isFriend, setIsFreind] = useState(false)
   
    return (
        <div onClick={() => {
                            setIsFreind(!isFriend)
                            isFriend ? socket.emit('removeFromFriends', user) : socket.emit('addToFriends', user)       
            }} >
            <div className= {isTabletorMobile ?'mobileButton addToFriendsButton': "addToFriendsButton" } 
               style ={{backgroundColor:(isFriend || isMyFriend? 'red': '#1976d3' )}}
            >
                
            </div>
        </div>
      
    )
}