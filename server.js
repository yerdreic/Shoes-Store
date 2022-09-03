//Load HTTP module
const express = require("express");
const BSON = require("bson");
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
const { query } = require("express");

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

// const userExists = await client
//   .db("ShoesStore")
//   .collection("Users")
//   .findOne({ email: "example@example.com" });
// if (!userExists) {
//   client.db("ShoesStore").collection("Users").insertOne({
//     email: req.body.email,
//     password: req.body.password,
//   });
// }
const cartCellSchema = new mongoose.Schema({
  product: Object,
  addedTime: String,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true.valueOf,
  },
  cart: {
    type: Object,
  },
});

const userModel = mongoose.model("Users", userSchema);

app.get("/isloggedin", async (req, res) => {
  if (req.cookies === {} || !req.cookies?.session) {
    res.status(401).send({ isLoggedIn: false });
  } else {
    let userCookie = req.cookies.session;
    console.log(userCookie);

    res.status(200).send({ isLoggedIn: true, userCookie });
  }
});

app.post("/register", async (req, res, next) => {
  let user = null;
  console.log("in register in server");

  try {
    let foundEmailInDB = await client
      .db("ShoesStore")
      .collection("Users")
      .findOne({ $or: [{ email: req.body.email }, { password: null }] });

    if (foundEmailInDB) {
      console.log("USER: ", foundEmailInDB);
      return res.status(200).send({ emailExists: true });
    } else {
      user = {
        email: req.body.email,
        password: req.body.password,
        // cart: new Array(null),
      };
    }

    if (user !== null) {
      await client
        .db("ShoesStore")
        .collection("Users")
        .insertOne({ user })
        .then((newUserAfterInsert) => {
          // let newUserID = newUserAfterInsert._id;

          return res.status(200).json({ newUserWasAdded: true });
        });
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

app.post("/login", async (req, res, _next) => {
  user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    //user was found in db - return it's id
    let userFromDB = await client
      .db("ShoesStore")
      .collection("Users")
      .findOne({ $or: [{ email: user.email }, { password: user.password }] });

    console.log("USER: ", userFromDB);

    //userFromDB = await userFromDB.json();

    if (userFromDB === null) {
      console.log("user is null");
      res.status(200).json({ emailExists: false, passwordExists: false });
    }

    if (user.password === userFromDB.password) {
      // fully logged in
      let loggedInUserID = userFromDB._id;
      //rememberme was checked - remember for 30 days

      if (req.body.rememberMe === false) {
        console.log("remember me is false");
        res.cookie(
          "session",
          { userID: loggedInUserID, email: user.email },
          { maxAge: 864000000 }
        );
        //rememberme wasn't checked
      } else {
        console.log("remember me is true");
        res.cookie(
          "session",
          { userID: loggedInUserID, email: user.email },
          { maxAge: 1800000 }
        );
      }
      //insert event of logging in to the events
      await client
        .db("ShoesStore")
        .collection("Events")
        .insertOne({ login: user.email });

      res.status(200).json({ emailExists: true, passwordExists: true });
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

app.post("/addNewProductToDB", async (req, res, next) => {
  let product = null;
  let name = req.body.name;

  console.log("in addingNewProductToDB from server, name:".name);

  try {
    let nameAlreadyExist = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ name: req.body.name });

    if (nameAlreadyExist) {
      console.log("product: ", nameAlreadyExist);
      return res.status(200).send({ nameAlreadyExist: true });
    } else {
      // product = {
      //   name: req.body.name,
      //   price: req.body.price,
      //   image: req.body.image,
      // };
    }

    let newProductAfterInsert = await client
      .db("ShoesStore")
      .collection("Products")
      .insertOne(
        { name: req.body.name },
        { price: req.body.price },
        { image: req.body.image }
      );

    if (newProductAfterInsert) {
      return res.status(200).json({ newProductWasAdded: true });
    } else {
      throw new Error("Something went wrond. Please try again");
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

app.post("/removeProductFromDB", async (req, res, next) => {
  let product = null;
  console.log("in removeProductFromDB from server");
  try {
    let nameExistsInDB = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ name: req.body.name });

    if (!nameExistsInDB) {
      console.log("product: ", nameExistsInDB);
      return res.status(200).send({ nameExistsInDB: false });
    } else {
      let deleteProduct = await client
        .db("ShoesStore")
        .collection("Products")
        .deleteOne({ name: req.body.name });

      if (deleteProduct) {
        return res.status(200).json({ productWasDeleted: true });
      }
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

//adds item to cart for a user
app.post("/addItemToCart", async (req, res, _next) => {
  //if item already in cart - update it's quantity
  let productId = req.body.productId;
  let user = req.body.user;
  console.log("productId from server:", productId);

  const objProductId = new BSON.ObjectId(productId);
  const objUserId = new BSON.ObjectId(user._id);
  console.log("objproductId from server:", objProductId);

  try {
    let productFromDB = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ _id: objProductId });

    if (!productFromDB) {
      throw new Error("No result about this product");
    }

    // let today = new Date();
    // let addeTime =
    //   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    // let updatedUser = await client
    //   .db("ShoesStore")
    //   .collection("Users")
    //   .findOneAndUpdate(
    //     //at the moment, it overrides the last element in cart. Needs to be appended
    //     { email: user.email },
    //     { $set: { cart: { $push: { product: productFromDB } } } }
    //   );

    // .db("ShoesStore")
    // .collection("Users")
    // .updateOne(
    //   { email: user.email },
    //   {$set: { cart : {$push: [{ productFromDB}, {addeTime } ] } } }
    // );

    // if (!updatedUser) {
    //   throw new Error("No result about this user");
    // }
    // console.log("updatedUser: ", updatedUser);

    //productFromDB = await productFromDB.json();

    // console.log("product: ", productFromDB);
    // console.log("updatedUser: ", updatedUser);

    //add the product to a new session
    const currentCart = req.cookies.cart || [];
    let productWasFoundInCookies = false;
    let i = -1;
    console.log("current cart:", currentCart);

    currentCart.forEach((product) => {
      i += 1;
      if (req.cookies?.cart[i] != null || []) {
        console.log("cookie:", req.cookies.cart.valueOf());
        console.log("productID:", product.product._id);
        console.log("productID FROM DB:", productFromDB._id.valueOf());    

        if (product.product._id.valueOf() == productFromDB._id.valueOf()) {
          //product[1] is productCount
          productWasFoundInCookies = true;
          req.cookies.cart[i].count += 1;
          res.cookie("cart", currentCart, { maxAge: 1800000 });
          // console.log("COUNT VAL:", res.cookie.cart);
          res.status(200).json({ productFromDB });
        }
      }
    });

    if (productWasFoundInCookies === false) {
      // currentCart.push([productFromDB, 1]);
      // products are saved for 30 minutes in cart, unless user logges out
      if (currentCart === []) {
        res.cookie(
          "cart",
          { product: productFromDB, count: 1 },
          { maxAge: 1800000 }
        );
      } else {
        currentCart.push({ product: productFromDB, count: 1 });
        res.cookie("cart", currentCart, { maxAge: 1800000 });
      }
      // console.log(res.cookie.cart.valueOf());
      res.status(200).json({ productFromDB });
    }
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

    const newCart = currentCart.filter(
      (elm) => elm.product_id.valueOf() !== productFromDB._id()
    );

    res.cookie("cart", newCart, { maxAge: 1800000 });
    res.status(200).json({ productWasRemovedFromCart: true });

    // currentCart.forEach((product) => {
    //   console.log("productID:", product[0]._id);

    //   if (product[0]._id === productFromDB._id) {
    //     //product[1] is productCount
    //     // req.cookies.cart.product.remove();
    //     console.log("removed product from cart\n");
    //     res.status(200).json({ productFromDB });
    //   } else {
    //     throw new Error("Something went wrong.. please try again");
    //   }
    // });
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

app.post("/getUsersFromDB", async (req, res, _next) => {
  let searchVal = req.body.searchVal;
  console.log("search value from server:", searchVal);

  try {
    //user was found in db - return it's id

    if (searchVal === null || searchVal === "") {
      await client
        .db("ShoesStore")
        .collection("Users")
        .find({})
        .toArray()
        .then((usersFromDB) => {
          console.log("users: ", usersFromDB);
          res.status(200).json({ usersFromDB });
        });
    } else {
      await client
        .db("ShoesStore")
        .collection("Users")
        .find({
          $or: [
            { email: { $regex: searchVal, $options: "i" } },
            { password: null },
          ],
        })
        .toArray()
        .then((usersFromDB) => {
          console.log("users: ", usersFromDB);
          if (productsFromDB === null) {
            res.status(200).json({ noResults: true });
          } else {
            res.status(200).json({ usersFromDB });
          }
        });

      // productsFromDB = await productsFromDB.json();

      //no products were found
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

//get items from DB
app.post("/getItemsFromDB", async (req, res, _next) => {
  let searchVal = req.body.searchVal;
  console.log("search value from server:", searchVal);

  try {
    //user was found in db - return it's id

    if (searchVal === null || searchVal === "") {
      await client
        .db("ShoesStore")
        .collection("Products")
        .find({})
        .toArray()
        .then((productsFromDB) => {
          console.log("products: ", productsFromDB);
          res.status(200).json({ productsFromDB });
        });
    } else {
      let productsFromDB = await client
        .db("ShoesStore")
        .collection("Products")
        .find({
          $or: [
            { name: { $regex: searchVal, $options: "i" } },
            { price: null },
            { image: null },
          ],
        })
        .toArray();

      if (productsFromDB) {
        console.log("products: ", productsFromDB);
        res.status(200).json({ productsFromDB });
      } else {
        res.status(200).json({ noResults: true });
      }

      // productsFromDB = await productsFromDB.json();

      //no products were found
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

app.get("/itemsExistInCart", async (req, res) => {
  console.log("cookies", req.cookies?.cart);
  console.log("cookies", req.cookies?.session);

  if (req.cookies === {} || req.cookies?.cart.length === 0) {
    res.status(200).send({ itemsInCart: false });
  } else {
    let cartCookie = req.cookies?.cart;
    res.status(200).send({ itemsInCart: true, cartCookie });
  }
});

app.post("/getEventsFromDB", async (req, res) => {
  let searchVal = req.body.searchVal;
  console.log("search value from server:", searchVal);

  try {
    //user was found in db - return it's id

    if (searchVal === null || searchVal === "") {
      await client
        .db("ShoesStore")
        .collection("Events")
        .find({})
        .toArray()
        .then((eventsFromDB) => {
          console.log("Events: ", eventsFromDB);
          res.status(200).json({ eventsFromDB });
        });
    } else {
      await client
        .db("ShoesStore")
        .collection("Events")
        .find({
          $or: [
            { login: { $regex: searchVal, $options: "i" } },
            { logout: { $regex: searchVal, $options: "i" } },
          ],
        })
        .toArray()
        .then((eventsFromDB) => {
          console.log("events: ", eventsFromDB);
          if (eventsFromDB === null) {
            res.status(200).json({ noResults: true });
          } else {
            res.status(200).json({ eventsFromDB });
          }
        });
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/admin.html");
  }
});

app.post("/clearCart", async (req, res) => {
  console.log("cookies", req.cookies?.cart);
  let itemID = req.body.itemID;

  if (itemID == null) {
    res.clearCookie("cart");

    if (!req.cookies?.cart) {
      res.status(200).send({ cartWasCleared: true });
    } else {
      res.status(200).send({ cartWasCleared: false });
    }
  } else {
    const currentCart = req.cookies.cart || [];
    // const productCount = 1;
    let productWasFoundInCookies = false;
    let i = -1;
    console.log("current cart:", currentCart);

    const newCart = currentCart.filter(
      (elm) => elm.product._id.valueOf() !== itemID.valueOf()
    );
    res.cookie("cart", newCart, { maxAge: 1800000 });
    res.status(200).json({ productWasRemovedFromCart: true });


    // currentCart.forEach((product) => {
    //   console.log("cookie:", req.cookies.cart.valueOf());
    //   i += 1;
    //   console.log("itemID:", product.product._id);
    //   console.log("itemID FROM DB:", itemID.valueOf());

    //   if (product.product._id.valueOf() == itemID.valueOf()) {
    //     //product[1] is productCount
    //     productWasFoundInCookies = true;
    //     req.cookies.cart[i]
    //     res.cookie("cart", currentCart, { maxAge: 1800000 });
    //     // console.log("COUNT VAL:", res.cookie.cart);
    //     res.status(200).json({ productWasRemovedFromCart: true });
    //   }
    // });
  }
});

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

app.get("/logout", async (req, res) => {
  let loggedInUserEmail = req.cookies?.session.email;

  await client
    .db("ShoesStore")
    .collection("Events")
    .insertOne({ logout: loggedInUserEmail });

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
