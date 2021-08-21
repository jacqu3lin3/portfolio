const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.static(path.join(__dirname, 'public')));

const myOAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
myOAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});
const myAccessToken = myOAuth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL, //your gmail account you used to set the project up in google cloud console"
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: myAccessToken //access token variable we defined earlier
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("The server is ready.");
  }
});

app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: process.env.EMAIL, 
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent! We will get back to you shortly.");
      }
    });
  });
});

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});