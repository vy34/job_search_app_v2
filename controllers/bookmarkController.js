module.exports = {
    createBookmark: async (req, res) => {
        const jobId = req.body.job;
        const userId = req.user.id;
        try {
            // Check if job exists
            const { data: job, error: jobError } = await global.supabaseAdmin
                .from('jobs')
                .select('id')
                .eq('id', jobId)
                .single();

            if (jobError || !job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            // Create bookmark
            const { data: newBookmark, error } = await global.supabaseAdmin
                .from('bookmarks')
                .insert({
                    job_id: jobId,
                    user_id: userId
                })
                .select();

            if (error) throw error;

            return res.status(201).json({ 
                status: 'success', 
                bookmarkId: newBookmark[0].id 
            });
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    deleteBookmark: async (req, res) => {
        const bookmarkId = req.params.id;
        try {
            const { error } = await global.supabaseAdmin
                .from('bookmarks')
                .delete()
                .eq('id', bookmarkId);

            if (error) throw error;

            return res.status(200).json({ 
                status: 'success', 
                message: 'Bookmark deleted successfully' 
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getAllBookmark: async (req, res) => {
        const userId = req.user.id;
        try {
            const { data: bookmarks, error } = await global.supabaseAdmin
                .from('bookmarks')
                .select(`
                    id,
                    job_id,
                    created_at,
                    jobs (*)
                `)
                .eq('user_id', userId);

            if (error) throw error;

            res.status(200).json({ bookmarks: bookmarks });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getBookmark: async (req, res) => {
        const jobId = req.params.id;
        const userId = req.user.id;
        try {
            const { data: bookmarks, error } = await global.supabaseAdmin
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .eq('job_id', jobId);

            if (error) throw error;

            if (!bookmarks || bookmarks.length === 0) {
                return res.status(200).json({ status: false, bookmarkId: 'none' });      
            }

            res.status(200).json({ 
                status: true, 
                bookmarkId: bookmarks[0].id 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}