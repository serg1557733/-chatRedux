import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Modal } from '../modalMessage/Modal';
import { useDispatch, useSelector } from 'react-redux';
import  {setUserName, setUserPassword, getUserData} from '../../reducers/userDataReducer'

export const LoginForm = () => {

    const dispatch = useDispatch();
    const userName = useSelector(state => state.userName);
    const password = useSelector(state => state.password);
    return (
        <Container maxWidth="xs">
            <Box
                component="form" 
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(getUserData())
                }}
                sx={{
                    marginTop: 40,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="user name"
                        name="userName"
                        autoComplete="email"
                        autoFocus
                        value={userName}
                        onChange={e => dispatch(setUserName({userName: e.target.value}))}/>
                <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => 
                            dispatch(setUserPassword({password: e.target.value}))
                        }/>
                <Modal/>
                <Button 
                    type="submit"
                    variant="contained"
                    fullWidth>
                        Login
                </Button>
            </Box>
        </Container>
    )
};