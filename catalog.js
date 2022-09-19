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
        if (
          productImage &&
          typeof productImage === "string" &&
          productImage.startsWith("data:image")
        ) {
          itemImg.src = productImage;
        } else {
          itemImg.src = "images/" + productImage;
        }
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
        delItemPrice.innerText = productPrice + "$";

        divClassCaption.appendChild(itemNameElement);
        divClassCaption.appendChild(delItemPrice);

        divClassCaption.appendChild(spanItemPrice);
        divClassProduct.appendChild(itemImg);
        divClassProduct.appendChild(divClassCaption);
        divClassStyle.appendChild(divClassProduct);
        divItem.appendChild(divClassStyle);
        insertItemsUnder.appendChild(divItem);
      });
    }
  } catch (error) {
    console.log("err ", error);
    window.alert("RES.JSON is failed!!");

    setTimeout(() => {
      letRedirect("/redirectHome");
    }, 1000);
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

    if (loggedIn.isLoggedIn === false) {
      window.alert("You must login in order to add this item to cart!");

      setTimeout(() => {
        letRedirect("/login.html");
      }, 1000);
    }
  } catch {
    (error) => {
      console.log("ERR: ", error);
      window.alert("ERR:", error);

      setTimeout(() => {
        letRedirect("/login.html");
      }, 1000);
    };
  }
};

//Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

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
