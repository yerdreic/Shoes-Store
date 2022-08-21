console.log("at app.js");
window.addEventListener("load", () => {
  const nav = document.getElementById("navElem");
  // if user is authenticated:
  fetch("/isloggedin").then((res) => {
    console.log("at isloggedin");
    if (res.status === 200) {
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
  });
});

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
      window.alert("yay");

      let url = `/successLogin`;

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

    if (res.emailExists && !res.passwordExists) {
      // only email was found
      let wrongUrl = `/notSuccessLogin`;
      window.alert("Wrong password. Please try again.");

      await fetch(wrongUrl, { method: "POST" })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          }
        })
        .catch(function (err) {
          console.info(err + " url: " + wrongUrl);
        });
    }
  } catch (error) {
    console.log("errr ", error);
    window.alert("Login failed: ");
  }
};

const onClickRegisterEventHandler = async () => {
  const email = document.getElementById("Uname").value;
  const password = document.getElementById("Pass").value;
  let newUserWasAdded = false;

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
      window.alert(
        'Sorry, that email is taken. Maybe you need to <a href="/login.html">login</a>?'
      );
    }

    if (res.newUserWasAdded === true) {
      setTimeout(() => {
        window.alert("New user was created. Please login");
      }, 1000);

      let url = `/successLogin`;

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
  } catch (error) {
    console.log("errr ", error);
    window.alert("Login failed: ");
  }
};
