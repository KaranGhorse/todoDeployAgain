const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    username: String,
    work:{
        type: String,
    },
    title:{
        type: String,
    },
    complete:{
        type: Boolean,
        default: false
    }
},{timestamps: true})


module.exports=mongoose.model('todo',userSchema)