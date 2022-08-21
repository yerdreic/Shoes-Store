window.addEventListener("load", () => {
  renderItemsInCart();
});

const renderItemsInCart = async () => {
  try {
    let res = await fetch("/itemsExistInCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res) {
      throw new Error("Somethin went wrong. Please try again");
    }

    //res = await res.json();

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
        itemName = item.name;
        itemtPrice = item.price;
        console.log(itemName);
        console.log(itemtPrice);
      });
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

//connect the logo of deletion to the 
const deleteItemFromCartButton = document.getElementById("remove-from-cart");
deleteItemFromCartButton.addEventListener("click", async () => {
    await onClearItemEventHandler();
})