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
    let tGuests = Number(req.body.adults)+ Number(req.body.children) + Number(req.body.infant);
    
    const errors=[];
    console.log(`${req.body.checkOut}`)
    if(req.body.destination == null)
    {
        errors.push("Must Include Destination")
    }

    if(req.body.price == null)
    {
        errors.push("Must Include Original Price")
    }
    if(req.body.location == null)
    {
        errors.push("Must Include Location")
    }
    if(tGuests < 1)
    {
        errors.push("Must Include Number of guests")
    }
    if(req.body.destination == null)
    {
        errors.push("Must Include Destination")
    }
    if(req.body.checkIn == undefined)
    {
        errors.push("Must Include Check-in Check-Out Dates")
    }    
    if(req.body.checkOut == undefined)
    {
        errors.push("Must Include Check-in Check-Out Dates")
    }
    if(errors.length > 0)
    {
        Room.findById(req.params.id)
            .then((room)=>
            {            
                res.render('Rooms/Book',
                    {            
                        roomDoc : room,
                        err:errors
                    })
            })
            .catch(err=>console.log(`${err}`))
    }
    else
    {
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
                message:msg
            })
        })
        .catch(err=>console.log(`Book Err :${err}`))
    };
});

module.exports= router;