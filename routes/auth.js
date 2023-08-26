const express = require('express');
const { body , validationResult} = require('express-validator')
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/fetchuser');
require('dotenv').config();
const JWT_secret = process.env.JWT_secret;




// Route1 : Creating User using POST "/api/auth/create_user"


router.post('/create_user',[body('name','Enter a valid name').isLength({min:3}),body('email','Enter a valid email').isEmail(),body('password','Password must be atleast 8 characters').isLength({min : 8})], async (req,res)=>{
    
    try{
        let Success = false;
        // validating the inputed data and showing errors if they exsits
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array(),Success:Success});
        }

        //securing password
        const salt = await bcrypt.genSalt(10);
        const secured_password = await bcrypt.hash(req.body.password,salt);

        // creating users and checking if email is already in use or not
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({errors:'User with this email already exists',Success:Success});
        }

        // creating new user
        user = await User.create({
            name:req.body.name,
            password:secured_password,
            email:req.body.email
        });

        //creating authentication token using json web token (jwt)
        const data={
            user:{
                id : user.id
            }
        }
        const auth_token = jwt.sign(data,JWT_secret);
        Success = true;
        res.json({auth_token,Success});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send('Some Internal Error Occured');
    }

});


// Route2 : Authenticating user using: POST'/api/auth/login'

router.post('/login',[body('email').isEmail(),body('password','Password is Invalid').exists()],async(req,res)=>{
    let Success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array(),Success:Success});
    }

    const {email,password} = req.body;

    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:'Please try with correct credentials',Success:Success});
        }

        const password_auth = await bcrypt.compare(password,user.password);
        if(!password_auth){
            return res.status(400).json({error:'Please try with correct credentials',Success:Success});
        }

        const data={
            user:{
                id : user.id
            }
        }
        const auth_token = jwt.sign(data,JWT_secret);
        Success = true; 
        res.json({auth_token,Success});
    }
    catch(errors){
        console.log(errors.message);
        res.status(500).send('Some Internal Error Occured');
    }
});


// Route3 : Get logged user details using: POST'/api/auth/getuser'


router.post('/getuser',fetchuser,async(req,res)=>{
    try{
        console.log("hello i am listing");
        const user  = await User.findById(req.user.id).select({password:0});
        res.send(user);
    }
    catch(errors){
        console.log(errors.message);
        res.status(500).send('Some Internal Error Occured');
    }
});

module.exports = router;