global.express = require("express");
const app = express();
const bodyParser = require("body-parser");
//database
const db = require("./util/database");
global.dotenv = require("dotenv").config();

//Require Routes
const userRouter = require("./routes/userRoutes");

//using bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//using Routes
app.use(userRouter);

//Start Server and Connect To DataBase
app.listen(3000, () => {
  db.getConnection()
    .then(result => {
      console.log("app is running on port 3000");
      console.log("connected to DB");
    })
    .catch(err => {
      console.log(err);
    });
});
