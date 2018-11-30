const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');
//const passport = require("passport");

const opts={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) =>{
      User.findById(jwt_payload.id)
          .then(user =>{
            if(user){
              return done(null, user) //1st parameter is an error
            } else {
              return done(null, false) //no error but user not found
            }
          })
          .catch( err => console.log(err));
    })
  );
};
