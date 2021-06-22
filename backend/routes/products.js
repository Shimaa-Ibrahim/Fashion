const express = require('express');

const productController = require('../controllers/products');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/add', auth.isAdmin, productController.createProduct);
router.put('/update', auth.isAdmin, productController.updateProduct);
router.patch('/modifyTags', auth.isAdmin, productController.modifyProductTags);
router.delete('/delete/:id', auth.isAdmin, productController.deleteProduct);

module.exports = router;