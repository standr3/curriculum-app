const { json } = require("express");
const StudentGroup = require("../models/StudentGroup");
const Project = require("../models/Project");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");

// Controller for getting all student groups
const getAllGroups = asyncHandler(async (req, res) => {
  const groups = await StudentGroup.find().lean();

  if (!groups?.length) {
    return res.status(400).json({ message: "No groups found" });
  }

  const groupsWithStudents = await Promise.all(groups.map(async (group) => {
    const students = await User.find({ groupId: group._id }).select('_id').lean();
    return {
      ...group,
      studentIds: students.map(student => student._id)
    };
  }));

  res.json(groupsWithStudents);
});

// Controller for creating a new student group
const createNewGroup = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newGroup = await StudentGroup.create({ name });

  if (newGroup) {
    return res.status(201).json({ message: `New group ${name} created` });
  } else {
    return res.status(400).json({ message: "Invalid group data received" });
  }
});

// Controller for updating a student group
const updateGroup = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "ID and name are required" });
  }

  const updatedGroup = await StudentGroup.findById(id).exec();

  if (!updatedGroup) {
    return res.status(404).json({ message: "Group not found" });
  }

  const duplicate = await StudentGroup.findOne({ name }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate group name" });
  }

  updatedGroup.name = name;

  const savedGroup = await updatedGroup.save();
  res.json({ message: `${savedGroup.name} updated` });
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Group ID required" });
  }

  const group = await StudentGroup.findById(id).exec();

  if (!group) {
    return res.status(400).json({ message: "Group not found" });
  }

  // Check if group is assigned to any users
  const users = await User.find({ groupId: id }).lean().exec();
  // If group is assigned to any users, unset groupId field
  if (users?.length) {
    users.forEach(async (user) => {
      await User.findByIdAndUpdate(user._id, { $unset: { groupId: "" } });
    });
  }

  // Check if group is assigned to any projects
  const projects = await Project.find({ groupId: id }).lean().exec();
  // If group is assigned to any projects, unset groupId field
  if (projects?.length) {
    projects.forEach(async (project) => {
      await Project.findByIdAndUpdate(project._id, { $unset: { groupId: "" } });
    });
  }

  const result = await group.deleteOne();
  const reply = `Group ${group.name} with ID ${group._id} deleted`;
  res.json(reply);
});


module.exports = {
  getAllGroups,
  createNewGroup,
  updateGroup,
  deleteGroup,
};
