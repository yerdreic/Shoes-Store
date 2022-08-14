
//form mandatory values
function validateForm() {
    let x = document.forms["contact-me"]["name"].value;
    if (x == "") {
      alert("All fields must be filled out");
      return false;
    }
    return true;
  }
