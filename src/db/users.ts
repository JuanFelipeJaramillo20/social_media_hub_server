import mongoose from "mongoose";
import { logger } from "../helpers/logger";

export interface Authentication {
  password: string;
  salt: string;
  sessionToken: string;
}

export interface User {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  authentication: Authentication;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("user", userSchema);

export const getUsers = async () => {
  try {
    const users = await UserModel.find();
    logger.info("Fetched users", { count: users.length });
    return users;
  } catch (error) {
    logger.error("Error fetching users", { error });
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    logger.info("Fetched user by email", { email });
    return user;
  } catch (error) {
    logger.error("Error fetching user by email", { email, error });
    throw error;
  }
};

export const getUserByEmailWithCredentials = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email }).select(
      "+authentication.salt +authentication.password"
    );
    logger.info("Fetched user by email", { email });
    return user;
  } catch (error) {
    logger.error("Error fetching user by email", { email, error });
    throw error;
  }
};

export const getUserBySessionToken = async (sessionToken: string) => {
  try {
    const user = await UserModel.findOne({
      "authentication.sessionToken": sessionToken,
    });
    logger.info("Fetched user by session token", { sessionToken });
    return user;
  } catch (error) {
    logger.error("Error fetching user by session token", {
      sessionToken,
      error,
    });
    throw error;
  }
};

export const getUserBySessionTokenWithCredentials = async (
  sessionToken: string
) => {
  try {
    const user = await UserModel.findOne({
      "authentication.sessionToken": sessionToken,
    }).select("+authentication.sessionToken");
    logger.info("Fetched user by session token", { sessionToken });
    return user;
  } catch (error) {
    logger.error("Error fetching user by session token", {
      sessionToken,
      error,
    });
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    logger.info("Fetched user by id", { id });
    return user;
  } catch (error) {
    logger.error("Error fetching user by id", { id, error });
    throw error;
  }
};

export const createUser = async (values: Record<string, any>) => {
  try {
    const user = await new UserModel(values).save();
    logger.info("Created user", { userId: user._id });
    return user.toObject();
  } catch (error) {
    logger.error("Error creating user", { values, error });
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const user = await UserModel.findByIdAndDelete(id);
    logger.info("Deleted user by id", { id });
    return user;
  } catch (error) {
    logger.error("Error deleting user by id", { id, error });
    throw error;
  }
};

export const updateUserById = async (
  id: string,
  values: Record<string, any>
) => {
  try {
    const user = await UserModel.findByIdAndUpdate(id, values, { new: true });
    logger.info("Updated user by id", { id, updatedValues: values });
    return user;
  } catch (error) {
    logger.error("Error updating user by id", { id, values, error });
    throw error;
  }
};
