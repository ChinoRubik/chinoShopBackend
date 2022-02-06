'use strict'

const router = require('express').Router()
const controller = require('../controllers/productControllers')
// const multiparty = require('connect-multiparty');
// const dir_uploads = multiparty({uploadDir: './uploads'})
const upload = require('../cloudinary/multer')

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

module.exports = router