const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('./../models/userSchema')

const router=express.Router()

const JWT_SECRET=''

router.post('/register',async(req,res)=>{
    try{
        const {name, email, password}=req.body;

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'Email is already registered.'})
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const newUser=new User({
            name, 
            email,
            password:hashedPassword
        })

        await newUser.save();
        res.status(201).json({message:'User registered successfully'})
    }catch(error){
        console.log('Error in registering a new user')
        res.status(500).json({message:'Server error: Please try again later.'})

    }
})

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email})

        if(!user){
            return res.status(404).json({messgae:'User not found.'})
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid email or password.'})
        }

        const token=jwt.sign(
            {userId:user._id,email:user.email},
            JWT_SECRET,
            {expireIn:'1h'}
        )
        res.status(200).json({message:'Login Successful',
            token
        })
    }
    catch(err){
        console.log('Error in authenticating an existing user.')
        res.status(500).json({message:'Server error.Please try again later.'})
    }
})

module.exports=router;