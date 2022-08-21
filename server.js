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

// app.use("/catalog", async (req, res) => {
//   const data = await client
//     .db("ShoesStore")
//     .collection("Products")
//     .find()
//     .then((result) => {
//       let catalog = result.find; //need to edit !!!!
//       res.send(loggedInUserID);
//       res.send(data);
//     });
// });

app.get("/isloggedin", async (req, res) => {
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
        res.cookie(
          "session",
          { userID: newUserID },
          { maxAge: 30 * 60 * 1000 }
        );
        return res.status(200).json({ newUserWasAdded: true });
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
            res.cookie(
              "session",
              { userID: loggedInUserID },
              { maxAge: 60 * 30 * 1000 }
            );
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

//adds item to cart for a user
app.post("/addItemToCart", async (req, res, _next) => {

  //if item already in cart - update it's quantity
  itemName = req.body.itemName;

  try {
    let productFromDB = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ name: itemName });

    if (!productFromDB) {
      throw new Error("No result about this user");
    }

    productFromDB = await productFromDB.json();

    console.log("product: ", productFromDB);

    //add the product to a new session
    const currentCart = req.cookies.cart || [];
    currentCart.push({ productFromDB });
    res.cookie("cart", currentCart, { maxAge: 30 * 60 * 1000 });
    console.log("FF", req.cookies?.cart);


    res.status(200).json({ productFromDB });
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

//adds item to cart for a user
app.post("/removeItemFromCart", async (req, res, _next) => {

  //if item already in cart - update it's quantity
  itemName = req.body.itemName;

  try {
    let productFromDB = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ name: itemName });

    if (!productFromDB) {
      throw new Error("No result about this user");
    }

    productFromDB = await productFromDB.json();

    console.log("product: ", productFromDB);

    //add the product to a new session
    const currentCart = req.cookies.cart || [];
    currentCart.push({ productFromDB });
    res.cookie("cart", currentCart, { maxAge: 30 * 60 * 1000 });
    console.log("FF", req.cookies?.cart);


    res.status(200).json({ productFromDB });
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

//get items from DB
app.post("/getItemsFromDB", async (req, res, _next) => {
  let searchVal = req.body.searchVal;
  console.log("search value from server:", searchVal);

  try {
    let findInput = "";

    if (searchVal !== "") {
      findInput = { name: { $regex: searchVal } };
    }
    //user was found in db - return it's id

    // if (searchVal === "") {
    //   await client
    //   .db("ShoesStore")
    //   .collection("Products")
    //   .find()
    //   .then((productFromDB) => {
    //     console.log("products: ", productFromDB);
    // }
    // } else {
    await client
      .db("ShoesStore")
      .collection("Products")
      .find(findInput)
      .then((productsFromDB) => {
        console.log("products: ", productsFromDB);

        //no products were found
        if (productsFromDB === null) {
          res.status(200).json({ noResults: true });
        } else {
          res.status(200).json({ productsFromDB });
        }
      });
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

app.use("/itemsExistInCart", async (req, res) => {
  console.log("cookies", req.cookies?.cart);

  if (req.cookies === {} || !req.cookies?.cart) {
    res.status(401).send({ itemsInCart: false });
  } else {
    let cartCookie = await req.cookies.cart.json();
    res.status(200).send({ itemsInCart: true, cartCookie });
  }
})

app.post("/clearCart", async (req, res) => {
  console.log("cookies", req.cookies?.cart);

  res.clearCookie("cart");

  if (!req.cookies?.cart) {
    res.status(200).send({ cookiesWereCleared: true });
  }
  else {
    res.status(401).send({ cookiesWereCleared: false });
  }
})


//show products were added to cart belong to the current logged-in user

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/redirectHome", (req, res) => {
  res.redirect("index.html");
});

app.post("/successClearCart", (req, res) => {
  res.redirect("cart.html");
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
  res.clearCookie("cart");
  res.redirect("/index.html");
});

app.post("/backToCart", (req, res) => {
  res.redirect("cart.html");
});

//check for user authentication before trying to view cart
app.get("/cart.html", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// app.post("/getProducts", (req, res) => {
//   let payload = req.body.payload.trim();
//   console.log(payload);
// });

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
