const cleanProductsView = () => {
  let insertItemsUnder = document.getElementById("usersTable");
  insertItemsUnder.innerHTML = "";
};

const getUsersFromDB = async (searchVal) => {
  searchVal = searchVal === undefined ? null : searchVal;
  console.log("search val:", searchVal);

  try {
    let res = await fetch("/getUsersFromDB", {
      body: JSON.stringify({ searchVal }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    console.log("res before json():", res);
    res = await res.json();
    console.log("res after json()::", res);

    //no result was found from search vals
    if (res.noResults) {
      throw new Error("Something went wrong.. Please try again");
      // results were found from search vals
    } else {
      let users = res.usersFromDB;

      users.forEach((user) => {
        let userEmail = user.email;
        let userCart = user.cart;
        console.log(userEmail);
        console.log(userCart);
      });
    }
  } catch {
    console.log("err ", error);
    window.alert("RES.JSON is failed!!");

    setTimeout(() => {
      letRedirect("/redirectHome");
    }, 1000);
  }
};

const getLoginLogoutEvents = async (searchVal) => {
  searchVal = searchVal === undefined ? null : searchVal;

  try {
    let res = await fetch("/getEventsFromDB", {
      body: JSON.stringify({ searchVal }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    res = await res.json();

    if (res.noResults) {
      window.alert("no data yet in login/logout events");
    }

    if (res.eventsFromDB !== null) {
      let events = res.eventsFromDB;
      console.log("events from DB:", events);
      //the products should be in json format.
      //we'll create an element from each product
      let usersTable = document.getElementById("usersTable");

      events.forEach((event) => {
        //iterating through the users are at the event (login/logout)
        let tableRow = document.createElement("tr");
        let userEmail = document.createElement("td");
        let userEvent = document.createElement("td");
        let emailFromDB;

        if (event.login) {
          emailFromDB = event.login;
          userEvent.innerText = "login";
        } else if (event.logout) {
          emailFromDB = event.logout;
          userEvent.innerText = "logout";
        }
        userEmail.innerText = emailFromDB;
        tableRow.appendChild(userEmail);
        tableRow.appendChild(userEvent);
        usersTable.appendChild(tableRow);
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

const getProductsFromDB = async () => {
  let searchVal = null;
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
      window.alert("No products were found in db!");
      // results were found from search vals
    } else {
      let products = res.productsFromDB;
      console.log("products from DB:", products);
      //the products should be in json format.
      //we'll create an element from each product
      //ins
      let productsTable = document.getElementById("productsTable");

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
        let tableRow = document.createElement("tr");
        let itemName = document.createElement("td");
        let itemPrice = document.createElement("td");
        let removeItem = document.createElement("td");
        let removeButton = document.createElement("button");
        let itemImage = document.createElement("td");

        itemName.innerText = productName;
        itemPrice.innerText = productPrice;
        itemImage.innerText = productImage;
        removeButton.setAttribute(
          "onclick",
          'onClickRemoveProductEventHandler("' + productName + '")'
        );

        removeItem.appendChild(removeButton);
        tableRow.appendChild(itemName);
        tableRow.appendChild(itemPrice);
        tableRow.appendChild(removeItem);
        tableRow.appendChild(itemImage);

        productsTable.appendChild(tableRow);
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

//need to create a form, from which we will take the data of the new product
const onClickAddNewProductEventHandler = async () => {
  const itemName = document.getElementById("itemName").value;
  const itemPrice = document.getElementById("itemPrice").value;

  const data = new FormData();
  data.append("file", fileupload.files[0]);
  data.append("itemName", itemName);
  data.append("itemPrice", itemPrice);

  try {
    let res = await fetch(`/addNewProductToDB`, {
      body: data,
      cache: "no-cache",
      method: "POST",
    });

    if (!res) {
      throw new Error("No result about this user");
    }

    if (res.status !== 200) {
      throw new Error(res.message);
    }

    res = await res.json();

    if (res.nameAlreadyExist === true) {
      window.alert(
        "This product's name already exist in cart.. Please try a different name"
      );
    } else if (res.newProductWasAdded === true) {
      window.alert(
        "Your new product was added to DB! You can now see it in the catalog!\n Please refresh the page"
      );
      setTimeout(() => {
        letRedirect("/redirectAdmin");
      }, 1000);
    }
  } catch (error) {
    console.log("errr ", error);
    window.alert("Something went wrong.. Please refresh the page");

    setTimeout(() => {
      letRedirect("/redirectAdmin");
    }, 1000);
  }
};

const onClickRemoveProductEventHandler = async (productName) => {
  console.log("product:", productName);
  try {
    let res = await fetch(`/removeProductFromDB`, {
      body: JSON.stringify({
        name: productName,
      }),
      cache: "no-cache",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    res = await res.json();

    if (!res || res.nameExistsInDB === false) {
      throw new Error("No result about this product.Something is wrong");
    }

    if (res.productWasDeleted === true) {
      window.alert("Product was deleted from db");
      setTimeout(() => {
        letRedirect("/admin.html");
      }, 1000);
    }
  } catch (error) {
    console.log("errr ", error);
    window.alert("Something went wrong.. Please try again");

    setTimeout(() => {
      letRedirect("/admin.html");
    }, 1000);
  }
};
