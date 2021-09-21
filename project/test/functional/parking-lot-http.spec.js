"use strict";

const { test, trait } = use("Test/Suite")("Parking Lot Http");
const ParkingLot = use("App/Models/ParkingLot");
const User = use("App/Models/User");
const Factory = use("Factory");
const TestHelper = use("/TestHelper");
const faker = use("faker");

trait("Test/ApiClient");
trait("Session/Client");

const URL_PATH = "/parking-lots";

test("it should validate jwt token access", async ({ client }) => {
  const response = await client.get(URL_PATH).end();

  response.assertStatus(401);
  response.assertJSONSubset({
    error: "No token found in the request",
  });
});

test("it should validate lists ParkingLot rules", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingLotPayloadProvider();

  await Factory.model("App/Models/ParkingLot").create(data);

  const pageFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(listFilters().pageFilter)
    .end();

  pageFilterResopnse.assertStatus(422);

  const perPageFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(listFilters().perPageFilter)
    .end();

  perPageFilterResopnse.assertStatus(422);

  const orderByFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(listFilters().orderByFilter)
    .end();

  orderByFilterResopnse.assertStatus(422);

  const sortByFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(listFilters().sortByFilter)
    .end();

  sortByFilterResopnse.assertStatus(422);
});

function listFilters() {
  return {
    pageFilter: {
      page: "asd",
      per_page: 10,
      order_by: "created_at",
      sort_by: "asc",
    },
    perPageFilter: {
      page: 1,
      per_page: "asd",
      order_by: "created_at",
      sort_by: "asc",
    },
    orderByFilter: {
      page: 1,
      per_page: 10,
      order_by: "asd",
      sort_by: "asc",
    },
    sortByFilter: {
      page: 1,
      per_page: 10,
      order_by: "created_at",
      sort_by: "asd",
    },
  };
}

test("it should lists all ParkingLot", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingLotPayloadProvider();

  await Factory.model("App/Models/ParkingLot").create(data);

  const response = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        attributes: data,
      },
    ],
  });
});

test("it should validate list ParkingLot by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingLotPayloadProvider();

  await Factory.model("App/Models/ParkingLot").create(data);

  const requiredResponse = await client
    .get(`${URL_PATH}/""`)
    .header("Authorization", "Bearer " + token)
    .end();

  requiredResponse.assertStatus(422);

  const numberResponse = await client
    .get(`${URL_PATH}/aaa`)
    .header("Authorization", "Bearer " + token)
    .end();

  numberResponse.assertStatus(422);
});

test("it should list ParkingLot by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(data);

  const response = await client
    .get(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      attributes: data,
    },
  });
});

test("it should validate create ParkingLot rules", async ({ client }) => {
  const token = await TestHelper.getToken();

  const requiredData = {
    description: "",
    entry_point: "",
    size: "",
    max_occupants: "",
  };

  const requiredResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const stringData = {
    description: 1,
    entry_point: 1,
    size: 0,
    max_occupants: 6,
  };

  const stringResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(stringData)
    .end();

  stringResponse.assertStatus(422);

  const numberData = {
    description: "SP",
    entry_point: "A",
    size: "asdasd",
    max_occupants: "asdasd",
  };

  const numberResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should create ParkingLot", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = TestHelper.parkingLotPayloadProvider();

  const response = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(data)
    .end();

  response.assertStatus(201);
  response.assertJSONSubset({
    data: {
      attributes: data,
    },
  });
});

test("it should validate update ParkingLot", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(data);

  const requiredData = {
    description: "",
    entry_point: "",
    size: "",
    max_occupants: "",
  };

  const requiredResponse = await client
    .put(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const stringData = {
    description: 1,
    entry_point: 1,
    size: 0,
    max_occupants: 6,
  };

  const stringResponse = await client
    .put(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .send(stringData)
    .end();

  stringResponse.assertStatus(422);

  const numberData = {
    description: "SP",
    entry_point: "A",
    size: "asdasd",
    max_occupants: "asdasd",
  };

  const numberResponse = await client
    .put(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should update ParkingLot", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(data);

  const updatedData = TestHelper.parkingLotPayloadProvider();

  const response = await client
    .put(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .send(updatedData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      attributes: updatedData,
    },
  });
});

test("it should validate delete ParkingLot by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const createdData = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    createdData
  );

  const findParkingLotResponse = await client
    .get(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  findParkingLotResponse.assertStatus(200);

  const requiredDeleteResponse = await client
    .delete(`${URL_PATH}/""`)
    .header("Authorization", "Bearer " + token)
    .end();

  requiredDeleteResponse.assertStatus(422);

  const numberDeleteResponse = await client
    .delete(`${URL_PATH}/aaaaa`)
    .header("Authorization", "Bearer " + token)
    .end();

  numberDeleteResponse.assertStatus(422);
});

test("it should delete Parking Lot", async ({ client }) => {
  const token = await TestHelper.getToken();

  const createdData = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    createdData
  );

  const findParkingLotResponse = await client
    .get(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  findParkingLotResponse.assertStatus(200);

  const deleteParkingLotResponse = await client
    .delete(`${URL_PATH}/${parkingLot.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  deleteParkingLotResponse.assertStatus(202);
});
