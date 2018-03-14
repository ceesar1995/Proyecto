// app/models/matchPlayer.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchPlayerSchema   = new Schema({
    idMatch: {type:Schema.Types.ObjectId, ref:'Match',required:true},
    idPlayer: {type:Schema.Types.ObjectId, ref:'Player',required:true},
    dateCreated: {type:Date,required:true},
    goals:Number,
    played: Boolean,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MatchPlayer', MatchPlayerSchema);