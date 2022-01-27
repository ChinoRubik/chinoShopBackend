
const router = require('express').Router()
const controller = require('../controllers/productControllerPublic')

router.get('/getProducts',controller.getProducts);
router.get('/detailProduct/:uuid', controller.detailProduct);
router.get('/getcategories',controller.getCategories);


module.exports = router