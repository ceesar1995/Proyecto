// app/controllers/schedulerController.js

var nodeMailer = require('nodemailer');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var handlebars = require('handlebars');
var fs = require('fs');
var MatchPlayer = mongoose.model('MatchPlayer');
var Match = mongoose.model('Match');
var Team = mongoose.model('Team');


module.exports = {
    sendAnnouncements: function () {
        var tomorrow = new Date(new Date().getTime() + 19*60*60*1000);
        var dayAfterTomorrow = new Date(tomorrow.getTime() + 24*60*60*1000);

        var Matches = [];
        var matchPlayers = [];
        var Users = [];
        var Teams = [];
        Match.find({dateBegin:{$gt:tomorrow},dateEnd:{$lt:dayAfterTomorrow},confirmed:true,rejected:false,deleted:false}).then(
            function (matches) {
                Matches = matches;
                matches.forEach(function (match) {
                    matchPlayers.push(MatchPlayer.find({idMatch:match._id,summoned:true,deleted:false}));
                })
                return Promise.all(matchPlayers);
            }
        ).then(function (matchesPlayers) {
            matchPlayers = matchesPlayers;
            matchesPlayers.forEach(function (matchPlayers) {
                matchPlayers.forEach(function (matchPlayer) {
                    Users.push(User.findOne({idPlayer:matchPlayer.idPlayer,deleted:false}));
                })
            })
            return Promise.all(Users);
            }
        ).then(function (users) {
            Users = users;
            Matches.forEach(function (match) {
                Teams.push(Team.find({$or: [ {_id: match.idTeamHome},{_id: match.idTeamGuest}],deleted:false}));
            })
            return Promise.all(Teams);

        }).then(function (teams) {
            Teams = teams;
            //console.log(Matches);
            //console.log(matchPlayers);
            //console.log(Users);
            //console.log(teams);
            var numUser = 0;
            for(var i = 0; i<Matches.length;i++){
                for(var j=0;j<matchPlayers[i].length;j++){
                    sendEmailAnnouncement(Matches[i],Users[numUser],teams[i]);
                    numUser++;
                }
            }
        }).catch(function (error) {
            console.log(error);
        });

    }

};

var  sendEmailAnnouncement  =  function (match,user,teams) {
    //console.log(match);
    //console.log(user);
    //console.log(teams);
    var homeTeam = "";
    var guestTeam = "";
    if( teams[0] &&  teams[1]){
        if(match.idTeamHome.equals(teams[0]._id)){
            homeTeam = teams[0].name;
            guestTeam = teams[1].name;
        }
        else{
            homeTeam = teams[1].name;
            guestTeam = teams[0].name;
        }

    }
    var hours = match.dateBegin.getHours();
    var minutes = match.dateBegin.getMinutes();
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;


    readHTMLFile('./public/views/emailsTemplate/matchReminder.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            dateBegin: hours+":"+minutes,
            name: user.name,
            homeTeam: homeTeam,
            guestTeam: guestTeam,
            place: match.place,
            rules: match.rules
        };
        var htmlToSend = template(replacements);
        var transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'pachangaNetInfo@gmail.com',
                pass: 'pachanga1995'
            }
        });
        var mailOptions = {
            from: '"PachangaNet" <pachangaNetInfo@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Recuerdo de partido", // Subject line
            text: "Recordatorio", // plain text body
            html: htmlToSend// html body
        };

        transporter.sendMail(mailOptions,function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    });
};
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};