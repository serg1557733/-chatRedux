export const sendMessageToSocket = (state, data) => {
    if (!!state.message && state.message.length < 200) {    //remove to other file
       data.socket.emit('message', {...data.user, message: state.message}); 
   } 
};

export const deleteMessageHandler = (state, data) => {
data.socket.emit('deleteMessage', {messageId: data.messageId, token: data.socket.auth.token});  
};


export const editMessageHandler = (state, data) => {
if(data.socket){
data.socket.emit('editmessage', {messageNewText: data.editMessage.message, messageId: data.messageId, token: data.socket.auth.token}); //add backend functional later find by id and edit 
}
};