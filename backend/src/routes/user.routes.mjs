import express from "express";
import {
  registerUserHttp,
  getAllUsersHttp,
  getUserByIdHttp,
  updateUserByIdHttp,
  deleteUserByIdHttp,
  loginUserHttp,
  logoutUserHttp,
} from "../controllers/user.controller.mjs";
import { auth } from "../utils/middlewares.mjs";

const userRouter = express.Router();

// Create a new user
userRouter.post("/register", registerUserHttp);

// Create a new user
userRouter.post("/login", loginUserHttp);


// Create a new user
userRouter.get("/logout", auth, logoutUserHttp);

// Get all users
userRouter.get("/", auth, getAllUsersHttp);

// Get a user by ID
userRouter.get("/:id", auth, getUserByIdHttp);

// Update a user by ID
userRouter.put("/:id", auth, updateUserByIdHttp);

// Delete a user by ID
userRouter.delete("/:id", auth, deleteUserByIdHttp);

export default userRouter;