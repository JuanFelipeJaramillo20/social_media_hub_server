import { describe, expect, test } from "@jest/globals";
import {
  getUsers,
  getUserByEmail,
  getUserBySessionToken,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
  User,
} from "../src/db/users";
import mongoose from "mongoose";

describe("User database operations", () => {
  let testUser: User;

  beforeEach(async () => {
    await mongoose.connect("");
    testUser = (await createUser({
      username: "testUser",
      email: "test@example.com",
      authentication: {
        password: "testPassword",
        salt: "testSalt",
        sessionToken: "testSessionToken",
      },
    })) as User;
  });

  afterEach(async () => {
    if (testUser._id) {
      await deleteUserById(testUser._id?.toString());
    }
    await mongoose.disconnect();
  });

  test("getUsers should return an array of users", async () => {
    const users = await getUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  test("getUserBySessionToken should return a user with the given session token", async () => {
    const user = await getUserBySessionToken("testSessionToken").select(
      "+authentication.sessionToken"
    );
    console.log("USER FOUND: " + user);

    expect(user).toBeTruthy();
    if (user && user.authentication) {
      expect(user.authentication.sessionToken).toBe("testSessionToken");
    }
  });

  test("getUserByEmail should return a user with the given email", async () => {
    const user = await getUserByEmail("test@example.com");
    expect(user).toBeTruthy();
    if (user) {
      expect(user.email).toBe("test@example.com");
    }
  });

  test("getUserById should return a user with the given id", async () => {
    if (testUser._id) {
      const user = await getUserById(testUser._id.toString());
      expect(user).toBeTruthy();
      if (user) {
        expect(user._id.toString()).toBe(testUser._id.toString());
      }
    }
  });

  test("createUser should create a new user and return it", async () => {
    const newUser = await createUser({
      username: "newUser",
      email: "new@example.com",
      authentication: {
        password: "newPassword",
        salt: "newSalt",
        sessionToken: "newSessionToken",
      },
    });
    expect(newUser).toBeTruthy();
    if (newUser) {
      expect(newUser.username).toBe("newUser");
      expect(newUser.email).toBe("new@example.com");
    }
  });

  test("deleteUserById should delete the user with the given id", async () => {
    if (testUser._id) {
      const deletedUser = await deleteUserById(testUser._id.toString());
      expect(deletedUser).toBeTruthy();
      if (deletedUser) {
        expect(deletedUser._id.toString()).toBe(testUser._id.toString());
      }

      const user = await getUserById(testUser._id.toString());
      expect(user).toBeNull();
    }
  });

  test("updateUserById should update the user with the given id", async () => {
    if (testUser._id) {
      const updatedUser = await updateUserById(testUser._id.toString(), {
        username: "updatedUser",
      });
      console.log("Updated user: " + updatedUser);

      expect(updatedUser).toBeTruthy();
      if (updatedUser) {
        expect(updatedUser.username).toBe("updatedUser");
      }

      const user = await getUserById(testUser._id.toString());
      expect(user).toBeTruthy();
      if (user) {
        expect(user.username).toBe("updatedUser");
      }
    }
  });
});
