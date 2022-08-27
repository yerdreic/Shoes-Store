console.log("at app.js");

const letRedirect = async (url) => {
  await fetch(url, { method: "POST" })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch((error) => {
      console.log("ERR: Something is wrong. Please refresh the page");
    });
};

//window.addEventListener("load", async () => {
const setNavBar = async () => {
  const nav = document.getElementById("navElem");
  // if user is authenticated:
  try {
    let res = await fetch("/isloggedin");
    console.log("at isloggedin", res);

    let jsonRes = await res.json();



    // let userName = email.substr(0, email.indexOf('@')); 

    if (res.status === 200 && jsonRes.isLoggedIn === true) {
      // logged in
      let email = jsonRes.userCookie.email;
      let userName = email.substring(0, email.indexOf("@"));
      console.log("from app.js:", userName);

      const cartLine = document.createElement("li");
      cartLine.innerHTML = '<a href="./cart.html">Cart</a>';
      nav.appendChild(cartLine);

      const logoutLine = document.createElement("li");
      logoutLine.innerHTML = '<a href="/logout">Logout</a>';
      const nameElement = document.createElement("li");
      nameElement.innerText = `Hello, ${userName}`;

      nav.appendChild(logoutLine);
      nav.appendChild(nameElement);

    } else {
      // not logged in
      const loginLine = document.createElement("li");
      loginLine.innerHTML = '<a href="./login.html">Log In</a>';
      nav.appendChild(loginLine);
    }
  } catch (error) {
    console.log("ERR: ", error);
    window.alert("Something went wrong.. Sorry");

    setTimeout(() => {
      letRedirect("/notSuccessLogin");
    }, 3000);
  }
};

const onClickLoginEventHandler = async () => {
  const email = document.getElementById("Uname").value;
  const password = document.getElementById("Pass").value;
  const rememberMe = document.getElementById("register").value;

  try {
    let res = await fetch(`/login`, {
      body: JSON.stringify({
        email: email,
        password: password,
        rememberMe: rememberMe,
      }),
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res) {
      throw new Error("No result about this user");
    }

    if (res.status !== 200) {
      throw new Error(res.message);
    }

    res = await res.json();

    if (res.emailExists && res.passwordExists) {
      // res is ok == what to do from here !?
      letRedirect(`/successLogin`);
    }

    if (res.emailExists && !res.passwordExists) {
      // only email was found
      window.alert("Wrong password. Please try again.");

      setTimeout(() => {
        letRedirect("/notSuccessLogin");
      }, 3000);
    }

  } catch (error) {
    console.log("errr ", error);
    window.alert("Login failed. Please try again");

    setTimeout(() => {
      letRedirect("/notSuccessLogin");
    }, 3000);
  }
};

const onClickRegisterEventHandler = async () => {
  const email = document.getElementById("Uname").value;
  const password = document.getElementById("Pass").value;

  try {
    let res = await fetch(`/register`, {
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    res = await res.json();

    if (res.emailExists) {
      window.alert("Sorry, that email is taken. Maybe you need to login");

      setTimeout(() => {
        letRedirect(`/notSuccessLogin`);
      }, 3000);
    }

    if (res.newUserWasAdded === true) {
      window.alert("New user was created. Please login");

      setTimeout(() => {
        letRedirect(`/successLogin`);
      }, 3000);
    }
  } catch (error) {
    console.log("ERR ", error);
    window.alert("Register failed. Please try again");

    setTimeout(() => {
      letRedirect("/redirectHome");
    }, 3000);
  }
};
