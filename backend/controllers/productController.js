const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//Create Produce -- admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

//Get All Products

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        products,
        productCount,
    });
});

// update Product --Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted",
    });
});

//get product details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({ success: true, product });
});

//create New Review or Update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
    };

    const product = await Product.findById(req.body.productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach(rev=> {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = req.body.rating), (rev.comment = req.body.comment);
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
        
        
    }
    let avg = 0;
        product.ratings = product.reviews.forEach((rev) => {
            avg = avg + rev.rating;
        });

        product.ratings = avg / product.reviews.length;
        console.log(avg)

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

//get all reviews of product

exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)
     if(!product)
     {
        return next(new ErrorHandler("Product not found",404))
     }
     res.status(200).json({
        success:true,
        review:product.reviews
     })
})

//Delete Review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId)
     if(!product)
     {
        return next(new ErrorHandler("Product not found",404))
     }
     
     const reviews=product.reviews.filter( rev=> rev._id.toString()!== req.query.id.toString() );
     console.log(reviews)

     let avg = 0;
       reviews.forEach((rev) => {
            avg = avg + rev.rating;
        });

        const ratings = avg / reviews.length;

        const numOfReviews =reviews.length;

        await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numOfReviews},{
            new:true,
            runValidators:true,
            useFindAndModify:false

        });

     res.status(200).json({
        success:true,
        
     })
})


