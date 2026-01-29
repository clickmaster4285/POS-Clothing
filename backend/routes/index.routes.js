
const express = require('express');
const router = express.Router();

const auth = require('./auth.routes');
const branch = require('./branch.routes');



router.use('/auth', auth);
router.use('/branches', branch);

module.exports = router;