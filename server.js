const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport'); //main authentification module, JWT is just one part of it

const app = express();

//create routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//bodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//config database
const db = require('./config/keys').mongoURI;

//connecter db à MongoDB
mongoose
.connect(db)
.then( ()=>console.log('MongoDB connected'))
.catch((err)=>console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);


//link the routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);



//permet de lier HEROKU
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`))
