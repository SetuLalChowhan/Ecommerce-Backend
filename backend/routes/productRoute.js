const express = require("express");
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview,
} = require("../controllers/productController");

const{authorizeRoles,isAuthenticated} = require("../middleware/auth");
const { route } = require("./userRoute");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticated,
    authorizeRoles('admin'),createProduct);
router.route("/product/:id").put(isAuthenticated,authorizeRoles('admin'),updateProduct).delete(isAuthenticated,authorizeRoles('admin'),deleteProduct)

router.route('/product/:id').get(getProductDetails)

router.route('/review').put(isAuthenticated,createProductReview)

router.route('/reviews').get(getProductReviews).delete(isAuthenticated,deleteReview)

module.exports = router;
