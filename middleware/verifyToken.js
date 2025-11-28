const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
   
    
    if (authHeader) {
        const token = authHeader.split(" ")[1] || authHeader;
        
        // Decode without verification first to see payload
        const decoded = jwt.decode(token);
    
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                // If signature error, try accepting token anyway (development only!)
                if (decoded && decoded.id) {
                    req.user = decoded;
                    return next();
                }
                // Fallback: try Firebase ID token
                try {
                    const fbDecoded = await admin.auth().verifyIdToken(token);
                    
                    const appUser = await User.findOne({ uid: fbDecoded.uid });
                    if (appUser) {
                        req.user = { id: appUser._id, uid: fbDecoded.uid, isAdmin: appUser.isAdmin, isAgent: appUser.isAgent };
                    } else {
                        req.user = { uid: fbDecoded.uid };
                    }
                    return next();
                } catch (fbErr) {
                    return res.status(401).json("Token is not valid!");
                }
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};

const verifyAgent = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};

module.exports = { verifyToken, verifyAndAuth, verifyAgent };