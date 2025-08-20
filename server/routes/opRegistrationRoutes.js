// server/routes/opRegistrationRoutes.js

const express = require('express');
const router = express.Router();
const { opRegisterController } = require('../controllers/opController');

// Define route
router.post('/register', opRegisterController); // Pass function, not object

module.exports = router;
