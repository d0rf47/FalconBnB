/*********************Rooms ROUTES***************************/
//Everything Needed to manage Rooms 

const express =  require('express');
const router =  express.Router();
const rates = [4.9]
router.get("/rooms", (req,res)=>{    
    res.render('Rooms/rooms',{
        msg: 'Share your experiences with the world', 
        rating: rates        
    })    
})

router.post('/addRoom', (req,res)=>
{
           
})



module.exports = router;