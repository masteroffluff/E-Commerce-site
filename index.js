const express = require('express'),
      app = express(),
      userRouter = require('./server/Users.routes'),
      passport = require('./server/passport'),
      session = require('express-session'),
      cors = require('cors');
      
app.use(express.json());
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.use(
    session({
      secret: "TheMerryGoRoundBrokeDown",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 *60 * 24, secure: process.env.NODE_ENV === 'production', sameSite: "none" }
    })
   );
app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url,req.body);
    next();
  });

app.use(passport.initialize());
app.use(passport.session());

const apiRouter = express.Router();


app.use('/',userRouter)





app.listen(3000,()=>{
    console.log('Express server started at port 3000');
});