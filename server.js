//Load HTTP module
const express = require("express");
const flash = require("express-flash");
const path = require("path");
const hostname = "127.0.0.1";
const port = 3000;
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
//const products = require('./products');
//const config = require("config");
//const { collection } = require("./modules/users");
//const { any } = require("webidl-conversions");
//const dbConfig = config.get("Customer.dbConfig.dbName");
const app = express();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

app.set("trust proxy", 1); // trust first proxy

app.use(cookieParser());
app.use(express.json());

//app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));

app.use(express.static(path.join(__dirname)));

const uri =
  "mongodb+srv://evilker:Evilker6998266@cluster0.baets.mongodb.net/?retryWrites=true&w=majority";

const cookieConfig = {};

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("DB is connected");
  } catch (e) {
    console.log(e);
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

// async function listDatabases(client) {
//   const databasesList = await client.db().admin().listDatabases();

//   console.log("Databases:");
//   databasesList.databases.forEach(db =>
//     console.log(client.db.collection.find()));
// };

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

const userExists = client
  .db("ShoesStore")
  .collection("Users")
  .findOne({ email: "example@example.com" });
if (!userExists) {
  client.db("ShoesStore").collection("Users").insertOne({
    email: req.body.email,
    password: req.body.password,
  });
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
    type: String,
  },
});

const Catalog = mongoose.model("ShoesStore.Products", catalogSchema);

// async function isloggedin(client, req) {
//   const user = await client.db("ShoesStore").collection("Users").findOne({
//     email: req.body.email,
//     password: req.body.password
//   });

//   if (user == null) {
//     return false;
//   } else {
//     return true;
//   }
// }

app.use("/catalog", async (req, res) => {
  const data = await client
    .db("ShoesStore")
    .collection("Products")
    .find()
    .then((result) => {
      let catalog = result.find; //need to edit !!!!
      res.send(loggedInUserID);
      res.send(data);
    });
});

app.get("/isloggedin", async (req, res) => {
  user = {
    email: req.body.email,
    password: req.body.password,
  };

  console.log("FF", req.cookies?.session);

  if (req.cookies === {} || !req.cookies?.session) {
    res.status(401).send({ isLoggedIn: false });
  } else {
    res.status(200).send({ isLoggedIn: true });
  }
});

app.post("/register", async (req, res, next) => {
  let newUser = null;
  console.log("in register");

  await client
    .db("ShoesStore")
    .collection("Users")
    .findOne({ $or: [{ email: req.body.email }] })
    .then((foundEmailInDB) => {
      if (foundEmailInDB) {
        console.log("USER: ", foundEmailInDB);
        return res.status(200).send({ emailExists: true });
      } else {
        newUser = {
          email: req.body.email,
          password: req.body.password,
        };
      }
    })
    .catch((error) => {
      console.log("ERR: ", error);
      // email not found / error
      return res.redirect("/login.html");
    });

  if (newUser !== null) {
    await client
      .db("ShoesStore")
      .collection("Users")
      .insertOne({ newUser })
      .then((newUserAfterInsert) => {
        let newUserID = newUserAfterInsert._id;
        res.cookie("session", { userID: newUserID }, { maxAge: 30 * 60 * 1000 });
        return res.status(200).json({ newUserWasAdded: true});
      });
  }
});

app.post("/login", async (req, res, _next) => {
  user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    //user was found in db - return it's id
    await client
      .db("ShoesStore")
      .collection("Users")
      .findOne({ $or: [{ email: user.email }, { password: user.password }] })
      .then((userFromDB) => {
        console.log("USER: ", userFromDB);

        if (userFromDB == null) {
          res.status(200).json({ emailExists: false, passwordExists: false });
        }

        if (user.password === userFromDB.password) {
          // fully logged in
          let loggedInUserID = userFromDB._id;
          //rememberme was checked - remember for 30 days
          if (req.body.rememberMe) {
            res.cookie(
              "session",
              { userID: loggedInUserID },
              { maxAge: 10 * 60 * 12 * 1000 }
            );
            //rememberme wasn't checked
          } else {
            res.cookie("session", { userID: loggedInUserID }, { maxAge: 60 * 30 * 1000 });
          }
          res.status(200).json({ emailExists: true, passwordExists: true });
        }
      });
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

// //user was not found in db
// .catch (err => {
//   //check if email only exists in db - return true
//   const emailExists = await client.db("ShoesStore").collection("Users").findOne(user.email).then((result => {
//     req.flash(
//       "error",
//       'Sorry, that email is taken. Maybe you need to <a href="/login.html">login</a>?'
//     );
//     res.send(true);
//   })
//   //email was not found in db - return false
//   .catch(err => {
//     req.flash(
//       "error",
//       'Sorry, that email does not appear to belong to any registered user. Check your email, or <a href="/register.html">register</a>?'
//     );
//     res.send(false);
//   })
// );
// });

//   const emailExists = await client.db("ShoesStore").collection("Users").findOne(user.email);

//   if (user.email == "" || user.password== "") {
//     req.flash("error", "Please fill out all the fields.");
//     res.redirect("/login.html");
//   }

//   if (!emailExists) {
//   } else if (emailExists) {
//     const userFromDB = await client.db("ShoesStore").collection("Users").findOne(user).then(result => {
//       let loggedInUserID = result.insertedId;
//       req.cookies["session"] = loggedInUserID;
//       res.send(loggedInUserID);
//       res.redirect("/index.html");
//     })
//     .catch (err => {
//       req.flash("error", "Something went wrong. Please try again.");
//       res.redirect("/login.html");
//     }) ;
//   }
// })

//   if (emailExists) {
//     req.flash(
//       "error",
//       'Sorry, that name is taken. Maybe you need to <a href="/login">login</a>?'
//     );
//     res.redirect("/register");
//   } else if (req.body.email == "" || req.body.password == "") {
//     req.flash("error", "Please fill out all the fields.");
//     res.redirect("/register");
//   } else
//   client.db("ShoesStore").collection("Users").insertOne(
//     {
//       email: "example@example.com",
//       password: "123456"
//     }
//   );
//   req.flash("info", "Account made, please log in...");
//   res.redirect("/login");
//   next();
// }
// })

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

app.post("/successLogin", (req, res) => {
  res.redirect("index.html");
});

app.post("/notSuccessLogin", (req, res) => {
  res.redirect("login.html");
});

app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/register", (req, res) => {
  res.render("register.html");
});

app.get("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/index.html");
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
