// app/models/player.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlayerSchema   = new Schema({
    idUser: {type:Schema.Types.ObjectId, ref:'User',required:true},
    name: String,
    goalkeeper: {type:Boolean,default:false},
    coordinator: {type:Boolean,default:false},
    province: Array,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Player', PlayerSchema);
