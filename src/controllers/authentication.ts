import express from "express";
import {
  createUser,
  getUserByEmailWithCredentials,
  getUserByEmail,
} from "../db/users";
import { authentication, random } from "../helpers";
import { logger } from "../helpers/logger";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmailWithCredentials(email);

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    logger.info("User logged in successfully", {
      email: user.email,
      id: user.id,
    });

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error logging in user", { email: req.body.email });
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(409);
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    logger.info("User created", { user: user });

    return res.status(201).json(user);
  } catch (error) {
    logger.error("Error creating user", { email: req.body.email });
    console.log(error);
    return res.sendStatus(400);
  }
};
