const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require("../models/user"); // Changed to `person`
const { jwtAuthMiddleware,generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  // Added async keyword to make the function asynchronous
  try {
    const data = req.body;

    // Creating a new person instance using the model
    const newUser = new user(data); // Changed to `person`

    // Save the new person to the database
    const response = await newUser.save();
    console.log("Data saved ");

    const payload={
        id:responce.id
    }
console.log(JOSN.stringify(payload));
    const token=generateToken(payload);
    console.log("Token is :", token);

    res.status(200).json({response: response, token: token}); // Corrected response and token variables
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" }); // Fixed syntax error here
  }
});
router.post('/login',async (req,res)=>{
try{
  const {addharNumber,password}=req.body;

  const user = await user.findOne({aadharNumber: aadharNumber});

if(!user || !(await user.copmarePassword(password))){
    return res.status(401).json({error:'Invalid username and password'})
}
const payload ={
id:user.id,
}
const token =generateToken(payload);

}


catch (err){
    console.log(err)
    res.status(500).json({error: 'internal server error'});


}
});

//profile

router.post('/profile', jwtAuthMiddleware,async(req,res)=>{
    try{
   const userData=req.user;
   const userId = userData.Id;
   const user=await user.findById(userId);
   res.status(200).json({user});
    }

    catch(err){
        console.log(err);
        res.status(500).json({error:'server error'})

    }
})



//update data 
router.put("/profile/password",jwtAuthMiddleware, async (req, res) => {
    try {
      const userId = req.user; // Corrected variable name to personId
      const {currntPassword, newPassword}=req.body;

  const response = await user.findById(userId);

  if(!(await user.copmarePassword(currntPassword))){
    return res.status(401).json({error:'Invalid username and password'});

    user.password=newPassword;
    await user.save();
}

       
  
      console.log("password update");
      res.status(200).json({message: "password updated"});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "internal error" });
    }
  });

  

  

module.exports = router;

