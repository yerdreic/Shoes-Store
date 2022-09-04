console.log("at addToCart.js");

const cleanProductsView = () => {
  let insertItemsUnder = document.getElementById("insertItemsUnder");
  insertItemsUnder.innerHTML = "";
};

const sendDataFromSearch = async (searchVal) => {
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
        let productName = product.name;
        let productPrice = product.price;
        let productImage = product.image;
        let productId = product._id;
        console.log(productName);
        console.log(productPrice);
        console.log(productId);

        let divItem = document.createElement("div");
        let divClassStyle = document.createElement("div");
        let divClassProduct = document.createElement("div");
        let itemImg = document.createElement("img");
        let divClassCaption = document.createElement("div");

        divClassStyle.classList.add("col-xs-6", "col-md-4");
        divClassProduct.classList.add("product", "tumbnail", "thumbnail-3");
        //chnage the src of the image to the name from the db
        itemImg.src = "images/"+productImage;
        divClassCaption.classList.add("caption");

        let buttonAddToCart = document.createElement("button");
        let spanAddToCart = document.createElement("span");
        let spanAddedToCart = document.createElement("span");
        let iShoppingCart = document.createElement("i");
        let iShoppingBag = document.createElement("i");
        iShoppingCart.classList.add("fas", "fa-shopping-cart");
        iShoppingBag.classList.add("fas", "fa-shopping-bag");
        buttonAddToCart.id = productId;
        buttonAddToCart.setAttribute(
          "onclick",
          'addedItemToCartEventHandler("' + productId + '")'
        );
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

        let itemNameElement = document.createElement("h3");
        itemNameElement.id = "itemName";
        let spanItemPrice = document.createElement("span");
        let delItemPrice = document.createElement("h3");
        delItemPrice.id = "itemPrice";

        itemNameElement.innerText = productName;
        spanItemPrice.classList.add("price");
        delItemPrice.innerText = productPrice+"$";

        divClassCaption.appendChild(itemNameElement);
        divClassCaption.appendChild(delItemPrice);

        // spanItemPrice.appendChild(delItemPrice);
        divClassCaption.appendChild(spanItemPrice);
        divClassProduct.appendChild(itemImg);
        divClassProduct.appendChild(divClassCaption);
        divClassStyle.appendChild(divClassProduct);
        divItem.appendChild(divClassStyle);
        insertItemsUnder.appendChild(divItem);

        //we'll use these value inside the html
        //needs to addEventListener to each product - done below!
        //   const buttons = document.querySelectorAll("button");
        // const addToCartButotns = document.querySelectorAll(".add-to-cart");
        //   const addedToCart = document.querySelectorAll(".added-to-cart");
        //   const cart = document.querySelectorAll(".fa-shopping-cart");
        //   const bag = document.querySelectorAll(".fa-shopping-bag");

        //   buttons.forEach(button => {

        //   button.addEventListener("click", () => {
        //     addToCart.forEach(button => {

        //     })
        //     addToCart.classList.add("add-to-cart-animation");
        //     addedToCart.classList.add("added-to-cart-animation");

        //     cart.style.animation = "cart 2000ms ease-in-out forwards";
        //     bag.style.animation = "bag 2000ms 700ms ease-in-out forwards";
        //   });
        // })

        // document.querySelectorAll(".add-to-cart").foreach((addToCart) => {
        //   addToCart.addEventListener("click", async () => {
        //     //add the id of the name of the item
        //     let itemName = document.getElementById("itemName");
        //     //let itemPrice = document.getElementById("itemPrice");

        //       });
        //     });
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

const addedItemToCartEventHandler = async (productId) => {
  try {
    let loggedIn = await fetch("/isloggedin");

    loggedIn = await loggedIn.json();

    console.log(loggedIn);
    console.log("product ID from catalog.js:", productId);
    console.log("user ID from catalog.js:", loggedIn.userCookie);

    if (loggedIn.isLoggedIn === true) {
      let res = await fetch(`/addItemToCart`, {
        body: JSON.stringify({ productId, user: loggedIn.userCookie }),
        cache: "no-cache",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res) {
        window.alert("item was added to cart!");
      }
    }
  } catch {
    (error) => {
      console.log("ERR: ", error);
      window.alert(
        "You must login in order to add this item to cart! Let's go get you logged in!"
      );

      setTimeout(() => {
        letRedirect("/login");
      }, 3000);
    };
  }
};

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

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