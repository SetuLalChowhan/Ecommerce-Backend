const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connection = require("./config/database");
mongoose.set("strictQuery", true);

// handling Uncaught Exception

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });
connection();
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//unhandle Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to Unhandle Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});

