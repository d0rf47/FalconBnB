//***********Main Sever**********//
const express = require("express"); 
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride =  require('method-override');
const session = require('express-session');
const fileup = require("express-fileupload");
//This loads all our environment variables from the keys.env
require("dotenv").config({path:'./config/Keys.env'});
const dbURL = `mongodb+srv://${process.env.mbk}:${process.env.mbTok}@falconbnb-ppoyi.gcp.mongodb.net/FalconBnB?retryWrites=true&w=majority`;
const mainRouter =  require('./Routes/General')
const userRouter =  require('./routes/User');
const RoomRouter =  require('./Routes/rooms');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(session({secret:"Key"}));
//This is how you map your file upload to express
app.use(fileup());
//override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use((req,res,next)=>
{
    //This is a global variable that can be accessed by templates
    res.locals.user = req.session.userInfo;
    next();
})
app.use('/', mainRouter);
app.use("/user", userRouter);
app.use("/rooms", RoomRouter);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


mongoose.connect(dbURL,{ useUnifiedTopology: true, useNewUrlParser: true })
    .then(()=>{
     console.log('Database Connected');

 })
    .catch(err=>{
        console.log(`Connection Error: ${err}`);
})


let PORT = process.env.PORT || 4000;  //stores the port number for heroku
app.listen(PORT, ()=>{
    console.log(`Sever connected! Listening on port  ${PORT}`)
})
