'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/authControllers')

// router.get('/testing', controller.test)
// router.get('/users', controller.getUsers)
router.post('/login', controller.login)
router.post('/register', controller.register)
router.get('/getImages/:image',controller.getImages);

// router.delete('/delete/:id', controller.deleteUser)
// router.put('/update/:id', controller.updateUser)

module.exports = router;