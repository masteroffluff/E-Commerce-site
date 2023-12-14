const express = require('express'),
      server = express(),
      userRouter = require('./server/Users.routes')

server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');

server.set('port', process.env.PORT || 3000);
const apiRouter = express.Router();

server.use('/user/',userRouter)




server.listen(3000,()=>{
    console.log('Express server started at port 3000');
});