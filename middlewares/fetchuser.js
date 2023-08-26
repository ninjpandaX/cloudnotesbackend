const jwt = require('jsonwebtoken');
const JWT_secret = "wooooh@$";


const fetchuser = (req,res,next)=>{
    
    //Get the user from the jwt token and add id to req object
    
    const token = req.header('auth-token');
    if(!token){
        res.status(401).json({error:"Please authenticate using valid token",Success:"false"});
    }
    try{
        const data = jwt.verify(token,JWT_secret);
        req.user = data.user;
        next();
    }
    catch(errors){
        res.status(401).json({error:"Please authenticate using valid token",Success:"false"});
    }
};

module.exports = fetchuser;