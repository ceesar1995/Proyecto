// app/models/team.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var crypto = require('crypto');

var TeamSchema   = new Schema({
    name: {type:String,required:true,index:true,unique:true},
    dateCreated: {type:Date,required:true},
    province: {type:Array,required:true},
    private: {type:Boolean,default:false},
    hash: String,
    salt: String,
    deleted: {type:Boolean,default:false}
});

TeamSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

TeamSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};
module.exports = mongoose.model('Team', TeamSchema);