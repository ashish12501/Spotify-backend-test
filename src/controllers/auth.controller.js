import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

async function registerUser(req, res) {
  const { username, email, password, role = "user" } = req.body;
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  console.log("isUser", isUserAlreadyExist);
  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "user already exists",
    });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
  });
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(201).json({
    message: "user registered successfully",
    user: {
      username: user.username,
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  return res.status(200).json({
    message: "user logged in successfully",
    user: {
      username: user.username,
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
}

export default { registerUser, loginUser };
