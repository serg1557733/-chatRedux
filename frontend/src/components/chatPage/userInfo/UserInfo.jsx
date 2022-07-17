import {Button,Avatar} from '@mui/material';
import { useSelector } from 'react-redux';
import { banUser } from '../service/banUser';
import { muteUser } from '../service/muteUser';


export const UserInfo = () => {

    //add foto loading function
    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = [...new Set(useSelector(state => state.getUserSocketReducer.usersOnline))];//Set?
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const isTabletorMobile = (window.screen.width < 730);

    return (
            <> 
                {
                isTabletorMobile ? 
                    '' 
                    : <Avatar sx={{ 
                            bgcolor: 'grey',
                            width: '100px',
                            height: '100px',
                            fontSize: 14,
                            margin: '20px auto'
                            }}>
                            {user.userName}
                    </Avatar>
                }

                   
                    {user.isAdmin ? 
                        allUsers.map((item) =>
                            <div 
                                key={item._id}
                                className='online'>
                                <div style={{color: (usersOnline.map(current => {
                                                if(item.userName === current.userName) {
                                                    return current.color
                                                }}))
                                            }}>

                                            {item.userName}
                                </div>

                                <div>
                                    {(user.userName === item.userName )?   
                                        "admin"
                                    :   
                                    <>      
                                        <Button
                                            variant="contained"
                                            onClick={()=>{
                                                muteUser(item.userName, item?.isMutted, socket)
                                            }}
                                            sx={{
                                                margin:'3px',
                                                height: '25px'
                                            }}>
                                                {item.isMutted
                                                ? 
                                                'unmute'
                                                : 'mute'}
                                        </Button>

                                        <Button
                                            variant="contained"
                                            onClick={()=>{ 
                                                banUser(item.userName, item.isBanned, socket)
                                            }}
                                            sx={{
                                                margin:'3px',
                                                height: '25px'
                                            }}>
                                                {item?.isBanned ? 'unban' : 'ban'}
                                        </Button> 
                                    </>}
                            
                                </div>
                                    {usersOnline.map((user, i) => {
                                        if(item.userName === user.userName){
                                            return <span key={i} style={{color: 'green'}}>online</span>
                                        }})}
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
            </>
        )
}