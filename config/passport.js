var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (username, password, done) => {
        //match user
        User.findOne({
            email: username
        }).then(user => {
            if(!user){
                return done(null, false, {message: 'No user Found'});
            } 
            // match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                     return done(null, user);
                } else {
                    return done(null, false, {message: 'Password incorrect'});
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}