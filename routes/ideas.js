var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// Load Idea Model

require('../models/Idea');
var Idea = mongoose.model('ideas');

router.get('/', (req,res) => {
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas:ideas
        });
    });
    
});
router.get('/add', (req,res) => {
    res.render('ideas/add');
});
//edit idea form
router.get('/edit/:id', (req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    });
});
router.post('/',(req,res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title:req.body.title,
            details:req.body.details,
        }
        new Idea(newUser)
        .save()
        .then(idea =>{
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
        })
    }
    
});
//edit form process
router.put('/:id', (req,res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Video idea updated');
                res.redirect('/ideas');
            })
    });
});

//delete idea
router.delete('/:id', (req,res) => {
      Idea.remove({_id: req.params.id})
      .then(() => {
          req.flash('success_msg', 'Video idea removed');
          res.redirect('/ideas');
      });
 });

module.exports = router;