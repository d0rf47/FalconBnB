/***********Authentication Module***********
*******Used to Create Protected Routes******/

const authAccess = (req,res,next)=>
{
    if(req.session.userInfo == null)
    {
        res.redirect("/")
    }
    else
    {
        next();
    }
};

module.exports=authAccess;