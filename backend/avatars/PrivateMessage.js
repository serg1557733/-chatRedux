const {model, Schema} = require('mongoose');

const PrivateMessage = new Schema({
    text: {type: String, required: true},
    createDate: {type: Date, required: true},
    fromUser:{ type: Schema.Types.ObjectId, ref: 'User' },
    toUser:{ type: Schema.Types.ObjectId, ref: 'User' },
    file: {type: String} , // not in use
    fileType: {type: String} //not in use

})

module.exports = model('PrivateMessage', PrivateMessage)