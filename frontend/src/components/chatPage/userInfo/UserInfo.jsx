import {Button,Avatar} from '@mui/material';
import { useSelector } from 'react-redux';
import { banUser } from '../service/banUser';
import Input from '@mui/material/Input';
import { muteUser } from '../service/muteUser';
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
  
    //add foto loading function
      
    let displayType = 'none';
    const loadAvatarHandler = () => {
        
        console.log('load avatar')
    }


    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = [...new Set(useSelector(state => state.getUserSocketReducer.usersOnline))];//Set?
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const isTabletorMobile = (window.screen.width < 730);
  

    return (
            <>  
                <Input 
                    type="file"
                    accept="image/png, image/jpeg"
                    style = {{display: displayType}}
                    />
                <Avatar
                    sx={ isTabletorMobile ? MOBILE_AVATAR_STYLE : PC_AVATAR_STYLE} 
                    onClick={() => loadAvatarHandler()} /> 
                   
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
                                            sx={(isTabletorMobile) 
                                                ? 
                                                {height: '15px',
                                                 maxWidth:'20px'}: 
                                                {
                                                margin:'3px',
                                                height: '25px'}}>

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
                                            sx={(isTabletorMobile) 
                                                ? 
                                                {height: '15px',
                                                margin:'2px'} : 
                                                {
                                                margin:'3px',
                                                height: '25px'}}
                                       >
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