const { get } = require('mongoose');
const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');
const { create } = require('../models/User');

module.exports = {
    createBookmark: async (req, res) => {
        const jobId = req.body;
        const userId = req.user.id;

        try {
            const job = await Job.findById(jobId);

            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            const newBookmark = new Bookmark({ job: jobId, userId: userId });
            const savedBookmark = await newBookmark.save();

            return res.status(201).json({ status: 'success', bookmarkId: savedBookmark._id });
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    deleteBookmark: async (req, res) => {
        const bookmarkId = req.params.bookmarkId;
        try {
             await Bookmark.findByIdAndDelete(bookmarkId);
            return res.status(200).json({ status: 'success', message: 'Bookmark deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getAllBookmarks: async (req, res) => {
        const userId = req.user.id;
        try {
            const bookmarks = await Bookmark.find({ userId: userId },{createdAt:0,updatedAt:0,__v:0})
            .populate(
                {
                path:'job',
                select:"-requirements -description  -createdAt -updatedAt -__v"
                }
            )
            res.status(200).json({ status: 'success', bookmarks: bookmarks });
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getBookmarks: async (req, res) => {
        const jobId = req.params.jobId;
        const userId = req.user.id;
        try{
            const bookmarks = await Bookmark.findOne({userId:userId,job:jobId})
            if(!bookmarks){
                return res.status(200).json({ status:false,bookmarkId:'none' });      
            }
            res.status(200).json({ status: true, bookmarkId: bookmarks._id });

        }catch (error){
            res.status(500).json({ message: error.message });
        }
    }
}