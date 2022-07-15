import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { store } from './store';

export default function App() {

    const token = useSelector(state => state.userDataReducer.token) 
    
    return token ? <ChatPage /> : <LoginForm/>
};

