import express from "express";

import { getUsers, deleteUserById, getUserById } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
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

    return res.status(200).json(deleteUser);
  } catch (error) {
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

    return res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
