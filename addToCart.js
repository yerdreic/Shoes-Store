console.log("at addToCart.js");
window.addEventListener("load", () => {
  sendDataFromSearch("")
})

const sendDataFromSearch = async(searchVal) => {
  console.log(searchVal);

  try {
    let res = await fetch('/getItems', {
    body: JSON.stringify({ searchVal: searchVal }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    });

    res = await res.json();

    //no result was found from search vals
    if (res.noResults) {
      window.alert(
        'Sorry, no results were found for this search'
      );
    // results were found from search vals
    } else {
      let products = Array.from(res.productFromDB);
      console.log(products);
      //the products should be in json format.
      //we'll create an element from each product
      products.forEach(product => {
        imgSrc = product.image;
        productName = product.name;
        productPrice = product.pricel

        //we'll use these value inside the html 
        //needs to addEventListener to each product - done below!
        let insertItemsUnder = document.getElementById("insertItemsUnder");
        const div1 = document.createElement("div");
        div1.className = "col-xs-6 col-md-4";
        
        const div2 = document.createElement("div");
        div2.className = "product tumbnail thumbnail-3";
        const href2 = document.createElement("a");
        insertBefore(href2, div2);


        div2.appendChild(href2);

        insertItemsUnder.appendChild()
        //add photo from db
        href2.innerHTML = '<img src="----needs to be taken from db">'


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
  
        
      });
    }

      let url = `/backToCart`;

      await fetch(url, { method: "POST" })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          }
        })
        .catch(function (err) {
          console.info(err + " url: " + url);
        });
      }
      //result were found from search vals
 


  } catch (error) {
    console.log("errr ", error);
    window.alert("Login failed: ");
  }




} 


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


  try {
    //add the id of the name of the item
    let itemName = document.getElementById("itemName")

    let res = await fetch(`/addItemToCart`, {
      body: JSON.stringify({ itemName: itemName }),
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then(res => {
      window.alert("item was added to cart!");
    }).catch (error => {
      console.log("ERR: ", error);
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
}
)


