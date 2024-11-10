const express = require("express");
const connectToDb = require("./config/connectToDb");
require("dotenv").config();
//connetion to mongoDb
connectToDb();

//INIT App
const app = express();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", require("./routes/authRoute"));

//running the server

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
