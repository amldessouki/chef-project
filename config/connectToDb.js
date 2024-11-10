const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoDb ^_^");
  } catch (error) {
    console.log("connection failed to mongoDb!,error");
  }
};
