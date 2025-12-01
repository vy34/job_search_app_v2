const express = require('express');
const app = express();
const port = 5003;
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const bookmarkRoutes = require('./routes/bookmark');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser')

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

global.supabase = createClient(supabaseUrl, supabaseKey);
global.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

console.log('Connected to Supabase');

// Increase body size limit to handle base64 encoded images (compressed)
// Compressed images typically 2-5MB, safe limit is 20MB
app.use(bodyParser.json({ limit: '20mb', strict: false }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// Log all requests
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.path}`);
//   next();
// });

app.use('/api/jobs', jobRoutes);
app.use('/api/', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT || port, '0.0.0.0',() => {
  console.log(`Example app listening on port ${process.env.PORT || port}`);
});
