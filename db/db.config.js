const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/piyushgargnodejs").then((res) => {
  console.log("mongodb connected").catch((e) => {
    console.log(e);
  });
});
