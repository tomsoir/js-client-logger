// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// mongo start
// 93ab25fa9859e8697d06a5e269d25da0143267c7

var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var config      = require('./config.json');
var User        = require('./app/models/user'); 
var midStatic   = require('./middleware/static');
var midRouter   = require('./middleware/router');
var midAuth     = require('./middleware/auth');
var app         = express();

// ===================
// CONFIGURE MONGO DB
// ===================
var dblink = config.db.local;       // mongo start
var mongoose = require('mongoose');
mongoose.connect(dblink);           // localhost:27017
var db = mongoose.connection;       // mongo connecton test
db.on('error', console.error.bind(console, 'DB connection fail: '+dblink+' (try for local: $ mongo start)'));
db.once('open', function() {console.log('DB connected: '+dblink)});

// =====================
// CONFIGURE APP SERVER
// =====================
app.use(morgan('dev'));                             // log requests to the console
app.use(bodyParser.json());                         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(midStatic.parser);
app.use(express.static(config.staticDir));
app.set('views', path.join(__dirname, 'views'));    // view engine setup
app.set('view engine', 'jade');

// =================
// CONFIGURE ROUTER
// =================
var clientRouter = express.Router();
apiRouter.use(midAuth.checking);           // Routes auth protection
midRouter.populate.client(clientRouter);
app.use('/', clientRouter);

var apiRouter = express.Router();
apiRouter.use(midAuth.checking);           // Routes auth protection
midRouter.populate.api(apiRouter);
app.use('/api', apiRouter);

var authRouter = express.Router();
midRouter.populate.auth(authRouter);
app.use('/auth', authRouter);


// =================
// START THE SERVER
// =================
var post = process.env.PORT || 8080;
app.listen(post); console.log('Server: http://127.0.0.1:'+post+'/');

