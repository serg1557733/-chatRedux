import {Button} from '@mui/material';
import { store } from "../../../store";
import { privateMessage } from "../../../reducers/userDataReducer";
import { useSelector } from "react-redux";
import { banUser } from '../service/banUser';
import { muteUser } from '../service/muteUser';
import './userInfo.scss';


export const AdminUserInfiButton = ({item, i}) => {


    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline);
    const socket = useSelector(state => state.getUserSocketReducer.socket)
    const isTabletorMobile = (window.screen.width < 730);
    const chatId = useSelector(state => state.userDataReducer.chatId)
    const isPrivatChat = useSelector(state => state.userDataReducer.isPrivatChat)
    const arrUsersOnline = usersOnline.map( i => i?.userName)
    const userNamesOnlineSet =  new Set(arrUsersOnline)


    return(
        <div 
            key={item._id}
            className={isPrivatChat&&(chatId === item._id)? 'online active' :'online' }                       
            onClick={() => {
                console.log(item._id, user._id)
                store.dispatch(privateMessage({chatId: item._id}))
                socket.emit('privat chat', {
                    user,
                    to: item._id,
                    })
            }}>
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
                    <span key={i} style={{color: 'green'}}>online</span>
                    : ''
                    }
        </div>
    )
}