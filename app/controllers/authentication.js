var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');


module.exports.register = function(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function(err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
};

module.exports.login = function(req, res) {

    passport.authenticate('local', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};
module.exports.profileRead = function(req, res) {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                res.status(200).json(user);
            });
    }

};
module.exports = function (app) {
    var authenticate = function (req, res,next) {
        var token = req.header("Authorization");
        if(token){
            try {
                jwt.verify(token,process.env.SECRET_KEY,function(err, decoded) {
                    // err
                    if(err){
                        res.send(err)
                    }
                    else {
                        console.log(decoded);
                        // decoded undefined
                        next();
                    }

                });
            }
            catch (err){
                res.send(err);
            }

        }
        else{
            res.json({msg: 'No authentication header¡¡'})
        }


    };

    app.get('/api/*', authenticate);
    app.post('/api/*', authenticate);
    app.put('/api/*', authenticate);
}