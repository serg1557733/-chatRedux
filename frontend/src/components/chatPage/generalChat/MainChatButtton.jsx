import { useSelector } from 'react-redux';
import { generalMessage } from '../../../reducers/userDataReducer';
import './userInfo.scss';
import { store } from '../../../store';
import { getSocket } from '../../../reducers/socketReducer';

export const MainChatButtton = () => {

    const isPrivatChat = useSelector(state => state.userDataReducer.isPrivatChat)

    return (
        <div 
            className={!isPrivatChat? 'online active' :'online' }                       
            onClick={() => {
                store.dispatch(getSocket('allmessages'))
                store.dispatch(generalMessage())
            }}
        >  
            <div>Main Chat</div>
            <span style={{color: 'green'}}> for all </span>
        </div>
    )
}