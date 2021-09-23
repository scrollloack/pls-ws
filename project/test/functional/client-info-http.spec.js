"use strict";

const { test, trait } = use("Test/Suite")("Client Info Http");
const ClientInfo = use("App/Models/ClientInfo");
const Factory = use("Factory");
const TestHelper = use("/TestHelper");

trait("Test/ApiClient");
trait("Session/Client");

const URL_PATH = "/client-info";

test("it should validate lists ClientInfo rules", async ({ client }) => {
  const data = await TestHelper.clientInfoPayloadProvider();

  await Factory.model("App/Models/ClientInfo").create(data);

  const pageFilterResopnse = await client
    .get(URL_PATH)
    .send(TestHelper.listFilters().pageFilter)
    .end();

  pageFilterResopnse.assertStatus(422);

  const perPageFilterResopnse = await client
    .get(URL_PATH)
    .send(TestHelper.listFilters().perPageFilter)
    .end();

  perPageFilterResopnse.assertStatus(422);

  const orderByFilterResopnse = await client
    .get(URL_PATH)
    .send(TestHelper.listFilters().orderByFilter)
    .end();

  orderByFilterResopnse.assertStatus(422);

  const sortByFilterResopnse = await client
    .get(URL_PATH)
    .send(TestHelper.listFilters().sortByFilter)
    .end();

  sortByFilterResopnse.assertStatus(422);
});

test("it should lists all ClientInfo", async ({ client }) => {
  const data = await TestHelper.clientInfoPayloadProvider();

  await Factory.model("App/Models/ClientInfo").create(data);

  const response = await client.get(URL_PATH).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        attributes: data,
      },
    ],
  });
});

test("it should validate list ClientInfo by id", async ({ client }) => {
  const data = await TestHelper.clientInfoPayloadProvider();

  await Factory.model("App/Models/ClientInfo").create(data);

  const requiredResponse = await client.get(`${URL_PATH}/""`).end();

  requiredResponse.assertStatus(422);

  const numberResponse = await client.get(`${URL_PATH}/aaa`).end();

  numberResponse.assertStatus(422);
});

test("it should list ClientInfo by id", async ({ client }) => {
  const data = await TestHelper.clientInfoPayloadProvider();

  const clientInfo = await Factory.model("App/Models/ClientInfo").create(data);

  const response = await client.get(`${URL_PATH}/${clientInfo.id}`).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      attributes: data,
    },
  });
});

test("it should validate create ClientInfo rules", async ({ client }) => {
  const requiredData = {
    car_size: "",
    car_color: "",
    plate_number: "",
  };

  const requiredResponse = await client.post(URL_PATH).send(requiredData).end();

  requiredResponse.assertStatus(422);

  const stringData = {
    car_size: 0,
    car_color: 1,
    plate_number: 1,
  };

  const stringResponse = await client.post(URL_PATH).send(stringData).end();

  stringResponse.assertStatus(422);

  const numberData = {
    car_size: "ASD",
    car_color: "blue",
    plate_number: "AAA-111",
  };

  const numberResponse = await client.post(URL_PATH).send(numberData).end();

  numberResponse.assertStatus(422);
});

test("it should create ClientInfo", async ({ client }) => {
  const data = TestHelper.clientInfoPayloadProvider();

  const response = await client.post(URL_PATH).send(data).end();

  response.assertStatus(201);
  response.assertJSONSubset({
    data: {
      attributes: data,
    },
  });
});

test("it should validate update ClientInfo by id", async ({ client }) => {
  const data = await TestHelper.clientInfoPayloadProvider();

  const clientInfo = await Factory.model("App/Models/ClientInfo").create(data);

  const requiredData = {
    car_size: "",
    car_color: "",
    plate_number: "",
  };

  const requiredResponse = await client
    .put(`${URL_PATH}/${clientInfo.id}`)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const stringData = {
    car_size: 0,
    car_color: 1,
    plate_number: 1,
  };

  const stringResponse = await client
    .put(`${URL_PATH}/${clientInfo.id}`)
    .send(stringData)
    .end();

  stringResponse.assertStatus(422);

  const numberData = {
    car_size: "ASD",
    car_color: "blue",
    plate_number: "AAA-111",
  };

  const numberResponse = await client
    .put(`${URL_PATH}/${clientInfo.id}`)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should update ClientInfo", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.clientInfoPayloadProvider();

  const clientInfo = await Factory.model("App/Models/ClientInfo").create(data);

  const updatedData = TestHelper.clientInfoPayloadProvider();

  const response = await client
    .put(`${URL_PATH}/${clientInfo.id}`)
    .send(updatedData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      attributes: updatedData,
    },
  });
});

test("it should validate delete ClientInfo by id", async ({ client }) => {
  const createdData = await TestHelper.clientInfoPayloadProvider();

  const clientInfo = await Factory.model("App/Models/ClientInfo").create(
    createdData
  );

  const findClientInfoResponse = await client
    .get(`${URL_PATH}/${clientInfo.id}`)
    .end();

  findClientInfoResponse.assertStatus(200);

  const requiredDeleteResponse = await client.delete(`${URL_PATH}/""`).end();

  requiredDeleteResponse.assertStatus(422);

  const numberDeleteResponse = await client.delete(`${URL_PATH}/aaaaa`).end();

  numberDeleteResponse.assertStatus(422);
});

test("it should delete ClientInfo", async ({ client }) => {
  const token = await TestHelper.getToken();

  const createdData = await TestHelper.clientInfoPayloadProvider();

  const clientInfo = await Factory.model("App/Models/ClientInfo").create(
    createdData
  );

  const findClientInfoResponse = await client
    .get(`${URL_PATH}/${clientInfo.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  findClientInfoResponse.assertStatus(200);

  const deleteClientInfoResponse = await client
    .delete(`${URL_PATH}/${clientInfo.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  deleteClientInfoResponse.assertStatus(202);
});
