const onClearItemEventHandler = async (itemID) => {
  itemID = itemID === undefined ? null : itemID;

  try {
      let res = await fetch("/clearCart", {
        body: JSON.stringify({ itemID }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    

    res = await res.json();

    //cart was successfully cleared
    if (res.cartWasCleared) {
      window.alert("Cart was cleared successfully.");

      setTimeout(() => {
        letRedirect("/successClearCart");
      }, 3000);

    } else if (res.productWasRemovedFromCart){
      window.alert("Item was successfully deleted");

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
        //we'll create an element from each product
        let totalPrice = 0;

        let insertItemsUnder = document.getElementById("insertItemsUnder");
        let cartFooter = document.getElementById("cartFooter");

        itemsInCart.forEach((item) => {

          //item is [product, productCount]
          let imgSrc = item.product.image;

          //not sure if itemID is needed here
          let itemID = item.product._id;
          let itemName = item.product.name;
          let itemPrice = item.product.price;
          let itemCount = item.count;
          totalPrice += Number(itemPrice);

          console.log("itemID:",itemID);
          console.log("imgSrc:",imgSrc);
          console.log("itemName:", itemName);
          console.log("itemPrice:", itemPrice);
          console.log("itemCount:", itemCount);
          console.log("totalPrice:", totalPrice);
          
          let itemImg = document.createElement("img");
          itemImg.src = "images/"+imgSrc;
         
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
          //let buttonTrash = document.createElement("button");
          // let subtotal = document.createElement("span");
  
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
          //buttonTrash.classList.add("remove-from-cart");
             

          td3.innerText = itemPrice+"$";
          aClass.innerText = itemName;
          buttonClassTrash.setAttribute("onclick", 'onClearItemEventHandler("' + itemID + '")');
          itemImg.setAttribute("src", imgSrc);
          option1.innerText = "1";
          option2.innerText = "2";
          option3.innerText = "3";
          
         
          

          // <div id="insertItemsUnder"></div>
          //  
          //           <tr>
          //               <td>1
          //                   <div class="product-item">
          //                       <a class="product-thumb" href="#"><img
          //                               src="https://via.placeholder.com/220x180/FF0000/000000" alt="Product"></a>
          //                       <div class="product-info">
          //                           <h4 class="product-title"><a href="#">name</a></h4>
          //                       </div>
          //                   </div>
          //               </td>
          //               <td class="text-center">2
          //                   <div class="count-input">
          //                       <select class="form-control">
          //                           <option>1</option>
          //                           <option>2</option>
          //                           <option>3</option>
          //                       </select>
          //                   </div>
          //               </td>
          //               <td class="text-center text-lg text-medium">$18.00</td>3
          //               <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title=""
          //                       data-original-title="Remove item"><i class="fa fa-trash"></i></a></td>4
          //           </tr>
          
          
          //use the totalPrice variable outside of the loop - and use it under the total element
          // let itemNameElement =
          // document.getElementsByClassName("product-title");
          // itemNameElement.innerText = itemName;

          // let itemPriceElement = document.getElementById("itemPrice");
          // itemPriceElement.innerText = itemPrice;

          // let deleteItem = document.getElementsByClassName("remove-from-cart");
          // deleteItem.setAttribute("onclick", "onClearItemEventHandler()");
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
        }, 3000);
      }
    }
  } catch (error) {
    console.log("ERR", error);
    letRedirect("/redirectHome");
  }
};




//connect the logo of deletion to the
// const deleteItemFromCartButton = document.getElementById("remove-from-cart");
// deleteItemFromCartButton.addEventListener("click", async () => {
//     await onClearItemEventHandler();
// })



//connect the logo of deletion to the
// const deleteItemFromCartButton = document.getElementById("remove-from-cart");
// deleteItemFromCartButton.addEventListener("click", async () => {
//     await onClearItemEventHandler();
// })