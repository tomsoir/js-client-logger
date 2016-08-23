// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// mongo start

var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var config     = require('./config.json');
var midStatic  = require('./middleware/static');
var midRouter  = require('./middleware/router');
var path        = require('path');
var app        = express();


// CONFIGURE MONGO DB
// =============================================================================
// mongo start
var dblink = config.db.local;
var mongoose = require('mongoose');
mongoose.connect(dblink);           // localhost:27017
var db = mongoose.connection;       // mongo connecton test
db.on('error', console.error.bind(console, 'DB connection fail: '+dblink+' (try for local: $ mongo start)'));
db.once('open', function() {console.log('DB connected: '+dblink)});


// CONFIGURE APP SERVER
// =============================================================================
// log requests to the console
app.use(morgan('dev')); 
app.use(bodyParser.json());                         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(midStatic.parser);
app.use(express.static(config.staticDir));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// START THE SERVER
// =============================================================================
var post = process.env.PORT || 8080;
var router = express.Router();      // create our router
midRouter.populate.api(router);     // populate our router
midRouter.populate.client(router);  // populate our router
app.use('/api', router);            // register our routes
app.use('/', router);

app.listen(post);
console.log('Server: http://127.0.0.1:'+post+'/');