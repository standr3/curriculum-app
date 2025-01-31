const { logEvents } = require("./logger"); //                                   for logging events

// error handler middleware
const errorHandler = (err, req, res, next) => {
  // log the error message, method, url, and origin
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(err.stack);

  // set the status code to the error status code or 500
  const status = res.statusCode ? res.statusCode : 500; // server error
  // set the status code
  res.status(status);
  // send the error message as json
  res.json({ message: err.message });
};

module.exports = errorHandler;
