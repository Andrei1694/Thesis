import express from "express";
import {
  registerUserHttp,
  getAllUsersHttp,
  getUserByIdHttp,
  updateUserByIdHttp,
  deleteUserByIdHttp,
} from "../controllers/user.controller.mjs";
import { auth } from "../utils/middlewares.mjs";

const userRouter = express.Router();

// Create a new user
userRouter.post("/", registerUserHttp);

// Get all users
userRouter.get("/", auth, getAllUsersHttp);

// Get a user by ID
userRouter.get("/:id", getUserByIdHttp);

// Update a user by ID
userRouter.put("/:id", updateUserByIdHttp);

// Delete a user by ID
userRouter.delete("/:id", deleteUserByIdHttp);

export default userRouter;