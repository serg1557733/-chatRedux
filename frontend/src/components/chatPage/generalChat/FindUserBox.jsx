import { useSelector } from 'react-redux';
import { useState } from 'react';
import './userInfo.scss';
import { store } from '../../../store';
import {UserInfoButton} from './UserInfoButton';
export const FindUserBox = () => {

    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)
    const [findUser, setfindUser] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([])
    const [showUsers, setShowUsers] = useState(false)
    const res = allUsers.filter(user =>  user.userName.toLowerCase().includes(findUser.toLowerCase()))
    
 
    return (
        <div 
            className={'online'}                       
            onClick={() => {console.log(allUsers, "find user in array - allUsers")}}
        >  
            <div>Find users to write</div>
            <input style={{width:'80%'}}
                    value = {findUser} 
                    onChange={(e) => {
                        setfindUser(e.target.value)
                        setShowUsers(true)
                        }} >
                
            </input>

{ showUsers && findUser  && res.map(( item, i) => <UserInfoButton item = {item} i = {i}  key={i}/>  )}

        </div>
    )
}