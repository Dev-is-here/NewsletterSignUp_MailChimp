const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
})
app.post("/",function(req,res){
  const firstName = req.body.fName;
  const secondName = req.body.lName;
  const email = req.body.email;
  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: secondName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/{LIST_ID}"
  const options = {
    method:"POST",
    auth: "kunalverma:{API_KEY}"
  }
  const request = https.request(url,options,function(response){
    if (response.statusCode==200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
})
app.listen(process.env.PORT || 3000,function(req,res){
  console.log("Server started at 3000");
})



// post request route for failure
app.post("/failure",function(req,res){
  res.redirect("/");
})
