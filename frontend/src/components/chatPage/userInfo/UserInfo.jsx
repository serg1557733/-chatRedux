import {Button,Avatar} from '@mui/material';
import { useSelector } from 'react-redux';
import { banUser } from '../service/banUser';
import { muteUser } from '../service/muteUser';
import './userInfo.scss';
import { useDispatch } from 'react-redux';
import { getUserAvatar } from '../../../reducers/userDataReducer';
import { useState, useEffect } from 'react';
import { store } from '../../../store';
import { getSocket } from '../../../reducers/socketReducer';


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
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline);
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const isTabletorMobile = (window.screen.width < 730);
    const storeUserAvatar = useSelector(state => state.userDataReducer.avatar)

    let userAvatarUrl = SERVER_URL + (storeUserAvatar || user.avatar);

    const userNamesOnlineSet =  new Set(usersOnline.map( i => i.userName))
    
    
    const inputHandler = (e) => {
        const file = e.target.files[0]
        dispatch(getUserAvatar(file))
        setDisplayType('none')
    }

    return (
            <>  
                <h4> Hello, {user.userName} </h4>
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
                        allUsers.map((item, key) =>
                            <div 
                                key={item._id}
                                className='online'>
                                <div>
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
                                    {
                                    userNamesOnlineSet.has(item.userName)? 
                                    <span key={key} style={{color: 'green'}}>online</span>
                                    : ''
                                    }
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