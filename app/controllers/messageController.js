// app/controllers/teamController.js

var Message = require('../models/message');
var Player = require('../models/player');
var MessageForum = require('../models/messagePlayerToForum');
var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function (app) {


    var listAllMessage = function (req, res) {
        Message.find(function (err, messages) {
            if (err)
                res.send(err);
            res.json(messages);
        });
    };

    var createAMessage = function (req, res) {
        var newMessage = new Message(req.body);
        newMessage.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    var readAMessage = function (req, res) {
        Message.findOne({_id: req.params.messageId}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };

    var updateAMessage = function (req, res) {
        Message.findOneAndUpdate({_id: req.params.messageId}, req.body, {new: true}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    var deleteAMessage = function (req, res) {

        Message.remove({
            _id: req.params.messageId
        }, function (err, team) {
            if (err)
                res.send(err);
            res.json({message: 'Message successfully deleted'});
        });
    };
    var getMessagesForum = function (req,res) {
        var messagesF = [];
        var Messages = [];
        MessageForum.find({idTeam: req.params.teamId }).then(
            function (messagesForum) {
                var Messages = [];
                messagesForum.forEach(function (message) {
                    messagesF.push(message);
                    Messages.push(Message.findOne({_id:message.idMessage}));
                    //playerIds.push(message.idPlayer);
                    /*
                    Player.find({_id:message.idPlayer}).then(
                        function (player) {
                            return Promise.all(player);
                        }
                    ).then(function (player) {
                        Players.push(player[0]);
                        //console.log(Players);
                        //message.player = player[0];
                    }).catch(function (error) {
                        res.status(500).send('one of the queries failed',error);
                    });
                    */
                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {
            /*
            console.log(messages);
            console.log(Players);

            playerIds.forEach(function (playerId) {
                Players.push(Player.findOne({_id:playerId}));
            });
             */
            var Players = [];
            Messages = messages;
            messagesF.forEach(function (message) {
                Players.push(Player.find({_id: message.idPlayer}));
            });
            return Promise.all(Players);


            //console.log(Players);
            //res.json(messages)

        }).then(function (players) {
            //console.log(players);
            var answer = {
                messages: Messages,
                players: players
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    }

    var createAMessagePlayerToForum = function (req, res) {
        var newMessagePlayerToForum = new MessageForum(req.body);
        newMessagePlayerToForum.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    app.get('/api/message', listAllMessage);
    app.post('/api/message', createAMessage);
    app.get('/api/message/:messageId', readAMessage);
    app.put('/api/message/:messageId', updateAMessage);
    app.delete('/api/message/:messageId', deleteAMessage);

    //Forum
    app.get('/api/messagesForum/:teamId',getMessagesForum);
    app.post('/api/messageForum',createAMessagePlayerToForum);

}

