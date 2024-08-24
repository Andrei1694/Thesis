import * as Yup from "yup";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
} from "../services/user.service.mjs";

const createUserSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().min(2, "First name must be at least 2 characters").max(25, "First name must be at most 25 characters").required("First name is required"),
  lastName: Yup.string().min(2, "Last name must be at least 2 characters").max(25, "Last name must be at most 25 characters").required("Last name is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").max(25, "Password must be at most 25 characters").required("Password is required"),
});

const updateUserSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email"),
  firstName: Yup.string().min(2, "First name must be at least 2 characters").max(25, "First name must be at most 25 characters"),
  lastName: Yup.string().min(2, "Last name must be at least 2 characters").max(25, "Last name must be at most 25 characters"),
  password: Yup.string().min(8, "Password must be at least 8 characters").max(25, "Password must be at most 25 characters"),
  active: Yup.boolean(),
});

// Create a new user
export async function registerUserHttp(req, res, next) {
  try {
    const userData = await createUserSchema.validate(req.body, { abortEarly: false });
    userData.admin = false
    const { user, token } = await createUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
}

// Login a user
export async function loginUserHttp(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Logout a user
export async function logoutUserHttp(req, res, next) {
  try {
    const { token, user } = req
    console.log(user)
    console.log(token)
    await logoutUser(user._id, token)
    res.status(200).json({ message: 'Logout succesful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all users
export async function getAllUsersHttp(req, res, next) {
  const { page, limit } = req.pagination
  const { sortBy } = req.query
  const sort = {}
  if (sortBy) {
    const parts = sortBy.split(":")
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    const users = await getAllUsers(page, limit, sort);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

// Get a user by ID
export async function getUserByIdHttp(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
}

// Update a user by ID
export async function updateUserByIdHttp(req, res, next) {
  try {
    const userId = req.params.id;
    const updateFields = await updateUserSchema.validate(req.body, { abortEarly: false });
    if (updateFields.admin) updateFields.admin = false
    const user = await updateUserById(userId, updateFields);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
}

// Delete a user by ID
export async function deleteUserByIdHttp(req, res, next) {
  try {
    const userId = req.params.id;
    await deleteUserById(userId);
    res.sendStatus(204);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
}