const express = require("express");
const router = express.Router();
const db = require("./db.js");
const passport = require("passport");
var bodyParser = require('body-parser');

const bcrypt = require("bcrypt");

var jsonParser = bodyParser.json();
//////
router.get("/test", async (req,res)=>{
  try{
  const user = await db.userExists("masteroffluff@gmail.com");
  if (!user) {
    console.log("User doesn't exist");
    
  }
  
  return res.status(200).send(user)
  
} catch (err) {
  res.status(500).json({ message: err.message });
}
});


// Register New User:
router.post("/register",jsonParser, async (req, res) => {
  console.log(req.body)
 const { email, password, first_name,last_name,street1,street2,postcode,city,country_code } = req.body;
 const address = [first_name,last_name,street1,street2,postcode,city,country_code]
 //const id = { id: helper.getNewId(users) };
 let step =1
 try {
  
   const user = await db.userExists(email);
   
   if (user) {
     console.log("User already exists!");
     return res.redirect("login");
   }
   
   // Hash password before storing in local DB:
   const salt = await bcrypt.genSalt(10);
   step = 2;
   console.log(password);
   console.log(salt);
   const hashedPassword = await bcrypt.hash(password,salt)
   step=3;
   const newUser = [email, hashedPassword, ...address];
   step=4;

   // Store new user in local DB
   await db.insertUser(newUser);
   step=5;
   res.status(201)
   res.redirect("login");
 } catch (err) {
   res.status(500).json({ message: err.message, step });
 }
});
//////
// Test connection
router.get("/test", async (req,res)=>{
  try{
  const user = await db.userExists("masteroffluff@gmail.com");
  res.status(200).send(user)
  
} catch (err) {
  res.status(500).json({ message: err.message });
}
});

// Log In User:
router.post("/login",
passport.authenticate("local", { failureRedirect : "/login"}),
 (req, res) => {
  res.redirect("/"); // Change this to reflect the correct route to return to after login
}


);

// Log out user:
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login"); // change to correct route for logged out user. 
});


router.get("/register", (req, res) => {
 res.render("register");
});


router.get("/login", (req, res) => {
  console.log()
  res.render("login");
});


module.exports = router;
