const express = require('express');
const AuthRoute = require('./AuthRoute');
const TicketRoute = require('./TicketRoute');
const NotesRoute = require('./NotesRoute');
const UserRoute = require('./UserRoute');

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/user', UserRoute)
router.use('/ticket', TicketRoute);
router.use('/notes', NotesRoute);

module.exports = router;