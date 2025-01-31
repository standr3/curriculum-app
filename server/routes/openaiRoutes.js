const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

//route
// router.post("/summary", summaryController);
router
  .route("/")
  .post(openaiController.postOpenAI)
module.exports = router;
