import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useState } from 'react';
import { store } from './store';

export default function App() {

    const [token, setToken] = useState(localStorage.getItem('token'))
 
    store.subscribe(() =>  {
        setToken(store.getState().token)
        localStorage.setItem('token', store.getState().token)
    });
    
    return token ? <ChatPage /> : <LoginForm/>
};

