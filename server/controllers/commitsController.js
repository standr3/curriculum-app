const Commit = require("../models/Commit");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all commits
// @route GET /commits
// @access Private
const getAllCommits = asyncHandler(async (req, res) => {
  // Get all commits from MongoDB
  const commits = await Commit.find().lean();

  // If no commits
  if (!commits?.length) {
    return res.status(400).json({ message: "No commits found" });
  }

  // Add username to each commit before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const commitsWithUser = await Promise.all(
    commits.map(async (commit) => {
      const user = await User.findById(commit.user).lean().exec();
      return { ...commit, username: user.username };
    })
  );

  res.json(commitsWithUser);
});

// @desc Create new commit
// @route POST /commits
// @access Private
const createNewCommit = asyncHandler(async (req, res) => {
  const { user, desc } = req.body;

  // Confirm data
  if (!user || !desc) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // // Check for duplicate title
  // const duplicate = await Commit.findOne({ title }).lean().exec()

  // if (duplicate) {
  //     return res.status(409).json({ message: 'Duplicate commit title' })
  // }

  // Create and store the new user
  const commit = await Commit.create({ user, desc });

  if (commit) {
    // Created
    return res.status(201).json({ message: "New commit created" });
  } else {
    return res.status(400).json({ message: "Invalid commit data received" });
  }
});

// @desc Update a commit
// @route PATCH /commits
// @access Private
const updateCommit = asyncHandler(async (req, res) => {
  const { id, user, desc } = req.body;

  // Confirm data
  if (!id || !user || !desc) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm commit exists to update
  const commit = await Commit.findById(id).exec();

  if (!commit) {
    return res.status(400).json({ message: "Commit not found" });
  }

  // // Check for duplicate title
  // const duplicate = await Commit.findOne({ title }).lean().exec()

  // // Allow renaming of the original commit
  // if (duplicate && duplicate?._id.toString() !== id) {
  //     return res.status(409).json({ message: 'Duplicate commit title' })
  // }

  commit.user = user;
  commit.desc = desc;

  const updatedCommit = await commit.save();

  res.json(`'${updatedCommit.title}' updated`);
});

// @desc Delete a commit
// @route DELETE /commits
// @access Private
const deleteCommit = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Commit ID required" });
  }

  // Confirm commit exists to delete
  const commit = await Commit.findById(id).exec();

  if (!commit) {
    return res.status(400).json({ message: "Commit not found" });
  }

  const result = await commit.deleteOne();

  const reply = `Commit '${result.desc}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllCommits,
  createNewCommit,
  updateCommit,
  deleteCommit,
};
