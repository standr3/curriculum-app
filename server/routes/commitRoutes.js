const express = require("express");
const router = express.Router();
const commitsController = require("../controllers/commitsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(commitsController.getAllCommits)
  .post(commitsController.createNewCommit)
  .patch(commitsController.updateCommit)
  .delete(commitsController.deleteCommit);

module.exports = router;
