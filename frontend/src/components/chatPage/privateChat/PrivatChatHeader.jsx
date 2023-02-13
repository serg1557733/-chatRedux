import { useSelector } from "react-redux"
import './userInfo.scss';
import { StyledAvatar } from "../messageForm/StyledAvatar";
import { Avatar } from "@mui/material";

export const PrivatChatHeader = () => {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL

//add dispatch and saving name for user to store
    const selectedUser = useSelector(state => state.dataReducer.selectedUser)

    return (
        <div className="active" >
            <StyledAvatar    
                sx={{ marginRight:2}} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  
            >
                <Avatar 
                    src= {SERVER_URL + '/'+ selectedUser?.avatar}
                    sx={{ alignSelf: 'flex-end'}} 
                > 
                    {selectedUser.userName.slice(0, 1)}
                </Avatar>   
            </StyledAvatar>
              Private Chat with {selectedUser.userName}  
           
        </div>
    )
}
