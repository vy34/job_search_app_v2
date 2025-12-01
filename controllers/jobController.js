module.exports = {

    createJob: async (req, res) => {
        let jobData = req.body;
        const agentId = req.user && req.user.id;
        
        try {
            if (!agentId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            // Extract and map camelCase fields to snake_case
            const { imageUrl, agentId: bodyAgentId, agentName } = jobData;

            // Convert camelCase to snake_case for database
            const newJobData = {
                title: jobData.title,
                location: jobData.location,
                company: jobData.company,
                description: jobData.description,
                agent_name: agentName || 'Unknown Agent',
                agent_id: agentId,
                salary: jobData.salary,
                period: jobData.period,
                contract: jobData.contract || '',
                hiring: jobData.hiring !== false,
                requirements: jobData.requirements || [],
                image_url: imageUrl || '',
            };

            console.log('Creating job with agent_id:', agentId);
            console.log('Processed newJobData:', newJobData);

            const { data: newJob, error } = await global.supabaseAdmin
                .from('jobs')
                .insert(newJobData)
                .select();

            if (error) throw error;

            res.status(201).json({
                status: true,
                message: 'Job created successfully',
                job: newJob[0]
            });
        } catch (err) {
            console.error('Create job error:', err);
            res.status(400).json({ message: err.message });
        }
    },

    updateJob: async (req, res) => {
        const jobId = req.params.id;
        let updates = req.body;

        try {
            // Convert camelCase to snake_case for database
            const dbUpdates = {};
            if (updates.title) dbUpdates.title = updates.title;
            if (updates.location) dbUpdates.location = updates.location;
            if (updates.company) dbUpdates.company = updates.company;
            if (updates.description) dbUpdates.description = updates.description;
            if (updates.salary) dbUpdates.salary = updates.salary;
            if (updates.period) dbUpdates.period = updates.period;
            if (updates.contract) dbUpdates.contract = updates.contract;
            if (updates.requirements) dbUpdates.requirements = updates.requirements;
            if (updates.hiring !== undefined) dbUpdates.hiring = updates.hiring;
            if (updates.agentName) dbUpdates.agent_name = updates.agentName;
            if (updates.agent_name) dbUpdates.agent_name = updates.agent_name;
            if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
            if (updates.image_url) dbUpdates.image_url = updates.image_url;

            const { data: updatedJob, error } = await global.supabaseAdmin
                .from('jobs')
                .update(dbUpdates)
                .eq('id', jobId)
                .select();

            if (error) throw error;

            if (!updatedJob || updatedJob.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Job not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Job updated successfully',
                job: updatedJob[0]
            });
        } catch (err) {
            console.log('Error updating job:', err.message);
            res.status(400).json({ message: err.message });
        }   
    }, 
    
    deleteJob: async (req, res) => {
        const jobId = req.params.id;
        try {
            const { error } = await global.supabaseAdmin
                .from('jobs')
                .delete()
                .eq('id', jobId);

            if (error) throw error;

            res.status(200).json({
                status: true,
                message: 'Job deleted successfully'
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    getJob: async (req, res) => {
        const jobId = req.params.id;
        try {
            const { data: job, error } = await global.supabaseAdmin
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .single();

            if (error) throw error;

            if (!job) {
                return res.status(404).json({
                    status: false,
                    message: 'Job not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Job retrieved successfully',
                job: job
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    getAllJob: async (req, res) => {
        const recent = req.query.new;
        try {
            let query = global.supabaseAdmin
                .from('jobs')
                .select('*');

            if (recent) {
                query = query
                    .order('created_at', { ascending: false })
                    .limit(2);
            }

            const { data: jobs, error } = await query;

            if (error) throw error;

            res.status(200).json(jobs);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    searchJob: async (req, res) => {
        try {
            const searchTerm = req.params.key;

            const { data: results, error } = await global.supabaseAdmin
                .from('jobs')
                .select('*')
                .or(
                    `title.ilike.%${searchTerm}%,` +
                    `location.ilike.%${searchTerm}%,` +
                    `company.ilike.%${searchTerm}%,` +
                    `description.ilike.%${searchTerm}%`
                );

            if (error) throw error;

            res.status(200).json(results);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    getAgentJobs: async (req, res) => {
        const uid = req.params.uid;
        try {
            const { data: agentJobs, error } = await global.supabaseAdmin
                .from('jobs')
                .select('*')
                .eq('agent_id', uid)
                .order('created_at', { ascending: false });

            if (error) throw error;

            res.status(200).json(agentJobs);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }   
    },

    updateJobImage: async (req, res) => {
        const jobId = req.params.id;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: 'imageUrl is required' });
        }

        try {
            const { data: updatedJob, error } = await global.supabaseAdmin
                .from('jobs')
                .update({ imageUrl: imageUrl })
                .eq('id', jobId)
                .select();

            if (error) throw error;

            if (!updatedJob || updatedJob.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Job not found'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Job image updated successfully',
                job: updatedJob[0]
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }   
    },
};