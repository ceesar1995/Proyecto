// app/models/matchPlayer.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchPlayerSchema   = new Schema({
    idMatch: {type:Schema.Types.ObjectId, ref:'Match',required:true},
    idPlayer: {type:Schema.Types.ObjectId, ref:'Player',required:true},
    idTeam:{type:Schema.Types.ObjectId, ref:'Team',required:true},
    date: {type:Date,required:true},
    goals:{type:Number,default:0},
    played: {type:Boolean,default:false},
    summoned:{type:Boolean,default:true},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MatchPlayer', MatchPlayerSchema);