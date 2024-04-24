//this file is used to connect to the database using mongoose
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // console.error(`Error: ${error.message}`);
    // process.exit(1);
    console.log(err);
  }
};

module.exports = connectDB;
