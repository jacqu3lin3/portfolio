require("dotenv").config();

const form = document.getElementById("contactform"); 
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let mail = new FormData(form);
  sendMail(mail);
})

const sendMail = (mail) => {
    fetch(`${process.env.SERVER_URL}/send`, {
      method: "post", 
      body: mail,
  
    }).then((response) => {
      return response.json();
    });
  };
  