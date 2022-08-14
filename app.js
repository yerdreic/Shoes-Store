// add to cart button
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

const onClickLoginEventHandler = () => {
    const userName = document.getElementById(Uname).value;
    const password = document.getElementById(Pass).value;
    fetch(`/register/${userName}`, {params:{userName:userName, password:password}})
  }
  
  const onLoadEventHandler = () => {
    const nav = document.getElementById(nav);
      // if user is authenticated:
  
    fetch('/isloggedin').then((response) => {
      if (response == true) {   //if user is logged in
        const cart = document.createElement('li');
        cart.setAttribute('href',"./cart.html")
        const cartText = document.createTextNode("Cart");
        cart.appendChild(cartText);
  
        const logout = document.createElement('li');
        const logoutText = document.createTextNode("Logout");
        logout.appendChild(logoutText);
  
        nav.appendChild(cart); 
        nav.appendChild(logout);
  
        logout.addEventListener(onclick, () => {
          redirect('/logout');
        })
  
      } else {   //if user isn't logged in
        const login = document.createElement('li');
        login.setAttribute('href',"./login.html")
        const loginText = document.createTextNode("Log In");
        login.appendChild(loginText);
        nav.appendChild(login); 
      }
    })
  }
  
  //before loading eny page, we want to set the navbar correctly according to if user is logged in
  onLoadEventHandler();