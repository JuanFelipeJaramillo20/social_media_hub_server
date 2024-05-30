import express from "express";

import { getUsers, deleteUserById, getUserById } from "../db/users";

import { logger } from "../helpers/logger";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    logger.info("Controller: Fetched users", { count: users.length });
    return res.status(200).json(users);
  } catch (error) {
    logger.error("Controller: Error fetching users", { error });
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deleteUser = await deleteUserById(id);
    logger.info("Controller: Deleted user", { id });
    return res.status(200).json(deleteUser);
  } catch (error) {
    logger.error("Controller: Error deleting user", { id: req.params.id });
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    existingUser.username = username;

    existingUser.save();

    logger.info("Controller: Update user successfully updated", { id });

    return res.status(200).json(existingUser);
  } catch (error) {
    logger.error("Controller: Error updating user");
    console.log(error);
    return res.sendStatus(400);
  }
};
