const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path')
const AllRoutes = require('./Routes/index');
const port = process.env.PORT || 8000;
const server = express();



server.use(cors());
server.use(express.json());
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.mongodbConnection)
    .then(() => console.log('connection Established'))
    .catch((err) => console.log(err))
server.get('/', (req, res) => {
    res.send("Debasish")
})

server.use('/api', AllRoutes);

server.listen(port, () => {
    console.log(`server listening on port number ${port}`);

})