import Alert from '@mui/material/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { deleteResponseMessage } from '../../reducers/userDataReducer';

export const Modal = () => {
    
    let text = useSelector(state=> state.userDataReducer.responseMessage)
    const dispatch =useDispatch();
    if (text){
            setTimeout(() => {
               dispatch(deleteResponseMessage())
                }, 2500)
    }
    
    return <Alert 
                severity="error"
                sx={{display: (text ? 'block':'none' )}}>
            {text}
            </Alert>
};