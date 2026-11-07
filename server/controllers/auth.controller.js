import UserModel from "../models/user.model.js";
import { getToken } from "../utils/token.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({ name, email });
    }
    const token = await getToken(user._id);
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};