const getUsersFromDB = async (searchVal) => {
    searchVal = searchVal === undefined ? null : searchVal;
    console.log("search val:", searchVal);
  
  try {
    let res = await fetch("/getUsersFromDB", {
      body: JSON.stringify({ searchVal }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    console.log("res before json():", res);
    res = await res.json();
    console.log("res after json()::", res);

    //no result was found from search vals
    if (res.noResults) {
        throw new Error ("Something went wrong.. Please try again");
    // results were found from search vals
    } else {
      let users = res.usersFromDB;

      users.forEach((user) => {
        // looks like this:
        // value: {
        //     _id: new ObjectId("6300ec5c762d0dd5f28755c5"),
        //     newUser: { email: 'yael@example.com', password: '123456' },
        //     cart: { product: [Object], addedTime: '11:21:49' }
        //   }
        let userEmail = user.email;
        let userCart = user.cart;
        console.log(userEmail);
        console.log(userCart);

        // EDEN - needs to add the elements to the page as html elements

      });
    }

  } catch {
    console.log("err ", error);
    window.alert("RES.JSON is failed!!");

    setTimeout(() => {
      letRedirect("/redirectHome");
    }, 3000);
  }
};

const getLoginLogoutEvents = async () => {
  try {
    let res = await fetch("/getEventsFromDB", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    res = await res.json();
    
    if (res.noResults) {
      window.alert("no data yet in login/logout events");
    }

    if (res.eventsFromDB !== null) {
      let products = res.productsFromDB;
      console.log("products from DB:", products);
      //the products should be in json format.
      //we'll create an element from each product
      let insertItemsUnder = document.getElementById("insertItemsUnder");

      //iterating through login and logout
      events.forEach((event) => {
        //iterating through the users are at the event (login/logout)
        event.forEach((user) => {
          let userEmail = user.email;
          console.log(userEmail);
          console.log(event);


          //Eden - you now have the user email, and the event value is the action - login/Logout
          //Create an html here, and use those values


        })

    })
  }




} catch (error) {

}
}

const getProductsFromDB = async () => {
  let searchVal = null;
  
    try {
      let res = await fetch("/getItemsFromDB", {
        body: JSON.stringify({ searchVal }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      console.log("res before json():", res);
  
      res = await res.json();
      console.log("res after json()::", res);
  
      //no result was found from search vals
      if (res.noResults) {
        window.alert("No products were found in db!")
        // results were found from search vals
      } else {
        let products = res.productsFromDB;
        console.log("products from DB:", products);
        //the products should be in json format.
        //we'll create an element from each product
        //ins
        let insertItemsUnder = document.getElementById("insertItemsUnder");
  
        products.forEach((product) => {
          console.log(product.name);
          console.log(product.price);
  
          //imgSrc = product.image;
          let productName = product.name;
          let productPrice = product.price;
          let productImage = product.image;
          let productId = product._id;
          console.log(productName);
          console.log(productPrice);
          console.log(productId);
        // EDEN - needs to add the elements to the page as html elements

          
        });
      }
    } catch (error) {
      console.log("err ", error);
      window.alert("RES.JSON is failed!!");
  
      setTimeout(() => {
        letRedirect("/redirectHome");
      }, 3000);
    }
  };
  

//need to create a form, from which we will take the data of the new product
const onClickAddNewProductEventHandler = () => {
    const itemName = document.getElementById("itemName").value;
    const itemPrice = document.getElementById("itemPrice").value;
    const itemImage = document.getElementById("itemImage").value;
  
    try {
      let res = await fetch(`/addNewProductToDB`, {
        body: JSON.stringify({
          name: itemName,
          price: itemPrice,
          image: itemImage,
        }),
        cache: "no-cache",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res) {
        throw new Error("No result about this user");
      }
  
      if (res.status !== 200) {
        throw new Error(res.message);
      }
  
      res = await res.json()

      if (res.nameAlreadyExist === true) {
        window.alert("This product's name already exist in cart.. Please try a different name");  
      }

      else if (res.newProductWasAdded === true) {
        window.alert("Your new product was added to DB! You can now see it in the catalog! "); 
        // need to redirect to the page in which the products are shown under admin
        setTimeout(() => {
            letRedirect("/admin.html");
          }, 3000);     
      }
  
    } catch (error) {
      console.log("errr ", error);
      window.alert("Something went wrong.. Please try again");
  
      setTimeout(() => {
        letRedirect("/admin.html");
      }, 3000);
    }
  };
  

  const onClickRemoveProductEventHandler = () => {
    const itemName = document.getElementById("itemName").value;
  
    try {
      let res = await fetch(`/removeProductFromDB`, {
        body: JSON.stringify({
          name: itemName
        }),
        cache: "no-cache",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      res = await res.json();
  
      if (!res || res.nameExistsInDB === false) {
        throw new Error("No result about this product.Something is wrong");
      }
  
      if (res.status !== 200) {
        throw new Error(res.message);
      }

      if (res.productWasDeleted === true) {
        window.alert("Product was deleted from db");  
        // need to redirect to the page in which the products are shown under admin
        setTimeout(() => {
            letRedirect("/admin.html");
        }, 3000);     
        
      }
  
    } catch (error) {
      console.log("errr ", error);
      window.alert("Something went wrong.. Please try again");
  
      setTimeout(() => {
        letRedirect("/admin.html");
      }, 3000);
    }
  };

