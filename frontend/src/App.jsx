import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { getSocket } from './reducers/socketReducer';
import { useEffect } from 'react';

export default function App() {
    const token = useSelector(state => localStorage.getItem('token') || state.userDataReducer.token);
    
    const SOCKET_URL = process.env.NODE_ENV == "development"? process.env.REACT_APP_SERVER_URL : process.env.REACT_APP_PUBLIC_URL;

    const dispatch = useDispatch();

   useEffect(() => {
    if(token){
        const socket = io.connect(    
                SOCKET_URL, 
                {auth: {token}})
                if(socket){
                  dispatch(getSocket(socket))  
                }        
    }
 },[token])

    
   return token ? <ChatPage /> : <LoginForm/>
};

