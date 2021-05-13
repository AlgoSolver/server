const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    problems:[{
        type:mongoose.Types.ObjectId,
        ref:'problem'
    }]
},{
    timestamps:true
});

module.exports = mongoose.model('Subject',subjectSchema)