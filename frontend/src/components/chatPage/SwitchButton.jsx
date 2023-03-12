import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { showUserInfoBox } from '../../reducers/userDataReducer';

export const SwitchButton = () => {
    
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const dispatch = useDispatch();

    const handleChange = () => {
        dispatch(showUserInfoBox())
    }

    return (
        <div>  

            <label>Hide users</label>

            <Switch {...label} size="small"  onChange={() => handleChange()} />
        </div>
    )
}