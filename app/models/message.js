// app/models/message.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    idUser: {type:Schema.Types.ObjectId, ref:'User',required:true},
    date: {type:Date,required:true},
    text: {type:String,required:true},
    subject: String,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Message', MessageSchema);