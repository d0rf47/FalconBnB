//*********Route for all User Data*******//
//Handle everything to do with Users //
const express =  require('express')
const router =  express.Router();
const bcrypt = require('bcryptjs');
const key = `${process.env.sendgridKey}`;
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const User  = require('../Models/Users');
const mongoose =  require('mongoose');
const Stays =  require('../Models/Stays');
const authAccess =  require('../middleWare/Authentication');
const path = require("path");
//used to validate Sengrid Account
const options  = {
    auth:{
        api_key : key
    }
}
const mailer = nodemailer.createTransport(sgTransport(options));
//Validation Functions usinfg RegEx for Email & Password
const validateEmail = (email) =>{
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const validatePass = (pass) =>{
    let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return re.test(pass);
}


//Routs Begin Here
router.get("/registration", (req,res) => 
{   
    res.render('Users/registration');
    
})

router.post('/registration', (req,res)=>{
    let errors =[];
    let failed = 'Error User Registration Failed';
    const msg = `Welcome ${req.body.first_name} ${req.body.last_name} to Falcon BnB your Account UserName is : ${req.body.email1}`
    const email = {
        to: `${req.body.email1}`,
        from: 'FalconBnB@gmail.com',
        subject: 'Welcome! Come discover the World',
        text: msg,
        html: `<p> ${msg} </p>`,
    };
    if(!validateEmail(req.body.email1)){
        errors.push("Must be a valid Email")
    }
    if(req.body.Newpassword != req.body.Cpassword){
        errors.push('Passwords do not Match')
    }
    if(req.body.first_name == ""){
        errors.push('Please Enter a valid First name')
    }
    if(req.body.last_name == ""){
        errors.push('Please Enter a valid Last name')
    }
    
    if(errors.length > 0) 
    {
        res.render('Users/registration',
        {
            err:errors,
            msg:failed            
        });
        
    }
    
    if(errors.length == 0)
    {
        const newUserData = 
        {
        email: req.body.email1,
        first: req.body.first_name, 
        last:  req.body.last_name,
        dob:   req.body.dob, 
        password: req.body.Newpassword
        }

        const user = new User(newUserData);                
        user.save()    
        .then(()=>
        {
            console.log(`User ${newUserData.first} ${newUserData.last} added!`)               
            mailer.sendMail(email, (err, res)=> 
            {
            if (err) 
            { 
                console.log(err) 
            } 
            
        })
        })
        .catch((err)=>{
            errors.push("Account already exist with that email");            
            console.log(`User not added Error: ${errors}`)                
            res.render('Users/registration',
            {
                err:errors            
            });
            
        })              
    }   
    if(errors.length<1)
    {
        res.redirect("/"); 
    }
})

router.get("/dashboard", authAccess, (req,res)=>
{
    let user = req.session.userInfo;
    Stays.find({owner:req.session.userInfo.email})
        .then((stays)=>
        {            
            res.render('Users/dashboard',
            {
                UserDoc:user,
                stays:stays                
            });
        })
        .catch(err=>console`${err}`)
    
})
router.get('/login',(req,res)=>
{
    res.render('Users/login');
})

router.post('/login', (req,res)=>
{
    const errors = [];
    let lUser = req.body.userName;
    let lPass = req.body.Lpassword;
    if(!validateEmail(lUser)){
        errors.push("Invalid Email");        
    }
     if(!validatePass(lPass)){
         errors.push("Invalid Password");
    }
    if(errors.length >= 1 ){
        res.render('Users/login',{
            errors:errors            
        })        
    }
    if(errors.length < 1) 
    {
        User.findOne({email:lUser})
            .then(user=>
                {
                    if(user == null)
                    {
                        errors.push("No Account Exists with that Email Please try again");
                        res.render('Users/login',{
                            errors:errors
                        })
                    }
                    else
                    {
                        bcrypt.compare(lPass, user.password)
                            .then(isMatched=>
                                {
                                    if(isMatched == true)
                                    {
                                        req.session.userInfo=user;
                                        res.redirect("/user/dashboard")
                                    }
                                    else
                                    {
                                        errors.push("Sorry Password is incorrect")
                                        res.render('Users/login',{
                                            errors:errors
                                        })
                                    }
                                })
                                .catch(err=>console.log(`Err : ${err}`));
                    }
                })
            .catch(err=>console.log(`Err : ${err}`));
    }
})

router.get("/logout", (req,res)=>
{
    req.session.destroy();
    res.redirect("/");
})

router.get("/update", authAccess,(req,res)=>
{
    res.render('Users/dashboard')
})
router.post("/update", authAccess, (req,res)=>
{
    
    let host={host:false};
    let user  =  req.session.userInfo;
    console.log(`${user.email}`)
    let filter = {email:user.email}
    let location = {city:req.body.city, country:req.body.country};
    if(req.body.host = "on")
    {
        host.host=true;
    }
    
    User.findOneAndUpdate(filter,host,            
        {new:true}        

    )
    .then(()=>
    {
        console.log(`update successful : ${host.host}`)
    })       
    .catch(err=>console.log(`Err : ${err}`));
    User.findOneAndUpdate(filter,
        {location:location},    
        {new:true}        

    )
    .then(()=>
    {
        console.log(`update successful : ${location.city}`)
    })       
    .catch(err=>console.log(`Err : ${err}`));
    res.redirect('dashboard');         
})

router.post('/Edit/:id', authAccess, (req,res)=>
{
    User.findById(req.params.id)
        .then((user)=>
        {
            res.render('Users/registration',
            {
                UserDoc :user
            });
        })
        .catch(err=>console.log(`Err : ${err}`));
    
})
router.post('/UpdateEdit/:id', authAccess, (req,res)=>
{
    let temp = req.session.userInfo.email;    
    let filter = req.params.id;
    let x = Math.random() * 10; 
    User.findById(req.params.id)
        .then((user)=>
        {            
            user.email=      req.body.email1;
            user.first=      req.body.first_name;
            user.last=      req.body.last_name;                        
            if(req.files == null)
            {
                user.proPic = user.proPic;
                User.findByIdAndUpdate(filter, user, {new:true})
                    .then(()=>
                    {                        
                        res.redirect('/user/dashboard')                            
                    }) 
                    .catch(err=>console.log(`${err}`))
            }
            else
            {                
                User.findByIdAndUpdate(filter, user, {new:true})
                .then(user=>
                    {                        
                        req.files.proPic.name = `db_${x}${user._id}${path.parse(req.files.proPic.name).ext}`    
                        req.files.proPic.mv(`public/uploads/${req.files.proPic.name}`)
                            .then(()=>
                            {
                                User.findByIdAndUpdate(filter,
                                    {
                                        proPic:req.files.proPic.name                                        
                                    },
                                    {
                                        new:true
                                    })
                                    .then(()=>
                                    {
                                        req.session.userInfo.proPic=req.files.proPic.name;
                                        console.log(`Profile pic updated`)
                                        res.redirect('/user/dashboard')
                                    }) 
                                    .catch(err=>console.log(`${err}`))    
                            });                                                        
                        })                                            
                }
                
        })
        .catch(err=>console.log(`${err}`))        
        
})


router.get('/Trips/:id', authAccess, (req,res)=>
{
    res.redirect('/User/dashboard')
})
module.exports = router;