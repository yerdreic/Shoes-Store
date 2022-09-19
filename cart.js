const onClearItemEventHandler = async (itemID) => {
  itemID = itemID === undefined ? null : itemID;

  try {
    let res = await fetch("/clearCart", {
      body: JSON.stringify({ itemID }),
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    res = await res.json();

    //cart was successfully cleared
    if (res.cartWasCleared) {
      window.alert("Cart was cleared successfully.");

      setTimeout(() => {
        letRedirect("/successClearCart");
      }, 1000);
    } else if (res.productWasRemovedFromCart) {
      window.alert("Item was successfully deleted");

      setTimeout(() => {
        letRedirect("/successClearCart");
      }, 1000);
    } else {
      setTimeout(() => {
        letRedirect("/successClearCart");
      }, 1000);
    }
  } catch (error) {
    console.log("err ", error);
    window.alert(error);

    setTimeout(() => {
      letRedirect("/redirectHome");
    }, 1000);
  }
};

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
      } else if (res.itemsInCart === true) {
        let itemsInCart = res.cartCookie;

        console.log("items in cart:", itemsInCart);
        //we'll create an element from each product
        let totalPrice = 0;

        let insertItemsUnder = document.getElementById("insertItemsUnder");
        let cartFooter = document.getElementById("cartFooter");

        itemsInCart.forEach((item) => {
          let imgSrc = item.product.image;

          let itemID = item.product._id;
          let itemName = item.product.name;
          let itemPrice = item.product.price;
          let itemCount = item.count;
          totalPrice += Number(itemPrice * itemCount);

          console.log("itemID:", itemID);
          console.log("imgSrc:", imgSrc);
          console.log("itemName:", itemName);
          console.log("itemPrice:", itemPrice);
          console.log("itemCount:", itemCount);
          console.log("totalPrice:", totalPrice);

          let itemImg = document.createElement("img");

          if (
            imgSrc &&
            typeof imgSrc === "string" &&
            imgSrc.startsWith("data:image")
          ) {
            itemImg.src = imgSrc;
          } else {
            itemImg.src = "images/" + imgSrc;
          }

          let tr = document.createElement("tr");
          let td1 = document.createElement("td");
          let td2 = document.createElement("td");
          let td3 = document.createElement("td");
          let td4 = document.createElement("td");
          let divProductItem = document.createElement("div");
          let divProductInfo = document.createElement("div");
          let aClass = document.createElement("a");
          let h4 = document.createElement("h4");
          let divCount = document.createElement("count-input");
          let select = document.createElement("select");
          let option1 = document.createElement("option");
          let option2 = document.createElement("option");
          let option3 = document.createElement("option");
          let aClassRemove = document.createElement("a");
          let buttonClassTrash = document.createElement("button");

          insertItemsUnder.appendChild(tr);
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          td1.appendChild(divProductItem);
          td1.appendChild(divProductInfo);
          divProductItem.appendChild(aClass);
          divProductInfo.appendChild(h4);
          aClass.appendChild(itemImg);
          tr.appendChild(td2);
          td2.appendChild(divCount);
          divCount.appendChild(select);
          select.appendChild(option1);
          select.appendChild(option2);
          select.appendChild(option3);
          td4.appendChild(aClassRemove);
          aClassRemove.appendChild(buttonClassTrash);

          divProductItem.classList.add("product-item");
          aClass.classList.add("product-thumb");
          divProductInfo.classList.add("product-info");
          h4.classList.add("product-title");
          td2.classList.add("text-center");
          select.classList.add("form-control");
          td3.classList.add("text-center", "text-lg", "text-medium");
          td4.classList.add("text-center");
          aClassRemove.classList.add("remove-from-cart");
          buttonClassTrash.classList.add("fa", "fa-trash");

          td3.innerText = itemPrice + "$";
          aClass.innerText = itemName;
          buttonClassTrash.setAttribute(
            "onclick",
            'onClearItemEventHandler("' + itemID + '")'
          );
          itemImg.setAttribute("src", imgSrc);
          option1.innerText = itemCount;
          option2.innerText = "2";
          option3.innerText = "3";
        });

        let subtotal = document.createElement("span");
        subtotal.classList.add("text-medium");
        subtotal.innerText = "Subtotal:" + totalPrice;
        cartFooter.appendChild(subtotal);
      } else {
        window.alert(
          "The cart is only available for logged in users.\n You might want to login then..."
        );

        setTimeout(() => {
          letRedirect("/notSuccessLogin");
        }, 1000);
      }
    }
  } catch (error) {
    console.log("ERR", error);
    letRedirect("/redirectHome");
  }
};
