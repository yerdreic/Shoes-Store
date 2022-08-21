console.log("at addToCart.js");

const sendDataFromSearch = async (searchVal) => {
  console.log("search val:", searchVal);

  try {
    let res = await fetch("/getItemsFromDB", {
      body: JSON.stringify({ searchVal }),
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    res = await res.json();

    //no result was found from search vals
    if (res.noResults) {
      window.alert("Sorry, no results were found for this search");
      // results were found from search vals
    } else {
      let products = Array.from(res.productsFromDB);
      console.log("products from DB:", products);
      //the products should be in json format.
      //we'll create an element from each product
      products.forEach((product) => {
        //imgSrc = product.image;
        productName = product.name;
        productPrice = product.price;
        console.log(productName);
        console.log(productPrice);
        document.write('      <div class="col-xs-6 col-md-4">');
        document.write('        <div class="product tumbnail thumbnail-3"><a href="#"><img src="images/shoes1.jpg"></a>');
        document.write('          <div class="caption">');
        document.write('            <button>');
        document.write('              <span class="add-to-cart">Add To Cart</span>');
        document.write('              <i class="fas fa-shopping-cart"></i>');
        document.write('              <i class="fas fa-shopping-bag"></i>');
        document.write('              <span class="added-to-cart">Added To Cart</span>');
        document.write('            </button>');
        document.write('            <h6><a href="#" id="itemName"></a></h6><span class="price">');
        document.write('              <del id="itemPrice">$459.99</del></span>');
        document.write('          </div>');
        document.write('        </div>');
        document.write('      </div>');
        document.write('');

        let itemNameElement = document.getElementById("itemName");
        itemNameElement.innerHTML = productName;
        let itemPriceElement = document.getElementById("itemPrice");
        itemPriceElement.innerHTML = productName;


        //we'll use these value inside the html
        //needs to addEventListener to each product - done below!
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

//needs to be in this structure

//   <div class="col-xs-6 col-md-4">
//   <div class="product tumbnail thumbnail-3"><a href="#"><img src="images/shoes1.jpg"></a>
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
const button = document.querySelector("button");
const addToCart = document.querySelector(".add-to-cart");
const addedToCart = document.querySelector(".added-to-cart");
const cart = document.querySelector(".fa-shopping-cart");
const bag = document.querySelector(".fa-shopping-bag");

button.addEventListener("click", () => {
  addToCart.classList.add("add-to-cart-animation");
  addedToCart.classList.add("added-to-cart-animation");

  cart.style.animation = "cart 2000ms ease-in-out forwards";
  bag.style.animation = "bag 2000ms 700ms ease-in-out forwards";
});

//when clicking add-to-cart
addToCart.addEventListener("click", async () => {
  try {
    //add the id of the name of the item
    let itemName = document.getElementById("itemName");
    let itemSize = document.getElementById("itemName");

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
  } catch (error) {
    console.log("err ", error);

    setTimeout(() => {
      window.alert("Login failed. Please try again");
    }, 3000);

    letRedirect("/redirectHome");
  }
});

window.addEventListener("load", async () => {
  await sendDataFromSearch();
});


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
