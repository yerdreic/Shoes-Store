//Load HTTP module
//WE LEFT ALL THE CONSOLE.LOGS FOR YOU TO BE ABLE TO SEE HOW THINGS WORK. IF IT WAS NOT NECESSARY,
//- SORRY FOR THAT :/
const express = require("express");
const BSON = require("bson");
const path = require("path");
const hostname = "127.0.0.1";
const fileUpload = require("express-fileupload");
const port = 3001;
const app = express();
const { MongoClient } = require("mongodb");
module.exports = MongoClient;
const cookieParser = require("cookie-parser");
const {
  findOneUserInDB,
  insertOneUserToDB,
  insertOneEventToDB,
  insertOneProductToDB,
  findOneProductInDB,
  deleteOneProductInDB,
  findUsersViaRegex,
  findProductViaRegex,
  findEventsInDB,
  findEventsViaRegex,
} = require("./persist.js");
app.set("trust proxy", 1); // trust first proxy

app.use(cookieParser());
app.use(express.json());

// const uri =
//   "mongodb+srv://evilker:Evilker6998266@cluster0.baets.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(uri);

// async function main() {
//   try {
//     await client.connect();
//     console.log("DB is connected");
//   } catch (e) {
//     console.log(e);
//   }
// }

// main().catch(console.error);

app.get("/isloggedin", async (req, res) => {
  if (req.cookies?.session?.email && req.cookies?.session?.userID) {
    let userCookie = req.cookies.session;
    console.log("user cookie from /isloggedin:", userCookie);

    res.status(200).send({ isLoggedIn: true, userCookie });
  } else {
    res.clearCookie("session");
    res.status(401).send({ isLoggedIn: false });
  }
});

app.post("/register", async (req, res, next) => {
  console.log("in register in server");
  let email = req.body.email;
  let password = req.body.password;

  try {
    let foundEmailInDB = await findOneUserInDB("Users", email);

    if (foundEmailInDB) {
      console.log("USER: ", foundEmailInDB);
      return res.status(200).send({ emailExists: true });
    } else {
      let insertToDB = await insertOneUserToDB(email, password);

      if (insertToDB) {
        return res.status(200).json({ newUserWasAdded: true });
      }
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

app.post("/login", async (req, res, _next) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    let userFromDB = await findOneUserInDB(email);

    console.log("USER: ", userFromDB);

    if (userFromDB === null) {
      console.log("user is null");
      res.status(200).json({ emailExists: false, passwordExists: false });
    }

    if (password === userFromDB.password) {
      // fully logged in
      let loggedInUserID = userFromDB._id;
      //rememberme wasn't checked
      if (req.body.rememberMe === false) {
        console.log("remember me is false");
        res.cookie(
          "session",
          { userID: loggedInUserID, email: email },
          { maxAge: 1800000 }
        );
        //rememberme was checked
      } else {
        console.log("remember me is true");
        res.cookie(
          "session",
          { userID: loggedInUserID, email: email },
          { maxAge: 2592000000 }
        );
      }
      //insert event of logging in to the events
      await insertOneEventToDB("login", email).then(
        res.status(200).json({ emailExists: true, passwordExists: true })
      );
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/login.html");
  }
});

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.post("/addNewProductToDB", async (req, res, next) => {
  const imgAsBase64 = req.files ? req.files.file.data.toString("base64") : "";
  const addtoBase64 = "data:image/jpeg;charset=utf-8;base64,";
  const img = addtoBase64 + imgAsBase64;

  try {
    let nameAlreadyExist = await findOneProductInDB("name", req.body.itemName);

    if (nameAlreadyExist) {
      console.log("product: ", nameAlreadyExist);
      return res.status(200).send({ nameAlreadyExist: true });
    }

    let newProductAfterInsert = await insertOneProductToDB(
      req.body.itemName,
      req.body.itemPrice,
      img
    );

    if (newProductAfterInsert) {
      return res.status(200).json({ newProductWasAdded: true });
    } else {
      throw new Error("Something went wrong. Please try again");
    }
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

app.delete("/removeProductFromDB", async (req, res, next) => {
  console.log("in removeProductFromDB from server");
  try {
    let nameExistsInDB = await findOneProductInDB("name", req.body.name);

    if (!nameExistsInDB) {
      console.log("product: ", nameExistsInDB);
      return res.status(200).send({ nameExistsInDB: false });
    } else {
      let deleteProduct = await deleteOneProductInDB(req.body.name);

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
  // let user = req.body.user;
  console.log("productId from server:", productId);

  const objProductId = new BSON.ObjectId(productId);
  console.log("objproductId from server:", objProductId);

  try {
    let productFromDB = await findOneProductInDB("_id", objProductId);

    if (!productFromDB) {
      throw new Error("No result about this product");
    }
    //We don't render pictures of products in cart.
    //The data of productFromDB is only used in cart.
    //Thus, we can set the long image dataURL to null
    if (productFromDB.image.length > 4096) {
      productFromDB.image = null;
    }

    //add the product to a new session
    const currentCart = req.cookies?.cart || [];
    let productWasFoundInCookies = false;
    let i = -1;
    console.log("current cart:", currentCart);

    currentCart.forEach((product) => {
      i += 1;
      if (currentCart[i] != null || []) {
        console.log("cookie:", req.cookies.cart.valueOf());
        console.log("productID:", product.product._id);
        console.log("productID FROM DB:", productFromDB._id.valueOf());

        if (product.product._id.valueOf() == productFromDB._id.valueOf()) {
          productWasFoundInCookies = true;
          req.cookies.cart[i].count += 1;
          res.cookie("cart", currentCart, { maxAge: 1800000 });
          res.status(200).json({ productFromDB });
        }
      }
    });

    if (productWasFoundInCookies === false) {
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
  let itemName = req.body.itemName;

  try {
    let productFromDB = await findOneProductInDB("name", itemName);

    if (!productFromDB) {
      throw new Error("No result about this user");
    }

    productFromDB = await productFromDB.json();

    console.log("product: ", productFromDB);
    //add the product to cookie
    const currentCart = req.cookies.cart || [];

    const newCart = currentCart.filter(
      (elm) => elm.product_id.valueOf() !== productFromDB._id()
    );

    res.cookie("cart", newCart, { maxAge: 1800000 });
    res.status(200).json({ productWasRemovedFromCart: true });
  } catch (error) {
    console.log("ERR: ", error);
    // email not found / error
    return res.redirect("/index.html");
  }
});

app.get("/getUsersFromDB", async (req, res, _next) => {
  let searchVal = req.body.searchVal;
  console.log("search value from server:", searchVal);

  try {
    //user was found in db - return it's id

    if (searchVal === null || searchVal === "") {
      await findOneUserInDB().then((usersFromDB) => {
        console.log("users: ", usersFromDB);
        res.status(200).json({ usersFromDB });
      });
    } else {
      await findUsersViaRegex(searchVal).then((usersFromDB) => {
        console.log("users: ", usersFromDB);
        if (productsFromDB === null) {
          res.status(200).json({ noResults: true });
        } else {
          res.status(200).json({ usersFromDB });
        }
      });
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
      await findOneProductInDB("noKey").then((productsFromDB) => {
        console.log("products: ", productsFromDB);
        res.status(200).json({ productsFromDB });
      });
    } else {
      let productsFromDB = await findProductViaRegex(searchVal);

      if (productsFromDB) {
        console.log("products: ", productsFromDB);
        res.status(200).json({ productsFromDB });
      } else {
        res.status(200).json({ noResults: true });
      }
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

  if (req.cookies === {} || !req.cookies?.cart) {
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
      await findEventsInDB().then((eventsFromDB) => {
        console.log("Events: ", eventsFromDB);
        res.status(200).json({ eventsFromDB });
      });
    } else {
      await findEventsViaRegex(searchVal)
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

app.delete("/clearCart", async (req, res) => {
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
    let i = -1;
    console.log("current cart:", currentCart);

    const newCart = currentCart.filter(
      (elm) => elm.product._id.valueOf() !== itemID.valueOf()
    );
    res.cookie("cart", newCart, { maxAge: 1800000 });
    res.status(200).json({ productWasRemovedFromCart: true });
  }
});

//show products were added to cart belong to the current logged-in user


app.get("/admin", (req, res) => {
  //username can only exist once so only 1 admin
  if (req.cookies?.session?.email === "admin") {
    console.log("cookies from admin:", req.cookies.session);
    res.redirect("../admin.html");
  } else {
    res.status(404).send("You don't have access to this page!");
  }
});

app.use(express.static(path.join(__dirname)));


app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/redirectHome", (req, res) => {
  res.redirect("index.html");
});

app.get("/redirectAdmin", (req, res) => {
  res.redirect("admin.html");
});

app.get("/successClearCart", (req, res) => {
  res.redirect("cart.html");
});

app.get("/successLogin", (req, res) => {
  res.redirect("index.html");
});

app.get("/notSuccessLogin", (req, res) => {
  res.redirect("login.html");
});

app.get("/login.html", (req, res) => {
  res.redirect("login.html");
});

app.get("/register.html", (req, res) => {
  res.render("register.html");
});

app.get("/logout", async (req, res) => {

  let loggedInUserEmail = req.cookies?.session.email;
  await insertOneEventToDB("logout", loggedInUserEmail);

  res.clearCookie("session");
  res.clearCookie("cart");

  res.redirect("/index.html");
});

app.get("/backToCart", (req, res) => {
  res.redirect("cart.html");
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
