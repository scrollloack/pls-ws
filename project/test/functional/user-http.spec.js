"use strict";

const { test, trait } = use("Test/Suite")("User Http");
const User = use("App/Models/User");
const Factory = use("Factory");
const faker = use("faker");

trait("Test/ApiClient");

const URL_PATH = "/login";

test("it should generate admin token via login", async ({ client }) => {
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
    token: response.body.token,
  });
});

test("it should validate login request rules", async ({ client }) => {
  const { username, email, password } = await Factory.model(
    "App/Models/User"
  ).make();

  const user = await User.create({
    username,
    email,
    password,
  });

  let response = await client.post(URL_PATH).send({ password: password }).end();
  response.assertStatus(422);
  response.assertError(loginValidationResponses()[0].data.email_required);

  response = await client
    .post(URL_PATH)
    .send({ email: "asd", password: password })
    .end();
  response.assertStatus(422);
  response.assertError(loginValidationResponses()[0].data.email_email);

  response = await client.post(URL_PATH).send({ email: user.email }).end();
  response.assertStatus(422);
  response.assertError(loginValidationResponses()[0].data.password_required);
});

test("it should validate bad credentials either email or password", async ({
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
    email: user.email,
    password: faker.internet.password(),
  };

  let response = await client.post(URL_PATH).send(data).end();
  response.assertStatus(400);
  response.assertError({
    error: "Credentials does not match",
  });

  data.email = "asdqwe@qwe.com";
  data.password = password;

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
