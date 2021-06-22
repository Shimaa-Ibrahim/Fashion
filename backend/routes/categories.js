const express = require('express');

const auth = require('../middleware/auth');
const categoryController = require('../controllers/categories');

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post('/addCategory', auth.isAdmin, categoryController.addCategory);
router.post('/addSubCategory', auth.isAdmin, categoryController.addSubCategory);
router.put('/update', auth.isAdmin, categoryController.updateCategory);
router.delete('/delete/:id', auth.isAdmin, categoryController.removeCategory);


module.exports = router;