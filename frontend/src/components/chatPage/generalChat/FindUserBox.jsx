import { useSelector } from 'react-redux';
import './userInfo.scss';
import { store } from '../../../store';

export const FindUserBox = () => {

    const allUsers = useSelector(state => state.getUserSocketReducer.allUsers)


    return (
        <div 
            className={'online'}                       
            onClick={() => {console.log(allUsers, "find user in array - allUsers")}}
        >  
            <div>Find users to write</div>
        </div>
    )
}