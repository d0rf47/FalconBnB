//****************Search Module******************* */
const express =  require('express');
const router =  express.Router();
const Room = require('../Models/Room');
const Stay =  require('../Models/Stays')
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

router.get('/book/:id',authAccess, (req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>
    {            
        res.render('Rooms/Book',
        {            
            roomDoc : room
        })
    })
    .catch(err=>console.log(`${err}`))
})
router.post('/book/:id', authAccess, (req,res)=>
{
    let msg;
    let tGuests =  req.body.adults + req.body.children + req.body.infant;
    const errors=[];
    const newStay = 
    {
        destination:req.body.destination,
        price:req.body.price,
        location:req.body.location,
        date : 
        {
            start:req.body.checkIn,
            end:req.body.checkOut
        },        
        guests:tGuests,
        owner:req.session.userInfo.email
    };
    const stay = new Stay(newStay)
    stay.save()
        .then(()=>
        {
            msg = `Room ${req.body.destination} Sucessfully Booked!`;
            console.log('Book Successful')
            res.render('Users/dashboard',
            {
                msg:msg
            })
        })
        .catch(err=>console.log(`Book Err :${err}`))
})

module.exports= router;