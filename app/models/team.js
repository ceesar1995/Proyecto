// app/models/team.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeamSchema   = new Schema({
    name: {type:String,required:true,index:true,unique:true},
    dateCreated: {type:Date,required:true},
    province: {type:Array,required:true},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Team', TeamSchema);