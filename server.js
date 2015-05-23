// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// require body-parser
var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
  extended: true
}));

// require mongoose and create the mongoose variable
var mongoose = require('mongoose');
// connect to the mongodb database using mongoose
mongoose.connect('mongodb://localhost/basic_mongoose123');

var UserSchema = new mongoose.Schema({
 name: String,
 age: Number
})
var User = mongoose.model('User', UserSchema);

app.post('/users', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({name: req.body.name, age: req.body.age});
  // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/users');
      // res.render('result', {users: users_array});
    }
  })
});
//another post to update
app.post('/update/:id', function (req, res){
    User.update({_id: req.params.id}, {name: req.body.name, age: req.body.age}, function (err, user){
      console.log(req.params.id);
      console.log(req.body.name);
      if(err) {
        console.log('something went wrong');
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a user!');
        res.redirect('/users');
        // res.render('result', {users: users_array});
      }
    })
})
//another post to update
app.post('/remove/:id', function (req, res){
    User.remove({_id: req.params.id}, function (err, user){
      console.log(req.params.id);
      console.log(req.body.name);
      if(err) {
        console.log('something went wrong');
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a user!');
        res.redirect('/users');
        // res.render('result', {users: users_array});
      }
    })
})
// the root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.get('/', function(req, res) {
  User.find({}, function(err, records) {
    res.render('index', {users: records})
  })
});
app.get('/users', function(req, res) {
  User.find({}, function(err, records) {
    res.render('result', {users: records})
  })
});
app.get('/users/:id', function(req, res) {
  User.findOne({_id: req.params.id}, function(err, record) {
    console.log(record);
    res.render('user', {user: record})
  })
});
// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


// tell the express app to listen on port 8000
app.listen(8080, function() {
 console.log("listening on port 8080");
});