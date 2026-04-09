const mongoose = require("mongoose");

async function ConnectToDb(url) {
  return mongoose
    .connect(url)
    .then((res) => console.log("mongodb connected"))
    .catch((e) => {
      console.log(e);
    });
}

module.exports = { ConnectToDb };
