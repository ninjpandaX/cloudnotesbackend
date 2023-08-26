const mongoose = require('mongoose');
const {Schema} = mongoose;
const User = require('./User');

const NotesSchema = new Schema({
    //foreign key
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    tag:{
        type : String,
        default : 'general'
    },
    date:{
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Notes',NotesSchema,'notes');