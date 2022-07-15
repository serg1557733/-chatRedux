import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';


export const Modal = () => {
    
    const text = useSelector(state=> state.userDataReducer.responseMessage)

    return <Alert 
                severity="error"
                sx={{display: (text ? 'block':'none' )}}
            >
            {text}
            </Alert>
}