console.log('at app.js');
window.addEventListener('load', () => {
  const nav = document.getElementById("navElem");
    // if user is authenticated:
  //router.get("/isloggedin", (req,res,next) => {
  fetch('/isloggedin').then((res) => {
    if (res != null) {   //if user is logged in
      const cartLine = document.createElement('li');
      cartLine.innerHTML = '<a href="./cart.html">Cart</a>';
      nav.appendChild(cartLine); 

      const logoutLine = document.createElement('li');
      logoutLine.innerHTML = '<a href="/logout">Logout</a>';

      nav.appendChild(logoutLine);

      logoutLine.addEventListener(onclick, () => {
        redirect('/logout');
      })

    } else {   //if user isn't logged in
      const loginLine = document.createElement('li');
      loginLine.innerHTML = '<a href="./login.html">Log In</a>';
      nav.appendChild(loginLine); 
    }
  }
)
  })

const onClickLoginEventHandler = () => {
  const email = document.getElementById(Uname).value;
  const password = document.getElementById(Pass).value;
  fetch(`/login`, {params:{email:email, password:password}})
}
const onClickRegisterEventHandler = () => {
  const email = document.getElementById(Uname).value;
  const password = document.getElementById(Pass).value;
  fetch(`/register`, {params:{email:email, password:password}})
}

const button = document.querySelector('button');
const addToCart = document.querySelector('.add-to-cart');
const addedToCart = document.querySelector('.added-to-cart');
const cart = document.querySelector('.fa-shopping-cart');
const bag = document.querySelector('.fa-shopping-bag');

button.addEventListener('click', () => {
    addToCart.classList.add('add-to-cart-animation')
    addedToCart.classList.add('added-to-cart-animation')

    cart.style.animation = 'cart 2000ms ease-in-out forwards'
    bag.style.animation = 'bag 2000ms 700ms ease-in-out forwards'
})

