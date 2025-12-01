const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

module.exports = {
    createUser: async (req, res) => {
        const user = req.body;
        try {
            // Check if user already exists in Supabase auth
            const { data: existingAuth, error: authError } = await global.supabaseAdmin.auth.admin.listUsers();
            const userExists = existingAuth?.users?.some(u => u.email === user.email);

            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create user in Supabase Auth
            const { data: { user: authUser }, error: createAuthError } = await global.supabaseAdmin.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true
            });

            if (createAuthError) throw createAuthError;

            // Create user profile in Supabase database
            const { data: newUser, error: dbError } = await global.supabaseAdmin
                .from('users')
                .insert({
                    id: authUser.id,
                    email: user.email,
                    username: user.username,
                    role: user.role || 'user',
                    is_agent: user.isAgent || false,
                    is_admin: user.isAdmin || false
                })
                .select();

            if (dbError) throw dbError;

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({ message: error.message || 'Error creating user' });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Sign in with Supabase auth
            const { data: { user: authUser, session }, error: signInError } = await global.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (signInError || !authUser) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Get user profile
            const { data: userProfile, error: profileError } = await global.supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profileError || !userProfile) {
                return res.status(401).json({ message: 'User profile not found' });
            }

            // Create JWT token
            const userToken = jwt.sign({
                id: authUser.id,
                email: authUser.email,
                isAdmin: userProfile.is_admin,
                isAgent: userProfile.is_agent
            }, process.env.JWT_SECRET, { expiresIn: '21d' });

            res.status(200).json({ 
                id: userProfile.id,
                email: userProfile.email,
                username: userProfile.username,
                isAgent: userProfile.is_agent,
                isAdmin: userProfile.is_admin,
                userToken, 
                message: 'Login successful' 
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: error.message || 'Login failed' });
        }
    },
};