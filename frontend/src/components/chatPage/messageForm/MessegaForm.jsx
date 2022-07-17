import {Avatar, Box} from '@mui/material';
import { dateFormat } from '../utils/dateFormat';
import { useSelector } from 'react-redux';   
import { Fragment, useRef, useEffect, useMemo} from 'react';
import { scrollToBottom } from '../utils/scrollToBottom';
import { useDispatch } from 'react-redux';
import { editMessage } from '../../../reducers/messageReducer';
   
export const MessageForm = () => {

    const randomColor = require('randomcolor');  
    const startMessages = useSelector(state => state.getUserSocketReducer.startMessages)
    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline)
    const userColor = useMemo(() => randomColor(),[]);
    const dispatch = useDispatch();
   
    const endMessages = useRef(null);

    useEffect(() => {
        scrollToBottom(endMessages)
      }, [startMessages]);
                  
    return (             
            <Box className='messageBox'>                     
                {
                startMessages.map((item, i) =>
                    <Fragment key={i} >

                        <Avatar 
                            sx={
                                (item.userName == user.userName)
                                ? 
                                {
                                    alignSelf: 'flex-end',
                                    fontSize: 10,
                                    width: '60px',
                                    height: '60px',
                                    color:'black',
                                    backgroundColor: userColor
                                }
                                :
                                {
                                    backgroundColor:  (usersOnline.map(current => {
                                        if(item.userName === current.userName ) {
                                            return current.color
                                        }
                                    
                                    } )),
                                    fontSize: 10,
                                    width: '60px',
                                    height: '60px',
                                    color:'black'
                                }
                            }> 
                            {item.userName}
                        </Avatar>   

                        <div 
                            key={item._id}
                            onClick = {(e) => {
                                if(e.target.className.includes('myMessage')){
                                    e.currentTarget.className += ' editMessage' 
                                    startMessages.map( item => {
                                        if((item.userName === user.userName) && (item.text === e.target.textContent)){
                                            console.log('edit message',e.target.textContent )
                                            dispatch(editMessage({editMessage: e.target.textContent}))                                        
                                        }
                                        })
                                    }
                                  
                            }}
                            className={ 
                                (item.userName === user.userName)? 'message myMessage' :'message'}
                        >

                            <p>{item.text}</p>  

                        </div>
                            <div className={ 
                                (item.userName === user.userName)? 'myData' :'date'}>
                                <div className='time'>
                                    {dateFormat(item).time}
                                </div> 
                                
                                <div className='date'>
                                    {dateFormat(item).year}
                                </div>
                            
                            </div>
                    </Fragment>
                )}

                <div ref={endMessages}></div>

            </Box>
    )
} 