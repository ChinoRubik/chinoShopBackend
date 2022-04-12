'use strict'

const router = require('express').Router()
const controller = require('../controllers/productControllers')
// const multiparty = require('connect-multiparty');
// const dir_uploads = multiparty({uploadDir: './uploads'})
const upload = require('../cloudinary/multer');
const { Router } = require('express');

router.get('/', controller.dashboard);
// router.get('/getShirts', controller.getShirts);
router.post('/add', upload.array('image'), controller.addProduct);
// router.post('/upload-images',dir_uploads , controller.uploadImages);
// router.post('/upload-images', upload.array('image') , controller.uploadImagesToCloudinary);
router.post('/addcategory', controller.addCategory);
router.delete('/deletecategory/:uuid',controller.deleteCategory);
router.post('/addToCart', controller.addToCart);
router.get('/getCart/:uuid', controller.getCart);
router.put('/updateCart/:uuid', controller.updateCart);
router.delete('/deleteFromCart/:product_uuid/:size', controller.deleteFromCart);
router.delete('/deleteProduct/:uuid', controller.deleteProduct);
router.post('/addSize', controller.addSize);
router.get('/getSizes', controller.getSizes);
router.delete('/deleteSize', controller.deleteSize);
router.put('/updateProduct/:uuid',controller.updateProduct);
router.post('/addSale/',controller.addSale);
router.get('/getSale/:user_uuid',controller.getSale);
router.get('/getSaleByUuid/:uuid',controller.getSaleByUuid);
router.put('/updateSale/:uuid',controller.updateSale);
router.delete('/deleteSale/:uuid',controller.deleteSale);
router.post('/addAddress/',controller.addAddress);
router.get('/getAddress/:sale_uuid',controller.getAddress);
router.put('/updateAddress/:sale_uuid',controller.updateAddress);
router.delete('/deleteAllCart/:user_uuid', controller.deleteAllCart);
router.post('/addToFavorites', controller.addToFavorites);
router.delete('/deleteFromFavorites/:uuid', controller.deleteFromFavorites);

module.exports = router