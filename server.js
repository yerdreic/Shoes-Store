//Load HTTP module
const express = require("express");
const flash = require("express-flash");
const path = require("path");
const hostname = "127.0.0.1";
const port = 3000;
const mongoose = require("mongoose");
const {MongoClient} = require('mongodb');
//const products = require('./products');
//const config = require("config");
//const { collection } = require("./modules/users");
//const { any } = require("webidl-conversions");
//const dbConfig = config.get("Customer.dbConfig.dbName");
const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));

app.use(express.static(path.join(__dirname)));

const uri =
"mongodb+srv://evilker:Evilker6998266@cluster0.baets.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log ("DB is connected");
  } catch (e) {
    console.log(e)
  // } finally{
  //   await client.close();
  // }
}
}

main().catch(console.error);


//Connecting to MongoDB
// try {
//   // Connect to the MongoDB cluster
//   await client.connect();

//   // Make the appropriate DB calls
//   await listDatabases(client);
// } catch (e) {
//   console.error(e);
// } finally {
//   await client.close();
// }

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => 
    console.log(client.db.collection.find()));
};

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   }
// });

const userExists = client.db("ShoesStore").collection("Users").findOne({email: "example@example.com"})
if (!userExists) {
  client.db("ShoesStore").collection("Users").insertOne(
    {
      email: req.body.email,
      password: req.body.password
    }
  ); 
} 

// const User = mongoose.model("ShoesStore.Users", userSchema);

const catalogSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true.valueOf,
  },
  photo: {
    type: String
  },
});

const Catalog = mongoose.model("ShoesStore.Products", catalogSchema);


async function isloggedin(client, req) {
  const user = await client.db("ShoesStore").collection("Users").findOne({
    email: req.body.email,
    password: req.body.password
  });

  if (user == null) {
    return false;
  } else {
    return true;
  }

}

app.use("/catalog", async (req, res) => {
  const data = await client.db("ShoesStore").collection("Products").find();
  res.send(data);
})

app.get("/isloggedin", async (req, res) => {
  const user = await client.db("ShoesStore").collection("Users").findOne({
    email: req.body.email,
    password: req.body.password
  });

  res.send(user);
});

app.post("/register/:userName", async (req, res, next) => {
  //const user = await isloggedin(client);

  const emailExists = client.db("ShoesStore").collection("Users").findOne({email: req.body.email})
  if (!userExists) {
} 


  if (emailExists) {
    req.flash(
      "error",
      'Sorry, that name is taken. Maybe you need to <a href="/login">login</a>?'
    );
    res.redirect("/register");
  } else if (req.body.email == "" || req.body.password == "") {
    req.flash("error", "Please fill out all the fields.");
    res.redirect("/register");
  } else
  client.db("ShoesStore").collection("Users").insertOne(
    {
      email: "example@example.com",
      password: "123456"
    }
  ); 
  req.flash("info", "Account made, please log in...");
  res.redirect("/login");
  next();
});

// app.use("/login", async (req, res, next) => {
//   const user = await User.findOne({
//     email: req.body.email,
//     password: req.body.password,
//   });

//   if (user) {
//     res.redirect("/");
//   } else {
//     res.redirect("/login");
//   }

//   next();
// });

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });


app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/register", (req, res) => {
  res.render("register.html");
});

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});


//check for user authentication before trying to view cart
app.get("/cart.html", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/getProducts", (req, res) => {
  let payload = req.body.payload.trim();
  console.log(payload);
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
