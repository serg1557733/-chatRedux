import {Button,Avatar} from '@mui/material';
import { useSelector } from 'react-redux';
import { banUser } from '../service/banUser';
import Input from '@mui/material/Input';
import { muteUser } from '../service/muteUser';
import './userInfo.scss';
import { useDispatch } from 'react-redux';
import { getUserAvatar } from '../../../reducers/userDataReducer';
import { useEffect, useState } from 'react';
import { store } from '../../../store';


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
    const SERVER_URL = process.env.REACT_APP_SERVER_URL|| 'http://localhost:5000/';

    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = [...new Set(useSelector(state => state.getUserSocketReducer.usersOnline))];//Set?
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const isTabletorMobile = (window.screen.width < 730);
    let userAvatarUrl = SERVER_URL + user.avatar;
    const inputHandler = (e) => {
        const file = e.target.files[0]
        dispatch(getUserAvatar(file))
        setDisplayType('none')
       
    }

    return (
            <>  
                <Avatar
                    sx={isTabletorMobile ? MOBILE_AVATAR_STYLE : PC_AVATAR_STYLE} //add deleting function after update avatar
                    onClick={() => loadAvatarHandler()}
                    src={userAvatarUrl} >
                </Avatar>  
                <input
                        type="file"
                        accept="image/png, image/jpeg"
                        name='file'
                        style = {{
                            display: displayType
                        }}
                        onChange = {e => inputHandler(e)}
                       />
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