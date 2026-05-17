const express = require('express');
const router = express.Router();
const { loginUser, syncEntraIdUser } = require('../controllers/auth.controller');

router.post('/login', loginUser);
router.post('/sync-entra', syncEntraIdUser);

module.exports = router;
