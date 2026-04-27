//actual logic for register, login, token refresh, and logout.
//see it

import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

//takes userID and return 2 TOKENS

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        const { accessToken, refreshToken } = generateTokens(user._id);

        await User.findByIdAndUpdate(user._id, { refreshToken });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ accessToken, user: { id: user._id, name: user.name, email: user.email, balance: user.balance } });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = generateTokens(user._id);
        await User.findByIdAndUpdate(user._id, { refreshToken });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, balance: user.balance } });
    }
    catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshAccessToken = async(req,res) =>{
    const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return res.status(403).json({ message: "Invalid token" });
    const { accessToken } = generateTokens(user._id);
    res.json({ accessToken });
  }
  catch {
    res.status(403).json({ message: "Token expired" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};