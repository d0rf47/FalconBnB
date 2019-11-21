/*GENERAL ROUTES*/
//Route to direct user to home page//

const express =  require('express');
const router =  express.Router();

router.get("/", (req,res)=>{
    res.render('home');
})
router.get("/registration", (req,res) => {
    res.render('registration')
})

module.exports = router;