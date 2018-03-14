// app/models/matchTeam.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchTeamSchema   = new Schema({
    idMatch: {type:Schema.Types.ObjectId, ref:'Match',required:true},
    idTeam: {type:Schema.Types.ObjectId, ref:'Team',required:true},
    dateCreated: {type:Date,required:true},
    home: Boolean,
    creator: Boolean,
    confirmed: Boolean,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MatchTeam', MatchTeamSchema);