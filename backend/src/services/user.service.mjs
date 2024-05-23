import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 12,
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});


// Password hashing middleware
UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});


UserSchema.pre('save', function (next) {
    if (this.isNew && this.tokens.length === 0) {
        return next(new Error('Tokens array cannot be empty'));
    }
    next();
});

// Admin validation method
UserSchema.methods.isAdmin = function () {
    return this.admin;
};

// Password comparison method
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error("Failed to compare passwords");
    }
};

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

export async function loginUser(email, password) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = await user.generateAuthToken();
        return { user, token };
    } catch (error) {
        throw new Error('Failed to login');
    }
}

// Create a new user
export async function createUser(userData) {
    try {
        const user = new User(userData);
        const token = await user.generateAuthToken(); // Generate a token for the new user
        await user.save();
        return { user };
    } catch (error) {
        console.log(error)
        throw new Error("Failed to create user");
    }
}

// Get all users
export async function getAllUsers(limit = 20) {
    try {
        const users = await User.find({}).limit(limit);
        const total = await User.countDocuments()
        return { users, total };
    } catch (error) {
        throw new Error("Failed to retrieve users");
    }
}

// Get a user by ID
export async function getUserById(id) {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error("Failed to retrieve user");
    }
}

// Update a user by ID
export async function updateUserById(id, updateFields) {
    try {
        const user = await User.findByIdAndUpdate(id, updateFields, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error("Failed to update user");
    }
}

// Delete a user by ID
export async function deleteUserById(id) {
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        throw new Error("Failed to delete user");
    }
}

export const User = mongoose.model("User", UserSchema);