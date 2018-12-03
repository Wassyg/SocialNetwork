const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require ('passport');


//Load Post et User models
const Post = require('../models/Post');
const User = require('../models/User');
const Profile = require('../models/Profile');

//Load Validation for the post routes
const validatePostInput = require('../../validation/post');

//@route GET api/posts/test
//@desc test the route
//@access public
router.get('/test', (req, res)=>res.json({msg: "file posts works"})
);

//@route GET api/posts
//@desc get all the posts
//@access public

router.get('/', (req, res)=> { 
    Post.find()
        .sort({date: -1})
        .then( posts => res.json(posts))
        .catch(err => res.status(404).json({nopostfound: 'no posts found'}))
});

//@route GET api/posts/:id
//@desc get one post by its ID
//@access public

router.get('/:id', (req, res)=> { 
    Post.findById(req.params.id)
        .then( post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'no post has been found with that id'}))
});

//@route POST api/posts
//@desc create post
//@access private
router.post('/', passport.authenticate( 'jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);
    //check validation 
    if(!isValid){
        //If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }
    
    const newPost = new Post({
        text : req.body.text,
        name : req.body.name, //name récupéré par Redux
        avatar: req.body.avatar, //avatar récupéré par Redux
        user: req.user.id
    })
    newPost.save().then(post => res.json(post));
});
    
//@route DELETE api/posts/:id
//@desc delete post
//@access private
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
  
      Profile.findOne({ user: req.user.id })
      .then(profile => {
          Post.findById(req.params.id)
            .then(post => {
                 if(post.user.toString() !== req.user.id){ //req.user.id est un string, il faut qu'on puisse les comparer 
                    return res.status(401).json({ notauthorized: "user not authorized"})
                 }
                 //if the post belongs to user, he can delete it
                 post.remove()
                    .then(() => res.json({success : true}))
                    . catch(err => res.status(404).json({ postnotfound: "No post found"}))
            })
      })
    });

module.exports = router;
