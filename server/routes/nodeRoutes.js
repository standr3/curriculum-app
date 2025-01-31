const express = require("express");
const router = express.Router();
const nodesController = require("../controllers/nodesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(nodesController.getAllNodes)
  .post(nodesController.createNewNode)
  .patch(nodesController.updateNode)
  .delete(nodesController.deleteNode);

module.exports = router;
