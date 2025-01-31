const mongoose = require("mongoose");

const studentGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
 
});

module.exports = mongoose.model("StudentGroup", studentGroupSchema);
