var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router();

//load user model
require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req,res) => {
    res.render('users/login');
});
router.get('/register', (req,res) => {
    res.render('users/register');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res) =>{
    let errors =[];

    if(req.body.password!= req.body.password2){
        errors.push({text:'Password do not match'});
    }
    if(req.body.password.length <4){
        errors.push({text:'Password must be atleast 4 character'});
    }
    if(errors.length > 0){
        res.render('/register', {
            errors :errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({email: req.body.email})
          .then(user => {
              if(user){
                  req.flash('error_msg', 'Email already registered');
                  res.redirect('/users/register');
              } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }); 
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                        });
                    });
              }
          });
        
         }
});

module.exports = router;
