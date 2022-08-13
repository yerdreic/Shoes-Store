//Load HTTP module
const express = require('express');
const flash = require('express-flash');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;
const mongoose = require('mongoose');
//const products = require('./products');
const config = require('config');
const dbConfig = config.get('Customer.dbConfig.dbName');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static('public'));

app.use(express.static(path.join(__dirname)));

//Connecting to MongoDB
mongoose.connect('mongodb+srv://evilker:Evilker6998266@cluster0.baets.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log('Database Connected')
).catch(err=>{
    console.log(err);
});


const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

const User = mongoose.model('ShoesStore.Users', userSchema);

app.post('/register/:userName', async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.userName,
    password: req.body.password
  });

  if (user) {
    req.flash('error', 'Sorry, that name is taken. Maybe you need to <a href="/login">login</a>?');
    res.redirect('/register');
  } else if (req.body.email == "" || req.body.password == "") {
    req.flash('error', 'Please fill out all the fields.');
    res.redirect('/register');
  } else new User({
    email: req.body.email,
    password: req.body.password
  }).save()
  req.flash('info', 'Account made, please log in...');
  res.redirect('/login');
  next();
});

app.post('/login', async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
  });
  if (user) res.redirect('/');
  else res.redirect('/login');
  next();
});


app.get('/', (req, res) => {
//rennder the correct navbar according to if user is authenticated
  if (req.isAuthenticated()){
    res.render('index.html')
  } else{
    res.render('')
  } 
})

app.get('/login', (req, res) => {
  res.render('login.js')
})


app.get('/register', (req, res) => {
  res.render('register.html')
})


app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

//Create HTTP server and listen on port 3000 for requests
// const server = http.createServer((req, res) => {

//   //Set the response HTTP header with HTTP status and Content type
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Connection is on\n');
// });

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

//check for user authentication before trying to view cart
app.get('/cart.html', (req,res) => {

  res.sendFile(__dirname + '/index.html');
});



app.post('/getProducts', (req,res) => {
   let payload = req.body.payload.trim();
   console.log(payload);
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});