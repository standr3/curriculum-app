const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, role, groupId } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ username }).lean().exec();
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, password, role };
  if (role === "student" && groupId) {
    userObject.groupId = groupId;
  }

  const user = await User.create(userObject);

  if (user) {
    // created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  console.log("req.body: ", req.body);
  const { id, username, role, password, groupId } = req.body;

  if (id && !groupId) {
    // const user = await User.findById(id).exec();
    await User.findByIdAndUpdate(id, { $unset: { groupId: "" } });

    //invalidate
    if (!username && !role && !password)
      return res.json({ message: `Group removed for user ${id}` });
  }

  // Confirm data
  if (!id || !username || !role) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.role = role;

  if (groupId) {
    if (role === "student") {
      user.groupId = groupId;
    } else {
      user.groupId = null; // Remove groupId if not a student
    }
  } else {
    console.log("aici");
    await User.findByIdAndUpdate(user._id, { $unset: { groupId: "" } });
  }

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();
  console.log("updatedUser: ", updatedUser);

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});
module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
