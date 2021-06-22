const express = require('express');

const orderController = require('../controllers/orders');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth.isAuth, orderController.getUserOrders);
router.get('/:id', auth.isAuth, orderController.getUserOrder);
router.post('/create', auth.isAuth, orderController.createOrder);

module.exports = router;