const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const admin = require('firebase-admin');
const { create } = require('../models/Job');

module.exports = {
    createUser: async (req, res) => {
       const user = req.body;
    try {
        let userResponse = await admin.auth().getUserByEmail(user.email);
        // User exists in Firebase, check if exists in MongoDB
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user record in MongoDB for existing Firebase user
        const newUser = await new User({
            uid: userResponse.uid,
            username: user.username,
            email: user.email,
            password: CryptoJS.AES.encrypt(user.password, process.env.SECRET).toString(),
            role: user.role
        });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            try{
                const userResponse = await admin.auth().createUser({
                    email: user.email,
                    password: user.password,
                    emailVerified: false,
                    disabled: false
                })
                console.log(userResponse.uid);

                const newUser = await new User({
                    uid: userResponse.uid,
                    username: user.username,
                    email: user.email,
                    password: CryptoJS.AES.encrypt(user.password, process.env.SECRET).toString(),
                    
                    role: user.role
                });
                await newUser.save();
                res.status(201).json({ message: 'User created successfully' });
            }catch(err){
                 res.status(500).json({ message: err.message });
            }
           
        }
    }},
    loginUser: async (req, res) => {
       try{
        const user = await User.findOne({email: req.body.email},{createdAt: 0, updatedAt: 0, __v: 0,skills: 0,email: 0});
        if(!user){
            return res.status(401).json({ message: 'User not found' });
        }
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
        const depassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

        if(depassword !== req.body.password){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const userToken = jwt.sign({
            id: user._id,
            isAdmin:user.isAdmin,
            isAgent:user.isAgent,
            uid: user.uid
        }, process.env.JWT_SECRET, { expiresIn: '21d' });    

        const {password,isAdmin, ...others} = user._doc;
        res.status(200).json({ ...others,userToken });
       }
       catch(err){
              res.status(500).json({ message: err.message });
       }
    },
};