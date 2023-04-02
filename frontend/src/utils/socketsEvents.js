import { store } from "../store";
import { getAllMessages, getAllUsers, addNewMessage, getUser,addNewPrivateMessage,getUsersOnline,friendsFromSocket } from "../reducers/socketReducer";
import { removeToken } from "../reducers/userDataReducer";

export const socketEvents = (socket) => {

socket.on('connected', data => {
                            store.dispatch(getUser(data));
                            })
                            .on('allmessages', (data) => {
                                store.dispatch(getAllMessages(data));
                                    })
                            .on('allDbUsers', (data) => {
                                store.dispatch(getAllUsers(data));
                                        })    
                            .on('newmessage', (data) => {
                                store.dispatch(addNewMessage(data))
                                })
                            .on('private', (data) => {
                                console.log(data)
                               store.dispatch(addNewPrivateMessage(data))
                                   })
                            .on('ban', (data) => {
                                store.dispatch(removeToken()); 
                                localStorage.removeItem('token');
                                })
                            .on('usersOnline', (data) => {
                                    store.dispatch(getUsersOnline(data))
                                })
                            .on('friends', data => {
                                    store.dispatch(friendsFromSocket(data))
                                })
                            .on('disconnect', (data) => {
                                if( data === 'io server disconnect') {
                                   // socket.disconnect();
                                    store.dispatch(removeToken()); 
                                }
                            })
                            .on('error', e => {console.log('On connected', e)}); 
}
    
