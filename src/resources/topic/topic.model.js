const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    subjects:[{
        type:mongoose.Types.ObjectId,
        ref:'Subject'
    }]
},{
    timestamps:true
});

module.exports = mongoose.model('Topic',topicSchema)