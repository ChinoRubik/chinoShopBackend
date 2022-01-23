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
router.delete('/deletecategory/:uuid',controller.deleteCategory);
router.get('/getProducts',controller.getProducts);
router.get('/detailProduct/:uuid', controller.detailProduct);
router.post('/addToCart', controller.addToCart);
router.get('/getCart/:uuid', controller.getCart);
router.put('/updateCart/:uuid', controller.updateCart);

module.exports = router