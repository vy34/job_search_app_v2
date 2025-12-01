module.exports = {
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id || (req.user && req.user.id);
      if (!userId) {
        return res.status(400).json({ error: 'User ID not provided' });
      }

      const { data, error } = await global.supabaseAdmin
        .from('users')
        .update(req.body)
        .eq('id', userId)
        .select();

      if (error) throw error;

      res.status(200).json({ status: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { error } = await global.supabaseAdmin
        .from('users')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;

      res.status(200).json({ status: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token" });
      }

      const { data: profile, error } = await global.supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return res.status(404).json({ message: "User not found in database" });
      }

      const { password, created_at, updated_at, ...userData } = profile;
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addSkills: async (req, res) => {
    try {
      const { data: newSkill, error } = await global.supabaseAdmin
        .from('skills')
        .insert({
          user_id: req.user.id,
          skill: req.body.skill
        })
        .select();

      if (error) throw error;

      // Update user skills flag
      await global.supabaseAdmin
        .from('users')
        .update({ has_skills: true })
        .eq('id', req.user.id);

      res.status(200).json({ status: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getSkills: async (req, res) => {
    const userId = req.user.id;
    try {
      const { data: skills, error } = await global.supabaseAdmin
        .from('skills')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json(skills || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteSkills: async (req, res) => {
    const skillId = req.params.skillId;
    try {
      if (error) throw error;

      res.status(200).json({ status: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addAgent: async (req, res) => {
    try {
      const { data: newAgent, error } = await global.supabaseAdmin
        .from('agents')
        .insert({
          user_id: req.user.id,
          company: req.body.company,
          hq_address: req.body.hq_address,
          working_hrs: req.body.working_hrs,
        })
        .select();

      if (error) throw error;

      // Update user is_agent flag
      await global.supabaseAdmin
        .from('users')
        .update({ is_agent: true })
        .eq('id', req.user.id);

      res.status(200).json({ status: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  updateAgent: async (req, res) => {
    const id = req.params.id;
    try {
      const { data: updatedAgent, error } = await global.supabaseAdmin
        .from('agents')
        .update({
          company: req.body.company,
          hq_address: req.body.hq_address,
          working_hrs: req.body.working_hrs,
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      if (!updatedAgent || updatedAgent.length === 0) {
        return res.status(404).json({ message: "Agent not found" });
      }

      res.status(200).json({ status: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getAgent: async (req, res) => {
    try {
      const { data: agents, error } = await global.supabaseAdmin
        .from('agents')
        .select('*')
        .eq('id', req.params.uid);

      if (error) throw error;

      const agent = agents[0];
      res.status(200).json(agent);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getAgents: async (req, res) => {
    try {
      const { data: agents, error } = await global.supabaseAdmin
        .from('users')
        .select('id, username, profile')
        .eq('is_agent', true)
        .limit(7);

      if (error) throw error;

      res.status(200).json(agents);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
