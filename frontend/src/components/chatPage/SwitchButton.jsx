import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { showUserInfoBox } from '../../reducers/userDataReducer';
import { useSelector } from 'react-redux';

export const SwitchButton = () => {
    
    let showUserInfo = useSelector(state => state.messageReducer.showUserInfoBox)// || localStorage.getItem('showBox');

    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const dispatch = useDispatch();

    const handleChange = () => {
        dispatch(showUserInfoBox())
    }

    return (
        <div style={{bottom: 5,
                    position:'absolute'}}>  

            <label>Show users infobar</label>

            <Switch {...label} size="small" defaultChecked onChange={handleChange} />
        </div>
    )
}