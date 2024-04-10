const jwt =require('jsonwebtoken');

const jwtAuthMiddleware=(req,res,next)=>{
    const token =req.header.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'inauthorized'});

    try{
//verify token
         const decoded=jwt.verify(token,process.env.JWT_SECRET);

         //attach user information to the request
         req.user=decoded
         next();


    }
    catch(err){
        console.log(err);
        res.status(404).json({error:'Invilied token'})

    }
}


//Funcrion to genetate JWT token

const generateToken=(userData)=>{
    return jwt.sign(userData, process.env.JWT_SECRET);

}

module.exports={jwtAuthMiddleware,generateToken};