const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    chatroom_id:{
        type:String
    },
    message:{
        type:String,
        // required:true
    },
    // the user who sent message
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // the user who reeived the message
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
},{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
