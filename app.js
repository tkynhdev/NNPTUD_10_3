const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nnptud10';
const port = process.env.PORT || 3000;

mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((error) => {
        console.error('Connection error', error);
        process.exit(1);
    });
