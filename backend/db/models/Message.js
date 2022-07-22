const {model, Schema} = require('mongoose');

const Message = new Schema({
    text: {type: String, required: true},
    userName : {type: String, required: true},
    createDate: {type: Date, required: true},
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }], //not using 
    userAvatar: {type: String, required: false} // change to agregation
})

module.exports = model('Message', Message)