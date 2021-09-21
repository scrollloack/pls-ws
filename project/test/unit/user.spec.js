"use strict";

const { test } = use("Test/Suite")("User");
const User = use("App/Models/User");
const UserController = make("App/Controllers/Http/UserController");
const Factory = use("Factory");

test("validates credential checker and returns true", async ({ assert }) => {
  const { username, email, password } = await Factory.model(
    "App/Models/User"
  ).make();

  const user = await User.create({
    username,
    email,
    password,
  });

  const data = {
    email: user.email,
    password: password,
  };

  const isUser = await UserController.checkCredentials(data);

  assert.isTrue(isUser);
});

test("validates credential checker and returns false", async ({ assert }) => {
  const { username, email, password } = await Factory.model(
    "App/Models/User"
  ).make();

  const user = await User.create({
    username,
    email,
    password,
  });

  const data = {
    email: user.email,
    password: "asdasdasd",
  };

  const isUser = await UserController.checkCredentials(data);
  assert.isNotTrue(isUser);
});
