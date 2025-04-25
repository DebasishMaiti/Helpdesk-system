const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path')
const AllRoutes = require('./Routes/index');
const port = process.env.PORT || 8000;
const server = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://helpdesk-system-pi.vercel.app'
];

server.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


server.use(express.json());
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://maitidebasish2001:MYWOzpHZ0tlulz5X@cluster0.dnox1rz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('connection Established'))
    .catch((err) => console.log(err))
server.get('/', (req, res) => {
    res.send("Debasish")
})

server.use('/api', AllRoutes);

server.listen(port, () => {
    console.log(`server listening on port number ${port}`);

})