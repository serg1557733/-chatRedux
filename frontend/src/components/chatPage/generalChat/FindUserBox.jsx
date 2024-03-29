import { useSelector } from 'react-redux';
import { useState } from 'react';
import './userInfo.scss';
import {UserInfoButton} from './UserInfoButton';


export const FindUserBox = () => {

    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const [findUser, setfindUser] = useState('');
    const [showUsers, setShowUsers] = useState(false)

    const res = allUsers.filter(user =>  user.userName.toLowerCase().includes(findUser.toLowerCase()))
    
    return (
        <>
            <div className='online'>  
                <div>Find users for chat</div>
                <input style={{width:'80%'}}
                        value = {findUser} 
                        onChange={(e) => {
                            setfindUser(e.target.value)
                            setShowUsers(true)
                            }} >
                    
                </input>
            </div>
            {showUsers && findUser.length > 0  && res.map((item, i) => <UserInfoButton item = {item} i = {i}  key={i}/> )}
        </>
    )
}