const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resource not found.Invalid:${err.path}`;
        err = new ErrorHandler(message, 404);
    }
    //duplicate Error

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 404);
    }
    //wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web Token is invalid try again`;
        err = new ErrorHandler(message, 404);
    }
    // JWT expire Error
    if (err.name === "TokenExpireError") {
        const message = `Json webToken expired try again`;
        err = new ErrorHandler(message, 404);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
