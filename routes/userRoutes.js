'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')

router.put('/updateUser/:uuid', controller.updateUser);

module.exports = router;