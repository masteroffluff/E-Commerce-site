const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const UserService = require("./service/UserService.js");


// Set up the Passport strategy:
passport.use(new LocalStrategy(
  function (username, password, done) {
    // Look up user in the db
    console.log('logging in user ' + username)
    UserService.findByUsername(username, async (err, user) => {
      // If there's an error in db lookup,
      // return err callback function
      if(err) return done(err);
       // If user not found,
      // return null and false in callback
      console.log ("no errors checking user exists")
      if(!user) return done(null, false);
       // If user found, but password not valid,
      // return err and false in callback
      console.log ("user exists checking password")
      const matchFound = await bcrypt.compare(password, user.password);
      if(!matchFound) return done(null, false);
       // If user found and password valid,
      // return the user object in callback
      console.log ("authentication successful")
      return done(null, user)
    });
  })
);

passport.use('reauthenticate', new LocalStrategy(
  function (username, password, done) {
    // Look up user in the db
    UserService.findByUsername(username, async (err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false, { message: 'User not found' });

      // Check if the provided password matches the stored hash
      const matchFound = await bcrypt.compare(password, user.password);
      if (!matchFound) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    });
  }
));


// Serialize a user
passport.serializeUser((user, done) => {
  done(null, user.id);
});


// Deserialize a user
passport.deserializeUser((id, done) => {
  // Look up user id in database.
  UserService.findById(id, function (err, user) {
    if (err) return done(err);
    done(null, user);
  });
});

module .exports=passport