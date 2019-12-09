/*GENERAL ROUTES*/
//Route to direct user to home page//

const express =  require('express');
const router =  express.Router();
const Room =  require('../Models/Room');

router.get("/", (req,res)=>
{
    Room.find()
        .then((rooms)=>
        {
            res.render('home',
            {
                rooms:rooms
            });                       
        })
        .catch(err=>console.log(`error: ${err}`))
    
})
router.get("/registration", (req,res) => 
{
    res.render('registration')
})

module.exports = router;