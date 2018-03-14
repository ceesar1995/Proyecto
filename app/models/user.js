// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UserSchema   = new Schema({
    username: {type:String,required:true,index:true,unique:true},
    hash: String,
    salt: String,
    name: String,
    surname: String,
    email:  {type:String,required:true,unique:true},
    dateEnrolled: {type:Date,required:true},
    dateBorn: Date,
    deleted: {type:Boolean,default:false},
    idPlayer: {type:Schema.Types.ObjectId, ref:'Player'},
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};
UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 0.1);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.SECRET_KEY); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('User', UserSchema);

