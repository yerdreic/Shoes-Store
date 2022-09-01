const renderItemsInCart = async () => {
  //for now - if he is not logged in - he is moved directly to login page
  try {
    let loggedIn = await fetch("/isloggedin");

    loggedIn = await loggedIn.json();
    console.log(loggedIn);

    if (loggedIn.isLoggedIn === true) {
      let res = await fetch("/itemsExistInCart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res) {
        console.log("there is no res from fetch itemsExistInCart");

        throw new Error("Somethin went wrong. Please try again");
      }

      res = await res.json();
      console.log("res after json()::", res);

      let productsTable = document.getElementById("insertCartItemUnder");

      //no items is cart. Add elemnts to document that say that
      if (res.itemsInCart === false) {
        let noItems = document.createElement("h1");
        let catalog = document.createElement("h1");
        noItems.innerText =
          'no items in cart yet. click on "go to catalog" to add some items!';
        catalog.innerHTML = '<a href="./catalog.html">go to catalog</a>';
        productsTable.appendChild(noItems);
        productsTable.appendChild(catalog);
        //there are items in cart
      }

      else if (res.itemsInCart === true) {
        let itemsInCart = res.cartCookie;
        //let productsFromDB = itemsInCart.productFromDB;

        console.log("items in cart:", itemsInCart);
        //the products should be in json format.
        //we'll create an element from each product
        let totalPrice = 0;
        // items in cart looks as follows:
        // 0:
        // count: 2
        // product: {_id: '62e8d2cd3e823c948203ca4f', name: 'Air Jordan 3 Retro', price: 399.99, image: 'shoes1.jpg'}

        // 1:
        // count: 1
        // product: {_id: '62e91a043e823c948203ca51', name: 'PG 6', price: 220, image: 'shoes2.jpg'}

        itemsInCart.forEach((item) => {
          //item is [product, productCount]
          let imgSrc = item.product.image;

          //not sure if itemID is needed here
          let itemID = item.product._id;
          let itemName = item.product.name;
          let itemPrice = item.product.price;
          let itemCount = item.count;
          totalPrice += Number(itemPrice * itemCount);

          console.log("imgSrc:", imgSrc);
          console.log("itemName:", itemName);
          console.log("itemPrice:", itemPrice);
          console.log("itemCount:", itemCount);
          console.log("totalPrice:", totalPrice);

          let divItem = document.createElement("div");
          let divClassStyle = document.createElement("div");
          let divClassProduct = document.createElement("div");
          let divClassPrice = document.createElement("div");
          let itemImg = document.createElement("img");
          let divClassCaption = document.createElement("div");

          divClassStyle.classList.add("count-input");
          divClassProduct.classList.add("product-item");
          //chnage the src of the image to the name from the db
          itemImg.src = "images/"+imgSrc;
          divClassCaption.classList.add("caption");

          let iShoppingCart = document.createElement("option");
          let iShoppingBag = document.createElement("option");
          let buttonTrash = document.createElement("button");
          buttonTrash.classList.add("remove-from-cart");
          iShoppingCart.classList.add("form-control");
          iShoppingBag.classList.add("form-control");
          divClassPrice.innerText = divClassPrice;
       
          buttonTrash.setAttribute(
            "onclick",
            'onClearItemEventHandler()'
          );

          let itemNameElement = document.createElement("product-title");
          itemNameElement.id = itemName;
          let classItemPrice = document.createElement("td");
          classItemPrice.classList.add("text-center", "text-lg", "text-medium");
          let delItemPrice = document.createElement("del");
          delItemPrice.id = itemPrice;
          itemNameElement.innerText = itemName;
          let spanItemPrice = document.createElement("span");
          spanItemPrice.classList.add("price");
          delItemPrice.innerText = itemPrice;
          divClassCaption.appendChild(itemNameElement);
          let insertItemsUnder = document.getElementById("insertItemsUnder");
          insertItemsUnder.appendChild(divClassCaption);

          
          // (V :) == WE HAVE IT!)

          // no need for discount column
          // change quantity to be chosen by increment via mouse
          // add id of item name so we can put inside it name from cookies - V :)
          // add id of item price so we can put inside it price from cookies
          // add id of item quantity so we can put inside it quantity from cookies
          // add id of item image so we can put inside it a link from cookies (after we add the name of the image file to db)
          // we have an href for each product - we didn't di a page for each product to be shown on it's own. If we want to do that - the href is ok. Otherwise - delete it
          
          //EDEN - create item and insert it under a main elemnt for each item taken out of the db.
          //use the totalPrice variable outside of the loop - and use it under the total element
          // let itemNameElement =
          // document.getElementsByClassName("product-title");
          // itemNameElement.innerText = itemName;

          // let itemPriceElement = document.getElementById("itemPrice");
          // itemPriceElement.innerText = itemPrice;

          // let deleteItem = document.getElementsByClassName("remove-from-cart");
          // deleteItem.setAttribute("onclick", "onClearItemEventHandler();");
        });

      
      } else {
        window.alert(
          "The cart is only available for logged in users.\n You might want to login then..."
        );

        setTimeout(() => {
          letRedirect("/notSuccessLogin");
        }, 3000);
      }
    }
  } catch (error) {
    console.log("ERR", error);
    letRedirect("/redirectHome");
  }
};


const onClearItemEventHandler = async (clearAllCart) => {
  let res;

  try {
    if (clearAllCart === true) {
      res = await fetch("/clearCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

    } else {
      res = await fetch("/clearCart", {
        body: JSON.stringify({}),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    }

    res = await res.json();
    //cart was successfully cleared
    if (res.cookiesWereCleared) {
      window.alert("Cart was cleared successfully.");

      setTimeout(() => {
        letRedirect("/successClearCart");
      }, 3000);
    } else {
      throw new Error("Something went wrong, we are sorry");
    }
  } catch (error) {
    console.log("err ", error);
    window.alert(error);

    setTimeout(() => {
      letRedirect("/redirectHome");
    }, 3000);
  }
};

//connect the logo of deletion to the
// const deleteItemFromCartButton = document.getElementById("remove-from-cart");
// deleteItemFromCartButton.addEventListener("click", async () => {
//     await onClearItemEventHandler();
// })