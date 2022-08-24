console.log("at addToCart.js");

const sendDataFromSearch = async (searchVal) => {
  console.log("search val:", searchVal);
  searchVal = searchVal === undefined ? null : searchVal;
  console.log("search val:", searchVal);

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
      window.alert("Sorry, no results were found for this search");
      // results were found from search vals
    } else {
      let products = res.productsFromDB;
      console.log("products from DB:", products);
      //the products should be in json format.
      //we'll create an element from each product
      let insertItemsUnder = document.getElementById("insertItemsUnder");

      products.forEach((product) => {
        console.log(product.name);
        console.log(product.price);

        //imgSrc = product.image;
        productName = product.name;
        productPrice = product.price;
        console.log(productName);
        console.log(productPrice);

        let divItem = document.createElement("div");
        let divClassStyle = document.createElement("div");
        let divClassProduct = document.createElement("div");
        let itemImg = document.createElement("img");
        let divClassCaption = document.createElement("div");

        divClassStyle.classList.add("col-xs-6", "col-md-4");
        divClassProduct.classList.add("product", "tumbnail", "thumbnail-3");
        //chnage the src of the image to the name from the db
        itemImg.setAttribute("src", "images/shoes1.jpg");
        divClassCaption.classList.add("caption");

        //divClassProduct.appendChild(itemImg);

        // const lastItem = Array.from(
        //   document.querySelectorAll('.item')
        // ).pop();

        //   <div id="item">
        //   <div class="col-xs-6 col-md-4" id="template">
        //     <div class="product tumbnail thumbnail-3" id="under-main-template">
        //       <img src="images/shoes1.jpg" id="under-main-template-1">
        //       <div class="caption" id="under-main-template-1">
        //         <button id="under-main-template-2">
        //           <span class="add-to-cart">Add To Cart</span>
        //           <i class="fas fa-shopping-cart"></i>
        //           <i class="fas fa-shopping-bag"></i>
        //           <span class="added-to-cart">Added To Cart</span>
        //         </button>
        //         <!-- added id to item name -->
        //         <h6 id="template-item-name"></h6>
        //         <span class="price">
        //           <!-- added id to price -->
        //           <del id="template-item-price"></del>
        //         </span>
        //       </div>
        //     </div>
        //   </div>
        // </div>


        //let itemNameElement = document.getElementById("itemName");
        //itemNameElement.innerHTML = productName;
        // let itemPriceElement = document.getElementById("itemPrice");
        // itemPriceElement.innerText = productName;
        // divItem.appendChild(itemNameElement);
        // divItem.appendChild(itemPriceElement);

        let buttonAddToCart = document.createElement("button");
        let spanAddToCart = document.createElement("span");
        let spanAddedToCart = document.createElement("span");
        let iShoppingCart = document.createElement("fas", "fa-shopping-cart");
        let iShoppingBag = document.createElement("fas", "fa-shopping-bag");
        spanAddToCart.innerText = "Add To Cart";
        spanAddedToCart.innerText = "Added To Cart";
        spanAddToCart.classList.add("add-to-cart");
        spanAddedToCart.classList.add("added-to-cart");
        iShoppingCart.classList.add("add-to-cart");
        iShoppingBag.classList.add("add-to-cart");
        buttonAddToCart.appendChild(spanAddToCart);
        buttonAddToCart.appendChild(iShoppingCart);
        buttonAddToCart.appendChild(iShoppingBag);
        buttonAddToCart.appendChild(spanAddedToCart);

        divClassCaption.appendChild(buttonAddToCart);

        let itemNameElement = document.createElement("h6");
        let spanItemPrice = document.createElement("span");
        let delItemPrice = document.createElement("del");

        itemNameElement.innerText = productName;
        spanItemPrice.classList.add("price");
        delItemPrice.innerText = productPrice;

        divClassCaption.appendChild(itemNameElement);

        spanItemPrice.appendChild(delItemPrice);
        divClassCaption.appendChild(spanItemPrice);
        divClassProduct.appendChild(itemImg);
        divClassProduct.appendChild(divClassCaption);
        divClassStyle.appendChild(divClassProduct);
        divItem.appendChild(divClassStyle);
        insertItemsUnder.appendChild(divItem);



        //we'll use these value inside the html
        //needs to addEventListener to each product - done below!
      });

      const buttons = document.querySelectorAll("button");
      const addToCart = document.querySelectorAll(".add-to-cart");
      const addedToCart = document.querySelectorAll(".added-to-cart");
      const cart = document.querySelectorAll(".fa-shopping-cart");
      const bag = document.querySelectorAll(".fa-shopping-bag");

      buttons.addEventListener("click", () => {
        addToCart.classList.add("add-to-cart-animation");
        addedToCart.classList.add("added-to-cart-animation");

        cart.style.animation = "cart 2000ms ease-in-out forwards";
        bag.style.animation = "bag 2000ms 700ms ease-in-out forwards";
      });

      addToCart.addEventListener("click", async () => {
        //add the id of the name of the item
        //let itemName = document.getElementById("itemName");
        //let itemSize = document.getElementById("itemName");

        await fetch(`/addItemToCart`, {
          body: JSON.stringify({ itemName }),
          cache: "no-cache",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => {
            window.alert("item was added to cart!");
            //we can add here 2 buttons - "go to cart" and "continue shopping"
          })
          .catch((error) => {
            console.log("ERR: ", error);
          });
      });
    }
  } catch (error) {
    console.log("err ", error);

    setTimeout(() => {
      window.alert("RES.JSON is failed!!");
    }, 3000);

    letRedirect("/redirectHome");
  }
};

// const addFunctionalityToElements = async () => {

//needs to be in this structure

//   <div class="col-xs-6 col-md-4">
//   <div class="product tumbnail thumbnail-3"><img src="images/shoes1.jpg"></a>
//     <div class="caption">
//       <button>
//         <span class="add-to-cart">Add To Cart</span>
//         <i class="fas fa-shopping-cart"></i>
//         <i class="fas fa-shopping-bag"></i>
//         <span class="added-to-cart">Added To Cart</span>
//       </button>
//       <h6><a href="#">Air Jordan 3 Retro</a></h6><span class="price">
//         <del>$459.99</del></span><span class="price sale">$399.99</span>
//     </div>
//   </div>
// </div>

//     let url = `/backToCart`;

//     await fetch(url, { method: "POST" })
//       .then((response) => {
//         if (response.redirected) {
//           window.location.href = response.url;
//         }
//       })
//       .catch(function (err) {
//         console.info(err + " url: " + url);
//       });
//     }
//     //result were found from search vals

// } catch (error) {
//   console.log("errr ", error);
//   window.alert("Login failed: ");
// }

// add to cart button

//when clicking add-to-cart

//     res = await res.json();
//   }
// });

// try {
//   let res = await fetch(`/getUserItemsAddedToCart`, {
//     body: JSON.stringify({
//       email: email,
//       password: password,
//     }),
//     cache: "no-cache",
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//   });

//   res = await res.json();
