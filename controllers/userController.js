const User = require('../models/User');
module.exports = {
    updateUser: async (req, res) => {
        try {
             await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            )
            res.status(200).json({status :true})
        } catch (err) {
            res.status(500).json({error:err});
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({status :true})
        } catch (err) {
            res.status(500).json({error:err});
        }
    },
    getUser: async (req, res) => {
        try {
            const profile = await User.findById(req.params.id);
            const { password,createdAt,updatedAt,__v, ...userData} = profile._doc;
            res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({error:err});
        }
    }
};