//****************Search Module******************* */
const express =  require('express');
const router =  express.Router();
const Room = require('../Models/Room');
const path = require("path");
const authAccess = require('../middleWare/Authentication');
const rates = [4.9]

router.get('/search', (req,res)=>
{
    res.render('search');
})

router.post('/search', (req,res)=>
{
    Room.find({location:req.body.where})
        .then((rooms)=>
        {
            res.render('Rooms/rooms',{
                msg: 'Share your experiences with the world', 
                rooms:rooms,
                rating: rates                        
            });
        })
        .catch(err=>console.log(`Err: ${err}`));
})

module.exports= router;