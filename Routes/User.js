//*********Route for all User Data*******//
//Handle everything to do with Users //
const express =  require('express')
const router =  express.Router();
const bcrypt = require('bcryptjs');
const key = `${process.env.sendgridKey}`;
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const User  = require('../Models/User');
const mongoose =  require('mongoose');


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
    res.render('Users/registration',{err:errors});
    
})

router.post('/registration', (req,res)=>{
    const errors =[];
       
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
        res.render('Users/registration',{
            err:errors            
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
            
        });   
        })
        .catch((err)=>{
            errors.push("Email Already Used");            
            console.log(`User not added Error: ${errors}`)
            console.log(errors.length)
            res.render("Users/registration",
            {
                err:errors   
            } );   
        })  
        if(errors.length > 0)  
        {
         
            console.log("test")
        }
    
    }
})

router.get("/dashboard", (req,res)=>{
    res.render('Users/dashboard');
})
router.get('/login',(req,res)=>
{
    res.render('Users/login');
})
/* ***************************
    Error WHEN USER UPDATES LOCATION TO BECOME HOST THE PASSWORD IS SOMEHOW
    CORRUPTED AND LOGIN WILL ALWAYS FAIL AFTER THIS HAS BEEN DONE, ASK 
    KADEEM WHY/\HOW THIS EVEN HAPPENING MOST LIKELY IN THE .SAVE() 
    FUNCTION TO UPDATE THE NEW DATA IN MONGODB
*/
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

router.get("/update", (req,res)=>
{
    res.render('Users/dashboard')
})
router.post("/update", (req,res)=>
{
    let user  =  req.session.userInfo;
    User.findOne({email:user.email})
            .then(doc=>
                {
                    console.log(`${doc.location.country}`)
                    let city    =  req.body.city;
                    let country =  req.body.country;
                    let host    =  req.body.cofirmHost;

                    if(host == 'on')
    {



        User.findByIdAndUpdate(user.id)
        doc.location.city   = city;
        doc.location.country= country;
        doc.host = true;
        console.log(`Updated ${doc.location.city} ${doc.location.country} added!`)               
        doc.save()
        .then(()=>
        {
            console.log(`Updated ${doc.location.city} ${doc.location.country} added!`)               
            
        })
        .catch((err)=>{
            console.log(`Update Failed Error: ${err}`)            
        })    
              
    //console.log(`${user.location.city}`)

    console.log(`${city}   ${country}  ${host}`);
    
        res.redirect('/user/dashboard');
    }
})    
    
})

module.exports = router;