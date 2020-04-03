var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');



var index = express();

// load ideas
var ideas = require('./routes/ideas');
var users = require('./routes/users');

// passport config
require('./config/passport')(passport);

//map global promise - get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
   
})
.then(() => console.log('mongodb connected..'))
.catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');

require('./models/User');
const User = mongoose.model('users');

// handlebars middleware

index.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
index.set('view engine', 'handlebars');

//bodyparser middleware

index.use(bodyParser.urlencoded({ extended:false}))
index.use(bodyParser.json());

// Static folder
index.use(express.static(path.join(__dirname, 'public')));

//method override middleware

index.use(methodOverride('_method'));

// express session middleware

index.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
index.use(passport.initialize());
index.use(passport.session());

index.use(flash());

//global variables
index.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//basic routing

index.get('/', (req,res) => {
    res.render('index');
});
index.get('/about', (req,res) => {
    res.render('about');
});

//Use routes

index.use('/ideas', ideas);
index.use('/users', users);


const port = 5000;
index.listen(port, () =>{
    console.log(`server listen to port number ${port}`);
});
