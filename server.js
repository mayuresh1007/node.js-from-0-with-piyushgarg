const express = require("express");

const { ConnectToDb } = require("./db/db.config");
const UserRouter = require("./routes/userRoutes");
const {LogTheReq} = require('./middlewares')
const app = express();
const port = 8000;


//connection
ConnectToDb("mongodb://localhost:27017/piyushgargnodejs"); //async function


//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(LogTheReq('newlogfile.txt')) // normal function which return

//routes
app.use("/api/users", UserRouter); //



//app running listening at
app.listen(port, () => {
  console.log("app is running on port");
});
