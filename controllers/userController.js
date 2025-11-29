const User = require("../models/User");
const Skills = require("../models/Skills");
const Agent = require("../models/Agent");
module.exports = {
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id || (req.user && req.user.id);
      if (!userId) {
        return res.status(400).json({ error: 'User ID not provided' });
      }
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({ status: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: true });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
  getUser: async (req, res) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token" });
      }
      const profile = await User.findById(userId);
      if (!profile) {
        return res.status(404).json({ message: "User not found in database" });
      }
      const { password, createdAt, updatedAt, __v, ...userData } = profile._doc;
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addSkills: async (req, res) => {
    const newSkill = new Skills({ userId: req.user.id, skill: req.body.skill });
    try {
      await newSkill.save();
      await User.findByIdAndUpdate(req.user.id, { $set: { skills: true } });
      res.status(200).json({ status: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getSkills: async (req, res) => {
    const userId = req.user.id;
    try {
      const skills = await Skills.find(
        { userId: userId },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
      if (skills.length === 0) {
        res.status(200).json([]);
      }
      res.status(200).json(skills);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteSkills: async (req, res) => {
    const skillId = req.params.skillId;
    try {
      const result = await Skills.findByIdAndDelete(skillId);
      if (!result) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      res.status(200).json({ status: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addAgent: async (req, res) => {
    const newAgent = new Agent({
      userId: req.user.id,
      uid: req.body.uid,
      company: req.body.company,
      hq_address: req.body.hq_address,
      working_hrs: req.body.working_hrs,
    });
    try {
      await newAgent.save();
      await User.findByIdAndUpdate(req.user.id, { $set: { isAgent: true } });
      res.status(200).json({ status: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  updateAgent: async (req, res) => {
    const id = req.params.id;
    const newAgent = new Agent({
      userId: req.user.id,
      uid: req.body.uid,
      company: req.body.company,
      hq_address: req.body.hq_address,
      working_hrs: req.body.working_hrs,
    });
    try {
      const updatedAgent = await Agent.findByIdAndUpdate(
        id,
        {
          userId: req.user.id,
          uid: req.body.uid,
          company: req.body.company,
          hq_address: req.body.hq_address,
          working_hrs: req.body.working_hrs,
        },
        { new: true }
      );
      if (!updatedAgent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      res.status(200).json({ status: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getAgent: async (req, res) => {
    try {
      const agentData = await Agent.find(
        { uid: req.params.uid },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
      const agent = agentData[0];
      res.status(200).json(agent);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getAgents: async (req, res) => {
    try {
      const agents = await User.aggregate([
        { $match: { isAgent: true } },
        { $sample: { size: 7 } },
        {
          $project: {
            _id: 0,
            username: 1,
            profile: 1,
            uid: 1,
           
          },
        },
      ]);
      res.status(200).json(agents);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
