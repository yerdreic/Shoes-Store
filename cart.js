const renderItemsInCart = async () => {

  try {
    let loggedIn = await fetch("/isloggedin");
    
    if (loggedIn.isLoggedIn) {

    

    let res = await fetch("/itemsExistInCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res) {
      throw new Error("Somethin went wrong. Please try again");
    }

    res = await res.json();

    let productsTable = document.getElementById("insertCartItemUnder");

    //no items is cart. Add elemnts to document that say that
    if (!res.itemsInCart) {
      let noItems = document.createElement("h1");
      noItems.innerText =
        'no items in cart yet. click on "go to catalog" to add some items!';
      noItems.innerHTML = '<a href="./catalog.html">go to catalog</a>';
      productsTable.appendChild(noItems);
      //there are items in cart
    }

    if (res.itemsInCart) {
      let itemsInCart = res.cartCookie;

      let arrayItemsInCart = Array.from(itemsInCart);
      console.log("items in cart:", arrayItemsInCart);
      //the products should be in json format.
      //we'll create an element from each product
      arrayItemsInCart.forEach((item) => {
        //imgSrc = product.image;
        let itemName = item.name;
        let itemtPrice = item.price;
        console.log(itemName);
        console.log(itemtPrice);

        // (V :) == WE HAVE IT!)

        // no need for discount column
        // change quantity to be chosen by increment via mouse
        // add id of item name so we can put inside it name from cookies - V :)
        // add id of item price so we can put inside it price from cookies
        // add id of item quantity so we can put inside it quantity from cookies
        // add id of item image so we can put inside it a link from cookies (after we add the name of the image file to db)
        // we have an href for each product - we didn't di a page for each product to be shown on it's own. If we want to do that - the href is ok. Otherwise - delete it

        document.write('        <td class="text-center">');
        document.write('        <div class="count-input">');
        document.write('            <select class="form-control">');
        document.write('                <option>1</option>');
        document.write('                <option>2</option>');
        document.write('                <option>3</option>');
        document.write('                <option>4</option>');
        document.write('                <option>5</option>');
        document.write('            </select>');
        document.write('        </div>');
        document.write('    </td>');
        document.write('    <td class="text-center text-lg text-medium" id="itemPrice"></td>');
        document.write('    <td class="text-center"><a class="remove-from-cart"  data-toggle="tooltip" title=""');
        document.write('            data-original-title="Remove item"><i class="fa fa-trash"></i></a></td>');
        document.write('    </tr>');
        document.write('    <tr>');
        document.write('    <td>');
        document.write('        <div class="product-item">');
        document.write('            <a class="product-thumb" href="#"><img');
        document.write('                    src="https://via.placeholder.com/220x180/5F9EA0/000000" alt="Product"></a>');
        document.write('            <div class="product-info">');
        document.write('                <h4 class="product-title"><a href="#"></a></h4><span><em>Size:</em>');
        document.write('                    XL</span><span><em>Color:</em> Black</span>');
        document.write('            </div>');
        document.write('        </div>');
        document.write('    </td>');
        document.write('');

      });
    

    let itemNameElement = document.getElementsByClassName("product-title");
    itemNameElement.innerText = itemName;

    let itemPriceElement = document.getElementById("itemPrice");
    itemPriceElement.innerText = itemPrice;

    let deleteItem = document.getElementsByClassName("remove-from-cart");
    deleteItem.setAttribute("onclick", 'onClearItemEventHandler();')
    }

  


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
  }
    } catch (error) {
    console.log("ERR", err);
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
        body: JSON.stringify({

        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    }

    res = await res.json();
    //cart was successfully cleared
    if (res.cookiesWereCleared) {
      letRedirect("/successClearCart");

      setTimeout(() => {
        window.alert("Cart was cleared successfully.");
      }, 3000);
    } else {
      throw new Error("Something went wrong, we are sorry");
    }
  } catch (error) {
    console.log("err ", error);

    setTimeout(() => {
      window.alert(error);
    }, 3000);

    letRedirect("/redirectHome");
  }
};

window.addEventListener("load", () => {
    renderItemsInCart();
  });
  

//connect the logo of deletion to the 
// const deleteItemFromCartButton = document.getElementById("remove-from-cart");
// deleteItemFromCartButton.addEventListener("click", async () => {
//     await onClearItemEventHandler();
// })