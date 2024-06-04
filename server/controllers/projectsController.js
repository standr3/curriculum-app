const Project = require("../models/Project");
const User = require("../models/User");
const StudentGroup = require("../models/StudentGroup");
const asyncHandler = require("express-async-handler");

// @desc Get all projects
// @route GET /projects
// @access Private
const getAllProjects = asyncHandler(async (req, res) => {
  // Get all projects from MongoDB
  const projects = await Project.find().lean();

  // If no projects
  if (!projects?.length) {
    return res.status(400).json({ message: "No projects found" });
  }

  // Add username to each project before sending the response
  // You could also do this with a for...of loop
  const projectsWithOwnerAndGroup = await Promise.all(
    projects.map(async (project) => {
      const owner = await User.findById(project.ownerId).lean().exec();
      const group = await StudentGroup.findById(project.groupId).lean().exec();
      return {
        ...project,
        ownername: owner.username,
        groupname: group ? group.name : null,
      };
    })
  );

  res.json(projectsWithOwnerAndGroup);
});

// @desc Create new project
// @route POST /projects
// @access Private
const createNewProject = asyncHandler(async (req, res) => {
  const { ownerId, title, groupId } = req.body;

  // Confirm data
  if (!ownerId || !title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const project = groupId
    ? await Project.create({ ownerId, title, groupId })
    : await Project.create({ ownerId, title });

  if (project) {
    // Created
    return res.status(201).json({ message: "New project created" });
  } else {
    return res.status(400).json({ message: "Invalid project data received" });
  }
});

// @desc Update a project
// @route PATCH /projects
// @access Private
const updateProject = asyncHandler(async (req, res) => {
  const { id, ownerId, groupId, title, nodes, links } = req.body;

  // Confirm data
  if (!id || !ownerId || !title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm project exists to update
  const project = await Project.findById(id).exec();

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  project.ownerId = ownerId;
  project.title = title;
  project.groupId = groupId;
  project.nodes = nodes;
  project.links = links;

  const updatedProject = await project.save();

  res.json(`'${updatedProject.title}' updated`);
});

// @desc Delete a project
// @route DELETE /projects
// @access Private
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Project ID required" });
  }

  // Confirm project exists to delete
  const project = await Project.findById(id).exec();

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  const result = await project.deleteOne();

  const reply = `Project '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllProjects,
  createNewProject,
  updateProject,
  deleteProject,
};
