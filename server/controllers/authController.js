const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Register
// @route POST /auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { fullname, username, password, role, groupId } = req.body;

  if (!fullname || !username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if role is either 'student' or 'teacher'
  if (role !== "student" && role !== "teacher") {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    return res.status(409).json({ message: "Username already taken" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save the new user
  const userObject = { fullname, username,  password: hashedPassword, role };
  if (role === "student" && groupId) {
    userObject.groupId = groupId;
  }

  const newUser = new User(userObject);

  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
});


// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  console.log("login");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec();
  console.log(foundUser);
  // if (!foundUser || !foundUser.active) {
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  // const match = true;

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        fullname: foundUser.fullname,
        username: foundUser.username,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and role
  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            fullname: foundUser.fullname,
            username: foundUser.username,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};