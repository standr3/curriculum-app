const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "student",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentGroup",
  },
});

module.exports = mongoose.model("User", userSchema);
