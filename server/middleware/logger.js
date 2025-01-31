const { format } = require("date-fns"); //                                      for formatting dates
const { v4: uuid } = require("uuid"); //                                        for generating unique ids
const fs = require("fs"); //                                                    for file system operations
const fsPromises = require("fs").promises; //                                   required for async file operations
const path = require("path");

const logEvents = async (message, logFileName) => {
  // template literal to format the date and time
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  // uuid to generate a unique id for each log entry and tabs for excel import
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      // if the logs directory doesn't exist, create it
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // append the log entry to the log file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// logger middleware
const logger = (req, res, next) => {
  // log the request method, url, and origin
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  // call the next middleware in the stack
  next();
};


module.exports = { logEvents, logger };
