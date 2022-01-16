'use strict'

const router = require('express').Router()
const controller = require('../controllers/productControllers')
const multiparty = require('connect-multiparty');
const dir_uploads = multiparty({uploadDir: './uploads'})

router.get('/', controller.dashboard);
// router.get('/getShirts', controller.getShirts);
router.post('/add', controller.addProduct);
router.post('/upload-images',dir_uploads , controller.uploadImages);
router.post('/addcategory', controller.addCategory);
router.get('/getcategories',controller.getCategories);
router.delete('/deletecategory',controller.deleteCategory);

module.exports = router