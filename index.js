const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require("./dbConfig");
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig');
const app = express();
initializePassport(passport);
const PORT = process.env.PORT || 4000
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.use(
    session({
        secret:'secret',
        resave:false,
        saveUninitialized:false
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.get('/', (req,res) => {
    res.render('index');
});
app.get('/users/register', checkAuthenticated, (req,res) => {
    res.render('register');
});
app.get('/users/login',checkAuthenticated, (req,res) => {
    res.render('login');
});
app.get('/users/dashboard',checkNotAuthenticated, (req,res) => {
    let nam = (req.user.name).charAt(0).toUpperCase() + (req.user.name).slice(1)
    res.render('dashboard',{user: nam});
});
app.get('/users/logout', (req,res) => {
    req.logOut();
    req.flash('success_msg', 'You logged out');
    res.redirect('/users/login');
});
app.post('/users/register', async (req,res) => {
    let { name, email, password, password2 } = req.body;
    console.log({name, email, password, password2 });

    let errors =[];
    if(!name || !email || !password || !password2){
         errors.push({message: "Please enter all fields"});
    }
    if(password.length<6){
        errors.push({message: "Password must be at least 6 characters long"});
   }
   if(password != password2 ){
    errors.push({message: "Passwords do not match"});
   }
   if(errors.length >0 ){
    res.render("register",{errors});
   }else{
       let hashedPassword = await bcrypt.hash(password, 10);

       pool.query(
           `SELECT * FROM users
           WHERE email = $1`,
           [email],
           (err, results) => {
               if(err){
                   throw err;
               }
               console.log(results.rows);
               if(results.rows.length >0){
                errors.push({message: `Email: ${email} is already registered`});
                res.render("register",{errors});
              }else{
                  pool.query(
                      `INSERT INTO users (name, email, password)
                      VALUES ($1, $2, $3)
                      RETURNING id, password`,
                      [name, email, hashedPassword], 
                      (err, results) => {
                          if(err){
                              throw err;
                          }
                          console.log(results.row);
                          req.flash('success_msg','You are now registered. Please log in');
                          res.redirect('/users/login');
                      }
                  )
              }
           }
       )
   }
});
app.post("/users/login", passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true
    })
);
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect("/users/dashboard");
    }
    next();
    
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}
app.listen(PORT, console.log(`Server running on port ${PORT}`));