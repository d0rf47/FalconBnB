/***********Authentication Module***********
*******Used to Create Protected Routes******/

const authAccess = (req,res,next)=>
{
    if(req.session.user==null)
    {
        res.redirect("/")
    }
    else
    {
        next();
    }
};

module.exports=authAccess;