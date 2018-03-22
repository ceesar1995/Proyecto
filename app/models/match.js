// app/models/match.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchSchema   = new Schema({
    dateBegin: {type:Date,required:true},
    scoreHome : {type:Number,min:0,max:99,default:0},
    scoreGuest : {type:Number,min:0,max:99,default:0},
    dateEnd : {type:Date},
    place: {type:String,required:true},
    rules: String,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Match', MatchSchema);
