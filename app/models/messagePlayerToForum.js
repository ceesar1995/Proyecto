// app/models/messagePlayerToForum.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessagePlayerToForumSchema   = new Schema({
    idPlayer: {type:Schema.Types.ObjectId, ref:'Player',required:true},
    idTeam: {type:Schema.Types.ObjectId, ref:'Team',required:true},
    idMessage: {type:Schema.Types.ObjectId, ref:'Message',required:true},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MessagePlayerToForum', MessagePlayerToForumSchema);