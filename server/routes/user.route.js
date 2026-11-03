import express from "express";
import { getCurrentuser } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";

const userRouter = express.Router();
userRouter.get("/currentuser", isAuth, getCurrentuser);

export default userRouter;