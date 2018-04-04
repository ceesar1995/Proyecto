// app/models/match.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchSchema   = new Schema({
    dateBegin: {type:Date,required:true},
    scoreHome : {type:Number,min:0,max:99,default:0},
    scoreGuest : {type:Number,min:0,max:99,default:0},
    dateEnd : {type:Date},
    place: {type:String,required:true},
    province: {type:Number,required:true},
    rules: String,
    idTeamHome : {type:Schema.Types.ObjectId, ref:'Team',required:true},
    idTeamGuest : {type:Schema.Types.ObjectId, ref:'Team',default:null},
    dateCreated: {type:Date,required:true},
    confirmed: {type:Boolean,default:false},
    rejected: {type:Boolean,default:false},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Match', MatchSchema);
