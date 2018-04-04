// app/models/playerTeam.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlayerTeamSchema   = new Schema({
    idPlayer: {type:Schema.Types.ObjectId, ref:'Player',required:true},
    idTeam: {type:Schema.Types.ObjectId, ref:'Team',required:true},
    date: {type:Date,required:true},
    creator: Boolean,
    privileges: Boolean,
    active: {type:Boolean,default:true},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('PlayerTeam', PlayerTeamSchema);