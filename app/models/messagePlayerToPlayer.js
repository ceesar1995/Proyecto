// app/models/messagePlayerToPlayer.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessagePlayerToPlayerSchema   = new Schema({
    idPlayerRem: {type:Schema.Types.ObjectId, ref:'Player',required:true},
    idPlayerRec: {type:Schema.Types.ObjectId, ref:'Player',required:true},
    idMessage: {type:Schema.Types.ObjectId, ref:'Message',required:true},
    deletedRem: {type:Boolean,default:false},
    deletedRec: {type:Boolean,default:false}
});

module.exports = mongoose.model('MessagePlayerToPlayer', MessagePlayerToPlayerSchema);