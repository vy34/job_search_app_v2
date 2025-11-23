const { get } = require('mongoose');
const Job = require('../models/Job');
module.exports = {
    createJob: async (req, res) => {
        const newJob = new Job(req.body);
        try {
            await newJob.save();
            
            res.status(201).json({status: true, message: 'Job created successfully', job: newJob});
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    updateJob : async (req, res) => {
        const jobId = req.params.id;
        const updates = req.body;
        try {
            const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true  });
            if (!updatedJob) {
                return res.status(404).json({status: false, message: 'Job not found' });
            }   
            res.status(200).json({status: true, message: 'Job updated successfully', job: updatedJob});
        } catch (err) {
            res.status(400).json({ message: err.message });
        }   
    }, 
    
    deleteJob : async (req, res) => {
        const jobId = req.params.id;
        try {
            await Job.findByIdAndDelete(jobId);
            res.status(200).json({status: true, message: 'Job deleted successfully' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    getJob : async (req, res) => {
        const jobId = req.params.id;
        try {
            const job = await Job.findById({_id: jobId},{createdAt: 0, updatedAt: 0, __v: 0});
            if (!job) {
                return res.status(404).json({status: false, message: 'Job not found' });
            }
            res.status(200).json({status: true, message: 'Job retrieved successfully', job: job});
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
};