// Importing modules
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

// imports from orginal vfad repo
const upload = require('./client/server/upload')
const cors = require('cors')
//===================================

const app = express();
const PORT = process.env.PORT || 3001;

// from vfad repo
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => {
  window.alert()
  res.send("Welcome " + req.query.username + "!!")
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});

//===================================

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://vfad:codingUW2019@ds141218.mlab.com:41218/heroku_l09fpn6l";

mongoose.connect(MONGODB_URI);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(express.static('public'))

// from vfad repo
/* MONGOOSE SETUP */

mongoose.connect('mongodb://localhost/MyDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String
});

const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

//================================================================================
// Host Database
const hostSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  zip: { type: String, required: true }
});

const Host = mongoose.model("Host", hostSchema);
//===============================================================================

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log(username, "what is username");
    UserDetails.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

// app.post('/',
//   passport.authenticate('local', { failureRedirect: '/error' },
//   function(req, res) {
//     // console.log(req.body, "req.body");
//     res.redirect('/success?username='+req.user.username);
//   }));

app.post('/api/login', (req, res) => {

  console.log(req.body, "req");
  res.redirect('/success?username=' + req.body.username);
});

app.get('/api/users', (req, res) => {
  UserDetails.find({}, (err, users) => {
    res.send(users);
  })
})

//================================================================================================
// Host Database Post
app.post('/api/host/signup', (req, res) => {
  console.log(req.body)
  Host.insertMany(req.body)
    .then(res => {
      console.log(res);
    })


  //code to save to DB


  // To send back to the client
  res.json({ msg: 'sucessss!!!!' })
})


var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// app.post('/upload', upload)
app.post('./client/server/upload')
//===============================================


app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

app.listen(PORT, () => {
  console.log('Server started on ' + PORT)
})