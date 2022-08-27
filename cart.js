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
        let itemsElements = document.querySelectorAll(".d1 > .d2 > .d3");
        let noItems = document.createElement("h1");
        noItems.innerText =
          'no items in cart yet. click on "go to catalog" to add some items!';
        noItems.innerHTML = '<a href="./catalog.html">go to catalog</a>';
        productsTable.appendChild(noItems);
        //there are items in cart
      }

      if (res.itemsInCart === true) {
        let itemsInCart = res.cartCookie;
        //let productsFromDB = itemsInCart.productFromDB;

        console.log("items in cart:", itemsInCart);
        //the products should be in json format.
        //we'll create an element from each product
        let totalPrice = 0;

        itemsInCart.forEach((item) => {
          //imgSrc = product.image;
          let itemName = item.name;
          let itemPrice = item.price;
          console.log(itemName);
          console.log(itemPrice);

          totalPrice += itemPrice;

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
          let itemNameElement =
            document.getElementsByClassName("product-title");
          itemNameElement.innerText = itemName;

          let itemPriceElement = document.getElementById("itemPrice");
          itemPriceElement.innerText = itemPrice;

          let deleteItem = document.getElementsByClassName("remove-from-cart");
          deleteItem.setAttribute("onclick", "onClearItemEventHandler();");
        });

        //Eden - use the total

        //     <td class="text-center">
        //     <div class="count-input">
        //         <select class="form-control">
        //             <option>1</option>
        //             <option>2</option>
        //             <option>3</option>
        //             <option>4</option>
        //             <option>5</option>
        //         </select>
        //     </div>
        // </td>
        // <td class="text-center text-lg text-medium">$43.90</td>
        // <td class="text-center text-lg text-medium">$18.00</td>
        // <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title=""
        //         data-original-title="Remove item"><i class="fa fa-trash"></i></a></td>
        // </tr>
        // <tr>
        // <td>
        //     <div class="product-item">
        //         <a class="product-thumb" href="#"><img
        //                 src="https://via.placeholder.com/220x180/5F9EA0/000000" alt="Product"></a>
        //         <div class="product-info">
        //             <h4 class="product-title"><a href="#">Daily Fabric Cap</a></h4><span><em>Size:</em>
        //                 XL</span><span><em>Color:</em> Black</span>
        //         </div>
        //     </div>
        // </td>
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
