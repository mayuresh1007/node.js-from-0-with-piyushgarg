const fs = require("fs");

function LogTheReq(filename) {
  //log all req
  return (req, res, next) => {
    const reqests = `${Date.now() + " " + req.method + req.path} \n`;
    fs.appendFile(filename, reqests, (err, result) => {
      if (err) return res.send(err.message);
      else {
        // console.log(result, "done logging");
        next();
      }
    });
  };
}

module.exports = { LogTheReq };
