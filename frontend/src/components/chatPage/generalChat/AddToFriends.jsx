import { useState } from "react";
import { useSelector } from 'react-redux';


export const AddToFriends = (user) => {

    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const isTabletorMobile = (window.screen.width < 730);

    const [isFriend, setIsFreind] = useState(false)

    socket.on('friends', data =>  console.log(data))
   
    return (
        <div onClick={() => {
                            setIsFreind(!isFriend)
                            isFriend ? socket.emit('removeFromFriends', user) : socket.emit('addToFriends', user)       
            }} >
            <div className= {isTabletorMobile ?'mobileButton addToFriendsButton': "addToFriendsButton" } 
               style ={{backgroundColor:(isFriend ? 'red': '#1976d3' )}}
            >
                
            </div>
        </div>
      
    )
}