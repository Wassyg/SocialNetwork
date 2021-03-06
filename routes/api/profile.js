const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const keys = require('../../config/keys');
const passport = require('passport');

//Load Validation for the post routes
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//Load Profile et User model
const Profile = require('../models/Profile');
const User = require('../models/User');

//@route GET api/profile/test
//@desc test the route
//@access public
router.get('/test', (req,res)=> res.json({msg: "route profile works"}));


//@route GET api/profile/
//@desc get current user profile
//@access private, hence "passport.authenticate" (because it's a protected route)
router.get(
  '/', 
  passport.authenticate('jwt', { session: false }),
(req,res)=> {
  const errors ={};

  Profile.findOne({ user: req.user.id }) //le profil qu'on recherche est Profile.user.id, via l'id du user
          .populate('user', ['name', 'avatar']) //"user" est celui du modèle Profile (donc collection "users")
          .then(profile => {
            if(!profile){
              errors.noprofile = 'There is no profile for this user';
              return res.status(404).json(errors)
            }
            res.json(profile);
          })
          .catch(err => res.status(404).json(err));
});


//@route Get api/profile/all (tous les profils seront affichés)
//@desc get all the profiles
//@access public
router.get('/all', (req,res)=>{
  const errors= {};

  Profile.find({})
          .populate('user', ['name', 'avatar'])
          .then(profiles => {
            if(!profiles) {
              errors.noprofile='There are no profiles'
              return res.status(404).json(errors)
            }
            res.json(profiles)
          })
          .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
})


//@route Get api/profile/handle/:handle (route backend)
//@desc get profile by handle
//@access public
router.get('/handle/:handle',(req,res)=>{
const errors = {};

  Profile.findOne({handle: req.params.handle})//params is used for url path
  .populate('user', ['name', 'avatar']) //"user" est celui du modèle Profile (donc collection "users")
  .then(profile => {
    if(!profile){
      errors.noprofile= "there's no profile for this user";
      res.status(404).json(errors);
    }

    res.json(profile)
  })
  .catch(err => res.status(404).json(err))
});


//@route Get api/profile/user/:user_id
//@desc get profile by the user id (http://localhost:5000/api/profile/handle/toto)
//@access public

router.get('/user/:user_id',(req,res)=>{
const errors = {};
  
Profile.findOne({user: req.params.user_id}) 
  .populate('user', ['name', 'avatar']) //"user" est celui du modèle Profile (donc référence à la collection "users")
  .then(profile => {
    if(!profile){
      errors.noprofile= "there's no profile for this user";
      res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err))
});



//@route Post api/profile
//@desc create or edit (update) the user's profile
//@access private, hence passport
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req,res)=> {
    const { errors, isValid } = validateProfileInput(req.body);

    //check validation : if is not empty ==> is not valid ==> will return error
    if(!isValid){
      return res.status(400).json(errors);
    }

    //Get fields
    
    const profileFields= {};
    profileFields.user = req.user.id
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skills is an array - need to split
    if(typeof req.body.skills!== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    //social is an Object, needs to be created
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;

    //Pour Enregistrer les informations récupérées plus haut
    Profile.findOne({user : req.user.id})
          .then(profile => {
            if(profile){
              //update
              Profile.findOneAndUpdate(
                {user : req.user.id},
                {$set: profileFields}, //set the collected info received 
                {new : true}
              ).then( profile => res.json(profile));
            }else{
              //create

              //handle exists ? ne pas multiplier les "URL" d'un même profil
              Profile.findOne({handle: profileFields.handle})
                      .then(profile => {
                        if(profile){
                        errors.handle = "That handle already exists";
                        res.status(400).json(errors);
                      }

                        //doesn't exist => save in MongoDB
                        new Profile(profileFields).save()
                        .then(profile => res.json(profile));
                      });
                    }
                  });

    // if(req.body.handle) profileFields.handle = req.body.handle;
});

//@route Post api/profile/experience
//@desc  Add experience to profile
//@access private, hence passport
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
//now add the collected info to experience array (unshift adds it at the beginning of the array)
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);


//@route Post api/profile/education
//@desc  Add education to profile
//@access private, hence passport
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
//now add the collected info to experience array (unshift adds it at the beginning of the array)
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);


//@route Delete api/profile/experience/:exp_id
//@desc  Delete experience from profile
//@access private, hence passport
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

      //Splice out of array
      profile.experience.splice(removeIndex, 1);

      //save the profile with changes
      profile.save().then(profile => res.json(profile))
      .catch(err => res.status(404).json(err))
    });
  }
);

//@route Delete api/profile/education/:edu_id
//@desc  Delete education from profile
//@access private, hence passport
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

      //Splice out of array
      profile.education.splice(removeIndex, 1);

      //save the profile with changes
      profile.save().then(profile => res.json(profile))
      .catch(err => res.status(404).json(err))
    });
  }
);


//@route Delete api/profile
//@desc  Delete user and profile
//@access private, hence passport
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({_id : req.user.id})
        .then(()=> res.json({ success : true }))
    });
  }
);


module.exports = router;
