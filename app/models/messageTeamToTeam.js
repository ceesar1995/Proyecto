// app/models/messageTeamToTeam.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageTeamToTeamSchema   = new Schema({
    idTeamRem: {type:Schema.Types.ObjectId, ref:'Team',required:true},
    idTeamRec: {type:Schema.Types.ObjectId, ref:'Team',required:true},
    idMessage: {type:Schema.Types.ObjectId, ref:'Message',required:true},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MessageTeamToTeam', MessageTeamToTeamSchema);