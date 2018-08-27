const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const hbs = require("hbs")
const session = require("express-session")
const app = express();
const router = express.Router()
const http = require('http');

// database connection
//var mongoose = require('mongoose');
mongoose.connect("mongodb://memeadmin:memepassword1@ds215502.mlab.com:15502/memedata", {
    useNewUrlParser : true
})

mongoose.Promise = global.Promise


// some environment variables
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set("view-engine", "hbs");

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + "/public"))


app.use(session({
    secret: "SuperSecretQuatro",
    name: "MissCourtneyIsTheBest",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000*60*60*24*7*3
    }
}))


//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here'));
//app.use(express.session());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));



// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
