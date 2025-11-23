const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${process.env.PORT || port}`);
});
