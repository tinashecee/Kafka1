const express = require('express');
//const exphbs = require('express-handlebars');
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require("./dbConfig");
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const redis = require('redis');
const initializePassport = require('./passportConfig');
const sendToKafka = require('./producer');
_ = require('lodash');
const app = express();
let authed = false;
let nam = '';
let usrId = '' ;
initializePassport(passport);
//create Redis client
let client = redis.createClient();
let pos1 = 1;
const PORT = process.env.PORT || 4000
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');

//setup public folder
app.use(express.static('./public'));

app.use(bodyParser.urlencoded({extended:false}));

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

app.get('', (req, res) => {
    
    res.render('index',{authed:authed, user:nam})
});
app.get('/users/queue1', checkNotAuthenticated, async (req,res) => {
    let pos=1;
    let id = req.user.id;
    client.hgetall(id, async (err, obj)=>{
            
            obj.id = id;
            
            function reassembleSort() {
    
                
                //get all the arguments
                var	sortArguments = Array.prototype.slice.call(arguments);
                //get the callback, convert the single element array into a string
                var originalCb = Array.prototype.slice.call(arguments).slice(-1)[0];
                var	fields = [];
            
            //remove the last argument, eg the callback
            sortArguments.splice(-1,1);
        
            //go through each argument
            sortArguments.forEach(function(anArgument,argumentIndex) {
                //if the argument is some form of 'get'
                if (anArgument.toLowerCase() === 'get') {
                    //special pattern for getting the key
                    if (sortArguments[argumentIndex+1] === '#') {
                        //push it into the fields array
                        fields.push('#');
                    } else {
                        //otherwise split the pattern by '->', retrieving the latter part
                        //and push it into the fields object
                        fields.push(sortArguments[argumentIndex+1].split('->')[1]);
                    }
                }
            });
            //run the normal sort
            client.sort.apply(
                client, //the `this` argument of the sort should be the client
                [
                    sortArguments, //just the sort arguments without the callback
                    function(err, values){
                        if (err) { originalCb(err); } else {
                            //we'll use lodash
                            values = _(values)
                                //chunk splits up the returned values by the number of fields
                                //and returns it into a nested array of these chunks
                                .chunk(fields.length)
                                .map(function(aValueChunk) {
                                    //we will zip the fields and the chunks
                                    return _.zipObject(fields, aValueChunk);
                                })
                                .value();
                            //call the original callback passing in the new values	
                            originalCb(err,values);
                        }
                        
                    }
                ]
            );
        
        
        reassembleSort(
            'queuemembers',
            'ALPHA',
            'BY',
            '*->name',
            'GET',
            '*->name',
            'GET',
            '*->timestamp',
             function(err,values) {
                if (err) throw err;
                let arr = []
                
               
               //arr=JSON.stringify(values,null,' ');
               arr = values;
               
                arr.forEach(a=>{
                
                if(a.timestamp<obj.timestamp){
                  pos=pos+1;
                }
              
        
               }
                   
               );
               
               pos1=pos
               
               res.render('queue', {
                   pos: pos,authed:authed, user:nam
               });
                
            }
        );
            
        
        }
    })
   
});
app.get('/users/queue', checkNotAuthenticated, async (req,res) => {
    let pos=1;
    let id = req.user.id;
    client.hgetall(id, async (err, obj)=>{
        if(!obj){
           
            res.render('joinq',{layout:'./layouts/registration',authed:authed, user:nam});
        } else {
            obj.id = id;
            
            function reassembleSort() {
    
                
                //get all the arguments
                var	sortArguments = Array.prototype.slice.call(arguments);
                //get the callback, convert the single element array into a string
                var originalCb = Array.prototype.slice.call(arguments).slice(-1)[0];
                var	fields = [];
            
            //remove the last argument, eg the callback
            sortArguments.splice(-1,1);
        
            //go through each argument
            sortArguments.forEach(function(anArgument,argumentIndex) {
                //if the argument is some form of 'get'
                if (anArgument.toLowerCase() === 'get') {
                    //special pattern for getting the key
                    if (sortArguments[argumentIndex+1] === '#') {
                        //push it into the fields array
                        fields.push('#');
                    } else {
                        //otherwise split the pattern by '->', retrieving the latter part
                        //and push it into the fields object
                        fields.push(sortArguments[argumentIndex+1].split('->')[1]);
                    }
                }
            });
            //run the normal sort
            client.sort.apply(
                client, //the `this` argument of the sort should be the client
                [
                    sortArguments, //just the sort arguments without the callback
                    function(err, values){
                        if (err) { originalCb(err); } else {
                            //we'll use lodash
                            values = _(values)
                                //chunk splits up the returned values by the number of fields
                                //and returns it into a nested array of these chunks
                                .chunk(fields.length)
                                .map(function(aValueChunk) {
                                    //we will zip the fields and the chunks
                                    return _.zipObject(fields, aValueChunk);
                                })
                                .value();
                            //call the original callback passing in the new values	
                            originalCb(err,values);
                        }
                        
                    }
                ]
            );
        }
        
        reassembleSort(
            'queuemembers',
            'ALPHA',
            'BY',
            '*->timestamp',
            'GET',
            '*->name',
            'GET',
            '*->timestamp',
             function(err,values) {
                if (err) throw err;
                let arr = []
                
               
               //arr=JSON.stringify(values,null,' ');
               arr = values;
               
                arr.forEach(a=>{
                
                if(a.timestamp<obj.timestamp){
                  pos=pos+1;
                }
              
        
               }
                   
               );
               
               pos1=pos
              
               res.render('queue', {
                   pos: pos,authed:authed, user:nam
               });
                
            }
        );
            
        
        }
    })
   
});

app.get('/users/joinq',checkNotAuthenticated, (req,res) => {
   
    res.render('joinq',{layout:'./layouts/registration',authed:authed,user:nam});
});
app.get('/users/exitq', (req,res) => {
    client.del(req.user.id);
    client.srem("queuemembers", req.user.id);

    res.redirect("/");
});
app.get('/users/register', checkAuthenticated, (req,res) => {
    res.render('reg',{layout:'./layouts/registration',authed:authed});
});
app.get('/users/login',checkAuthenticated, (req,res) => {
    res.render('log',{layout:'./layouts/registration',authed:authed});
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
app.get('/pos', function(req, res){
    let pos=1;
    let id = usrId;
    client.hgetall(id, async (err, obj)=>{
        if(!obj){
           
            
        } else {
            obj.id = id;
            
            function reassembleSort() {
    
                
                //get all the arguments
                var	sortArguments = Array.prototype.slice.call(arguments);
                //get the callback, convert the single element array into a string
                var originalCb = Array.prototype.slice.call(arguments).slice(-1)[0];
                var	fields = [];
            
            //remove the last argument, eg the callback
            sortArguments.splice(-1,1);
        
            //go through each argument
            sortArguments.forEach(function(anArgument,argumentIndex) {
                //if the argument is some form of 'get'
                if (anArgument.toLowerCase() === 'get') {
                    //special pattern for getting the key
                    if (sortArguments[argumentIndex+1] === '#') {
                        //push it into the fields array
                        fields.push('#');
                    } else {
                        //otherwise split the pattern by '->', retrieving the latter part
                        //and push it into the fields object
                        fields.push(sortArguments[argumentIndex+1].split('->')[1]);
                    }
                }
            });
            //run the normal sort
            client.sort.apply(
                client, //the `this` argument of the sort should be the client
                [
                    sortArguments, //just the sort arguments without the callback
                    function(err, values){
                        if (err) { originalCb(err); } else {
                            //we'll use lodash
                            values = _(values)
                                //chunk splits up the returned values by the number of fields
                                //and returns it into a nested array of these chunks
                                .chunk(fields.length)
                                .map(function(aValueChunk) {
                                    //we will zip the fields and the chunks
                                    return _.zipObject(fields, aValueChunk);
                                })
                                .value();
                            //call the original callback passing in the new values	
                            originalCb(err,values);
                        }
                        
                    }
                ]
            );
        }
        
        reassembleSort(
            'queuemembers',
            'ALPHA',
            'BY',
            '*->timestamp',
            'GET',
            '*->name',
            'GET',
            '*->timestamp',
             function(err,values) {
                if (err) throw err;
                let arr = []
                
               
               //arr=JSON.stringify(values,null,' ');
               arr = values;
               
                arr.forEach(a=>{
                
                if(a.timestamp<obj.timestamp){
                  pos=pos+1;
                }
              
        
               }
                   
               );
               
               pos1=pos
              
               res.send({pos:pos1});
                
            }
        );
            
        
        }
    })
    
    });
    
 
app.post("/users/login", passport.authenticate('local', {
        
        //successRedirect: '/',
        failureRedirect:'/users/login',
        failureFlash: true
    }),(req,res) => {
        usrId = req.user.id;
        nam = (req.user.name).charAt(0).toUpperCase() + (req.user.name).slice(1)
        res.render('index',{authed:true,user:nam})}
);

app.post('/users/joinq', async (req,res) => {

    let { bank, branch, service } = req.body;
    let id = req.user.id;
    let name = req.user.name;
   

    
    let payload ={
        id:id,
        name:name,
        bank:bank,
        branch:branch,
        service:service
    }

    let errors =[];
    if(!bank || !branch || !service ){
         errors.push({message: "Please enter all fields"});
    }
  
   if(errors.length >0 ){
    res.render("joinq",{errors, authed:authed});
   }else{
       
      sendToKafka(payload);
      var delayInMilliseconds = 2500; 

setTimeout(function() {
    res.redirect('/users/queue'); 
}, delayInMilliseconds);
      
   }
});
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        authed=true;
        return res.redirect(" ");
    }
    next();
    
    
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        authed=true;
        return next();
    }
    authed=false;
    res.redirect("/users/login");
}
app.listen(PORT, console.log(`Server running on port ${PORT}`));


