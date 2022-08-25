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

    if (res.status === 200 && jsonRes.isLoggedIn === true) {
      // logged in
      const cartLine = document.createElement("li");
      cartLine.innerHTML = '<a href="./cart.html">Cart</a>';
      nav.appendChild(cartLine);

      const logoutLine = document.createElement("li");
      logoutLine.innerHTML = '<a href="/logout">Logout</a>';

      nav.appendChild(logoutLine);
    } else {
      // not logged in
      const loginLine = document.createElement("li");
      loginLine.innerHTML = '<a href="./login.html">Log In</a>';
      nav.appendChild(loginLine);
    }
  } catch (error) {
    console.log("errr ", error);

    setTimeout(() => {
      window.alert("Something went wrong.. Sorry");
    }, 3000);

    letRedirect("/notSuccessLogin");

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
      letRedirect(`/notSuccessLogin`);
    }
  } catch (error) {
    console.log("errr ", error);

    setTimeout(() => {
      window.alert("Login failed. Please try again");
    }, 3000);

    letRedirect("/notSuccessLogin");
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
      setTimeout(() => {
        window.alert("Sorry, that email is taken. Maybe you need to login");
      }, 3000);
  
      letRedirect(`/notSuccessLogin`);
    }

    if (res.newUserWasAdded === true) {
      setTimeout(() => {
        window.alert("New user was created. Please login");
      }, 3000);

      letRedirect(`/successLogin`);
    }
  } catch (error) {
    console.log("ERR ", error);

    setTimeout(() => {
      window.alert("Register failed. Please try again");
    }, 3000);

    letRedirect("/redirectHome");
  }
};
