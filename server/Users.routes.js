const express = require("express");
const router = express.Router();
const db = require("./db.js");
const passport = require("./passport");
var bodyParser = require('body-parser');

const bcrypt = require("bcrypt");

var jsonParser = bodyParser.json();

//////
router.get("/test", async (req,res)=>{
  try{
  const user = await db.userExists("wabbithunter@hotmail.com");
  if (!user) {
    console.log("User doesn't exist");
    
  }
  
  return res.status(200).send(user)
  
} catch (err) {
  res.status(500).json({ message: err.message });
}
});
router.get("/test1", async (req,res)=>{
  try{
  const user = await db.userExists("wabbithunter@hotmail.com");
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


// get user details
router.get("/user",async (req, res) =>{
  if (req.isAuthenticated()) {
    // Access the customer_id from the user object in the session
    const customerId = req.user.id;
    // use the findbyid function to return the user details.
    db.findById(customerId, function (err, user) {
      if (err){ res.status(500).send(err)};
      res.status(200).send(JSON.stringify(user))
    });

  } else {
    // Redirect to the login page or handle unauthenticated user
    console.log("customer detils request failed not authenticated")
    res.status(401).send ("customer detils request failed: not authenticated")
  }
});

router.post('/reauthenticate', passport.authenticate('reauthenticate', { failureRedirect: '/reauthenticate' }), (req, res) => {
  res.redirect('/update'); // Redirect to a protected area upon successful reauthentication
});



// update user details
router.put("/update",passport.authenticate('reauthenticate', { failureRedirect: '/reauthenticate' }), async (req, res) => {
  console.log(req.body)
  const { email, new_password,  first_name,last_name,street1,street2,postcode,city,country_code } = req.body;
  const newDetails= { email,first_name,last_name,street1,street2,postcode,city,country_code }
 
 //const id = { id: helper.getNewId(users) };


 let step =1;
 try {
  if (req.isAuthenticated()) {
    step=2;
    // Access the customer_id from the user object in the session
    const customerId = req.user.id;
    if (new_password){
      step=2.5
      const salt = await bcrypt.genSalt(10);
      console.log(new_password);
      console.log(salt);
      const hashedPassword = await bcrypt.hash(new_password,salt);
      newDetails = {hashedPassword, ...newDetails};
    }
    
    step=3;
 
    // Store new user in local DB
    await db.updateUser(customerId,newDetails);
    step=4;
    res.status(201)
    res.redirect("/");

  } else {
    // Redirect to the login page or handle unauthenticated user
    console.log("customer detils request failed not authenticated")
    res.status(401).send ("customer detils request failed: not authenticated")
  }

 } catch (err) {
  console.log("error in update")
   res.status(500).json({ message: err.message, step });
 }
});
//////

// Log In User:
/* router.post("/login",
  passport.authenticate("local", { failureRedirect : "/login"}),
  (req, res) => {
    res.send("logged in")
  //res.redirect("/"); // Change this to reflect the correct route to return to after login
}
); */


router.post("/login", (req, res, next) => {
  console.log (req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error('Passport authentication error:', err);
      return next(err);
    }

    if (!user) {
      // Log additional information about the authentication failure
      console.log('Authentication failure:', info);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during req.logIn:', err);
        return next(err);
      }
      return res.send("logged in");
    });
  })(req, res, next);
});


// Log out user:
router.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    console.log ("logged out")
    res.redirect('/login');// change to correct route for logged out user. 
  }); 
});


router.get("/register", (req, res) => {
 res.render("register");
});

router.get("/reauthenticate", (req, res) => {
  res.render("reauthenticate");
 });

router.get("/login", (req, res) => {
  console.log("login screen")
  res.render("login");
  /* res.status(501).send("at login page") */
});


module.exports = router;
