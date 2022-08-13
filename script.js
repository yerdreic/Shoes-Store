//form mandatory values
function validateForm() {
    let x = document.forms["contact-me"]["name"].value;
    if (x == "") {
      alert("All fields must be filled out");
      return false;
    }
    return true;
  }

const onClickLoginEventHandler = () => {
  const userName = document.getElementById(Uname).value;
  const password = document.getElementById(Pass).value;
  fetch(`/register/${userName}`, {params:{userName:userName, password:password}})
}

  