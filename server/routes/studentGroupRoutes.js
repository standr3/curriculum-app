const express = require("express");
const router = express.Router();
const studentGroupsController = require("../controllers/studentGroupsController");
// const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(studentGroupsController.getAllGroups)
  .post(studentGroupsController.createNewGroup)
  .patch(studentGroupsController.updateGroup)
  .delete(studentGroupsController.deleteGroup);

module.exports = router;
