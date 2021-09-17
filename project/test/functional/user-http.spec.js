"use strict";

const { test, trait } = use("Test/Suite")("User Http");
const User = use("App/Models/User");
const Factory = use("Factory");

trait("Test/ApiClient");

const URL_PATH = "/login";

test("generates admin token via login", async ({ client }) => {
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

  const response = await client.post(URL_PATH).send(data).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    type: response.body.type,
    token: response.body.token,
    refreshToken: null,
  });
});

test("validates login request rules", async ({ client }) => {
  const { username, email, password } = await Factory.model(
    "App/Models/User"
  ).make();

  const user = await User.create({
    username,
    email,
    password,
  });

  let response = await client.post(URL_PATH).send({ password: password }).end();
  response.assertStatus(400);
  response.assertError(loginValidationResponses()[0].data.email_required);

  response = await client
    .post(URL_PATH)
    .send({ email: "asd", password: password })
    .end();
  response.assertStatus(400);
  response.assertError(loginValidationResponses()[0].data.email_email);

  response = await client.post(URL_PATH).send({ email: user.email }).end();
  response.assertStatus(400);
  response.assertError(loginValidationResponses()[0].data.password_required);
});

test("validates bad credentials either email or password", async ({
  client,
}) => {
  const { username, email, password } = await Factory.model(
    "App/Models/User"
  ).make();

  const user = await User.create({
    username,
    email,
    password,
  });

  const data = {
    email: "qweqwe@asd.com",
    password: password,
  };

  let response = await client.post(URL_PATH).send(data).end();
  response.assertStatus(400);
  response.assertError({
    error: "Credentials does not match",
  });

  data.email = user.email;
  data.password = "qweqweqwe";

  response = await client.post(URL_PATH).send(data).end();
  response.assertStatus(400);
  response.assertError({
    error: "Credentials does not match",
  });
});

function loginValidationResponses() {
  return [
    {
      data: {
        email_required: {
          error: [
            {
              message: "Email is required",
              field: "email",
              validation: "required",
            },
          ],
        },
        email_email: {
          error: [
            {
              message: "Email should be an email",
              field: "email",
              validation: "email",
            },
          ],
        },
        password_required: {
          error: [
            {
              message: "Password is required",
              field: "password",
              validation: "required",
            },
          ],
        },
      },
    },
  ];
}
