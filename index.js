const express = require('express');
const app = express();
const port = 5003;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const bodyParser = require('body-parser')


dotenv.config();

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/jobs', jobRoutes);

app.use('/api/', authRoutes);

app.listen(process.env.PORT || port, '0.0.0.0',() => {
  console.log(`Example app listening on port ${process.env.PORT || port}`);
});
