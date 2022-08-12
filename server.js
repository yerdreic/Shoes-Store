//Load HTTP module
const express = require('express');
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;
const mongoose = require('mongoose');
const products = require('./products');
const config = require('config');
const dbConfig = config.get('Customer.dbConfig.dbName');

//Connecting to MongoDB
mongoose.connect('mongodb+srv://evilker:Evilker6998266@cluster0.baets.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log('Database Connected')
).catch(err=>{
    console.log(err);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Connection is on\n');
});

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/getProducts', (req,res) => {
   let payload = req.body.payload.trim();
   console.log(payload);
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});