// app/models/player.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlayerSchema   = new Schema({
    idUser: {type:Schema.Types.ObjectId, ref:'User',required:true},
    name: String,
    goalkeeper: Boolean,
    coordinator: Boolean,
    province: Array,
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('Player', PlayerSchema);
