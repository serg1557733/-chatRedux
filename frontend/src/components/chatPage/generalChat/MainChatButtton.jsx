import { useSelector } from 'react-redux';
import { generalMessage } from '../../../reducers/userDataReducer';
import './userInfo.scss';
import { store } from '../../../store';

export const MainChatButtton = () => {

    const isPrivatChat = useSelector(state => state.userDataReducer.isPrivatChat)

    return (
        <div 
            className={!isPrivatChat? 'online active' :'online' }                       
            onClick={() => {store.dispatch(generalMessage())}}
        >  
            <div>Main Chat</div>
            <span style={{color: 'green'}}> for all </span>
        </div>
    )
}