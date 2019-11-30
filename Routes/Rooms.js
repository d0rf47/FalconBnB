/*********************Rooms ROUTES***************************/
//Everything Needed to manage Rooms 

const express =  require('express');
const router =  express.Router();
const Room = require('../Models/Room');
const path = require("path");
const rates = [4.9]
const authAccess = require('../middleWare/Authentication');

router.get("/rooms", (req,res)=>
{    
    Room.find()
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

router.get('/addRoom',authAccess, (req,res)=>
{
    res.render('Rooms/AddRoom');
})

router.post('/addRoom', (req,res)=>
{
    const errors = [];
    const newRoomData = 
    {
        title:req.body.Rtitle,
        price:req.body.pricePer,
        desc:req.body.Rdesc,
        location:req.body.Rlocation,
        owner:req.session.userInfo.email
    }
    if(req.files ==  null)
    {
        errors.push("Sorry Room Must have at least 1 picture")
    }
    else
    {
        if(req.files.Rpic.mimetype.indexOf("image")==-1)
        {
            errors.push("Must Be an Image File (JPEG PNG JPG ")            
        }
    }
    if(errors.length > 0)
    {
        res.render('Rooms/AddRoom',
        {
            errors:errors,
            title:      newRoomData.title,
            price:      newRoomData.pricePer,
            desc:       newRoomData.Rdesc,
            location:   newRoomData.Rlocation
        })
    }
    else
    {
        const room = new Room(newRoomData)
        room.save()
            .then(room=>
                {
                    req.files.Rpic.name = `db_${room._id}${path.parse(req.files.Rpic.name).ext}`

                    req.files.Rpic.mv(`public/uploads/${req.files.Rpic.name}`)
                        .then(()=>
                        {
                            Room.findByIdAndUpdate(room._id,
                                {
                                    roomPic:req.files.Rpic.name
                                })
                                    .then(()=>
                                    {
                                        console.log(`File Uploaded`)
                                        res.redirect("/User/Dashboard")
                                    })
                                    .catch(err=>console.log(`Err :${err}`));

                        });
                })  
                .catch((err=>console.log(`Err: ${err}`)));//look here too many brackets
    }
    
});

router.get('/Edit')


module.exports = router;