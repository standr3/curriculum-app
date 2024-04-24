const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser"); 
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;


app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
// in order to parse cookies that we receive 
app.use(cookieParser()); 

app.use("/", express.static(path.join(__dirname, "/public")));
// use the root route
app.use("/", require("./routes/root"));

// the catch all route
app.all("*", (req, res) => {
  // if we got here, the request is for a route that doesn't exist
  // HTTP status 404: Not Found
  res.status(404);
  if (req.accepts("html")) {
    // if the client accepts html then send the 404.html file
    // send and route to the 404.html file
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    // if a json request wasn't made routed properly
    // then send a json response
    res.json({ message: "404 Not Found" });
  } else {
    // if the client doesn't accept html or json
    // send a plain text response
    res.type("txt").send("404 Not Found");
  }
});


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
