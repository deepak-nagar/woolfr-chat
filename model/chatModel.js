const mongoose = require("mongoose");
const db = require('../database/connection');
   
const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const ChatModel = mongoose.model('Chat', chatSchema);
module.exports=ChatModel