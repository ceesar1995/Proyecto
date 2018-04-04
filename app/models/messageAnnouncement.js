// app/models/messageTeamToTeam.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageAnnouncementSchema   = new Schema({
    idTeam: {type:Schema.Types.ObjectId, ref:'Team',required:true},
    idMessage: {type:Schema.Types.ObjectId, ref:'Message',required:true},
    deleted: {type:Boolean,default:false}
});

module.exports = mongoose.model('MessageAnnouncement', MessageAnnouncementSchema);