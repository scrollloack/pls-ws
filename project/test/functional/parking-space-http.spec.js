"use strict";

const { test, trait } = use("Test/Suite")("Parking Space Http");
const ParkingSpace = use("App/Models/ParkingSpace");
const User = use("App/Models/User");
const Factory = use("Factory");
const TestHelper = use("/TestHelper");
const faker = use("faker");

trait("Test/ApiClient");
trait("Session/Client");

const URL_PATH = "/parking-space";

test("it should validate jwt token access", async ({ client }) => {
  const response = await client.get(URL_PATH).end();

  response.assertStatus(401);
  response.assertJSONSubset({
    error: "No token found in the request",
  });
});

test("it should validate lists ParkingSpace rules", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingSpacePayloadProvider();

  await Factory.model("App/Models/ParkingSpace").create(data);

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

test("it should list ParkingSpace", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingSpacePayloadProvider();

  await Factory.model("App/Models/ParkingSpace").create(data);

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

test("it should validate list ParkingSpace by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingSpacePayloadProvider();

  await Factory.model("App/Models/ParkingSpace").create(data);

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

  const data = await TestHelper.parkingSpacePayloadProvider();

  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    data
  );

  const response = await client
    .get(`${URL_PATH}/${parkingSpace.id}`)
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
    parking_lot_id: "",
    space_number: "",
  };

  const requiredResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const numberData = {
    parking_lot_id: "asd",
    space_number: "qwe",
  };

  const numberResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should create ParkingSpace", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = TestHelper.parkingSpacePayloadProvider();

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

test("it should validate update ParkingSpace by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingSpacePayloadProvider();

  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    data
  );

  const requiredData = {
    parking_lot_id: "",
    space_number: "",
  };

  const requiredResponse = await client
    .put(`${URL_PATH}/${parkingSpace.id}`)
    .header("Authorization", "Bearer " + token)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const numberData = {
    parking_lot_id: "asd",
    space_number: "qwe",
  };

  const numberResponse = await client
    .put(`${URL_PATH}/${parkingSpace.id}`)
    .header("Authorization", "Bearer " + token)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should update ParkingSpace", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.parkingSpacePayloadProvider();

  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    data
  );

  const updatedData = TestHelper.parkingSpacePayloadProvider();

  const response = await client
    .put(`${URL_PATH}/${parkingSpace.id}`)
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

test("it should validate delete ParkingSpace by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const createdData = await TestHelper.parkingSpacePayloadProvider();

  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    createdData
  );

  const findParkingSpaceResponse = await client
    .get(`${URL_PATH}/${parkingSpace.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  findParkingSpaceResponse.assertStatus(200);

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

  const createdData = await TestHelper.parkingSpacePayloadProvider();

  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    createdData
  );

  const findParkingSpaceResponse = await client
    .get(`${URL_PATH}/${parkingSpace.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  findParkingSpaceResponse.assertStatus(200);

  const deleteParkingSpaceResponse = await client
    .delete(`${URL_PATH}/${parkingSpace.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  deleteParkingSpaceResponse.assertStatus(202);
});
