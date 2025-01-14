import { UserModel } from '../models/User.js'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

export const getAuth = (req, res) => {
    res.send('ROUTER SUCCESS')
}

export const Register = async (req, res) => {
    const {email, password} = req.body

    // validation
    if (!email || !password) 
        return res.status(400).json({success: false, message: 'Missing email or password'})
    try {
        const user = await UserModel.findOne({ email })
        if (user)
            return res.status(400).json({success: false, message: 'User existed'})
        const hashPassword = await argon2.hash(password)
        const newUser = new UserModel({
            email,
            password: hashPassword
        })
        await newUser.save()

        //return token
        const accessToken = jwt.sign({userId: newUser._id}, 'messithanh2k')
        return res.json({success: true, message: "User created succesfully", accessToken})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

export const Login = async (req, res) => {
    const {email, password} = req.body

    // validation
    if (!email || !password) 
        return res.status(400).json({success: false, message: 'Missing email or password'})
    try {
        //check for existing user
        const user = await UserModel.findOne({ email })
        if (!user)
            return res.status(400).json({success: false, message: 'incorrect email'})
        
        //account found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid)
            return res.status(400).json({success: false, message: 'incorrect password'})

        //return token
        const accessToken = jwt.sign({userId: user._id}, 'messithanh2k')
        return res.json({success: true, message: "Login succesfully", accessToken})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}
