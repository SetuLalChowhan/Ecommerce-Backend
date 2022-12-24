const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, ItemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        ItemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });
    res.status(201).json({
        success: true,
        order,
    });
});

//get a single Order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});
//get logged in user Orders

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find(req.user._id).populate("user", "name email");

    res.status(200).json({
        success: true,
        orders,
    });
});

//get ALl Orders -- admin

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => (totalAmount += order.totalPrice));

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

//update Order Status --admin

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have deliverd this product", 404));
    }
    order.orderItems.forEach(async (o) => {
        console.log(o.product,o.quantity)
        await updateStock(o.product, o.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveryAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success:true
    })
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    console.log(product)

    product.Stock = product.Stock - quantity;
    await product.save()
}


//Delete Order

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not Found", 404));
    }
    await order.remove();

    res.status(200).json({
        success: true,
    });
});
