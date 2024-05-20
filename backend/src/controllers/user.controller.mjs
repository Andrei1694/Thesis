import {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} from "../services/user.service.mjs"

// Create a new user
export async function registerUserHttp(req, res, next) {
  try {
    const userData = req.body;
    const user = await UserService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

// Get all users
export async function getAllUsersHttp(req, res, next) {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

// Get a user by ID
export async function getUserByIdHttp(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await UserService.getUserById(userId);
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
    const updateFields = req.body;
    const user = await UserService.updateUserById(userId, updateFields);
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
    await UserService.deleteUserById(userId);
    res.sendStatus(204);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
}