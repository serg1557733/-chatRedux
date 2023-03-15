import { useState } from "react";
export const AddToFriends = () => {

    const isTabletorMobile = (window.screen.width < 730);

    const [isFriend, setIsFreind] = useState(false)

    console.log(isFriend)

    return (
        <div onClick={() => setIsFreind(!isFriend)} >
            <div className= {isTabletorMobile ?'mobileButton addToFriendsButton': "addToFriendsButton" } 
               style ={{backgroundColor:(isFriend ? 'red': '#1976d3' )}}
            >
                
            </div>
        </div>
      
    )
}