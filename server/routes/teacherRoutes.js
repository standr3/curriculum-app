const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachersController");
// const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(teachersController.getAllTeachers)
  .post(teachersController.createNewTeacher)
  .patch(teachersController.updateTeacher)
  .delete(teachersController.deleteTeacher);

module.exports = router;
