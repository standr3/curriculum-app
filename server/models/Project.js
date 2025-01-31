const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    default: null,
  },
  priority: {
    type: Number,
    required: true,
  },
});

const linkSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: null,
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Node",
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Node",
  },
});

const projectSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "StudentGroup",
  },

  nodes: [nodeSchema],
  links: [linkSchema],
  commits: [
    {
      type: String,
    },
  ],

  //  dict of string keys and values
  grades: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
