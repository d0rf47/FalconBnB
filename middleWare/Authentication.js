/***********Authentication Module***********
*******Used to Create Protected Routes******/

const authAccess = (req,res,next)=>
{
    if(req.session.userInfo.host!=true)
    {
        res.redirect("/")
    }
    else
    {
        next();
    }
};

module.exports=authAccess;