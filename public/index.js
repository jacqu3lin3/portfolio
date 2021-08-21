const form = document.getElementById("contactform"); 
const formEvent = form.addEventListener("submit", (event) => {
  event.preventDefault();
  let mail = new FormData(form);
  sendMail(mail);
})

const sendMail = (mail) => {
    fetch(`${SERVER_URL}/send`, {
      method: "post", 
      body: mail,
  
    }).then((response) => {
      return response.json();
    });
  };
  