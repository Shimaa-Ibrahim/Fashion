const Order = require('../models/order');

exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userID: req.userID });
        res.status(200).json({ orders: orders });

    } catch (err) {
        next(err);
    }
}

exports.getUserOrder = async (req, res, next) => {
    try {
        const order = await Order.find({ _id: req.params.id, userID: req.userID });
        res.status(200).json({ order: order });

    } catch (err) {
        next(err);
    }
}


exports.createOrder = async (req, res, next) => {
    let total = 0;
    const { products } = req.body;
    products.forEach(p => {
        total += (p.price * p.quantity);
    });
    try {
        const order = new Order({
            userID: req.userID,
            products,
            total
        });

        const createdOrder = await order.save();
        res.status(200).json({ order: createdOrder });
    } catch (err) {
        next(err);
    }
}



