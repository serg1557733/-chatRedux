import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useSelector } from 'react-redux';

export default function App() {

    const token = useSelector(state => localStorage.getItem('token') || state.userDataReducer.token);
    
    return token ? <ChatPage /> : <LoginForm/>
};

