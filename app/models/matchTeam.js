// app/models/matchTeam.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchTeamSchema   = new Schema({
    idMatch: {type:Schema.Types.ObjectId, ref:'Match',required:true},
    idTeamHome : {type:Schema.Types.ObjectId, ref:'Team',required:true},
    idTeamGuest : {type:Schema.Types.ObjectId, ref:'Team'},
    dateCreated: {type:Date,required:true},
    confirmed: {type:Boolean,default:false},
    rejected: {type:Boolean,default:false},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MatchTeam', MatchTeamSchema);