// app/models/match.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MatchSchema   = new Schema({
    date: {type:Date,required:true},
    scoreHome : {type:Number,min:0,max:99},
    scoreGuest : {type:Number,min:0,max:99},
    time : {type:Number,min:0,max:999},
    place: {type:String,required:true},
    rules: String,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Match', MatchSchema);
