const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("./db.js");


// Set up the Passport strategy:
passport.use(new LocalStrategy(
  function (username, password, done) {
    // Look up user in the db
    helper.findByUsername(username, async (err, user) => {
      // If there's an error in db lookup,
      // return err callback function
      if(err) return done(err);
       // If user not found,
      // return null and false in callback
      if(!user) return done(null, false);
       // If user found, but password not valid,
      // return err and false in callback
      const matchFound = await bcrypt.compare(password, user.password);
      if(matchFound) return done(null, false);
       // If user found and password valid,
      // return the user object in callback
      return done(null, user)
    });
  })
);


// Serialize a user
passport.serializeUser((user, done) => {
  done(null, user.id);
});


// Deserialize a user
passport.deserializeUser((id, done) => {
  // Look up user id in database.
  helper.findById(id, function (err, user) {
    if (err) return done(err);
    done(null, user);
  });
});
