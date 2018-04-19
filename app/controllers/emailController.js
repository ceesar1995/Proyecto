// app/controllers/emailController.js

var nodeMailer = require('nodemailer');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var EmailTemplate = require('email-templates').EmailTemplate;
var handlebars = require('handlebars');
var fs = require('fs');


module.exports = function(app) {


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

    app.post('/welcomeEmail', function (req, res) {
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
            to: req.body.to, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.body, // plain text body
            html: '<b>Bienvenido a PachangaNet</b>' // html body
        };

        transporter.sendMail(mailOptions,function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            //res.render('index');
         });
    });

    app.get('/forgottenPassword/:email', function (req, res) {

        User.findOne({email:req.params.email,deleted:false},function (err, user) {
            if (err)
                res.send(err);
            if(user){
                var token = user.generateJwt();
                var url = "http://localhost:8080/resetPassword/"+token;
                //var url = "www.marca.com";
                sendResetPasswordLink(req.params.email,url,user.name,res);
            }
            else{
                res.json(null);
            }
        });

    });

    var sendResetPasswordLink = function (email,url,name,res) {
        console.log(url);
        readHTMLFile('./public/views/emailsTemplate/passwordReset.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                url: url,
                name:name
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
                to: email, // list of receivers
                subject: "Reset Password", // Subject line
                text: "pulse el siguiente link", // plain text body
                html: htmlToSend// html body
            };

            transporter.sendMail(mailOptions,function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.json('EMAIL SENT');
            });
        });


        /*
        transporter.templateSender(
            new EmailTemplate('../public/views/emailsTemplate/passwordReset.ejs'), {
                from: '"PachangaNet" <pachangaNetInfo@gmail.com>',
            });
            */
    }
    var sendPasswordReset = function (email, username, name, tokenUrl) {
        // transporter.template
        sendResetPasswordLink({
            to: email,
            subject: 'Password Reset - PachangaNet'
        }, {
            name: name,
            username: username,
            token: tokenUrl
        }, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log('Link sent\n'+ JSON.stringify(info));
            }
        });
    };

}


