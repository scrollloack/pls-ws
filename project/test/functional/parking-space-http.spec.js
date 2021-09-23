"use strict";

const { test, trait } = use("Test/Suite")("Parking Space Http");
const ParkingSpace = use("App/Models/ParkingSpace");
const Factory = use("Factory");
const TestHelper = use("/TestHelper");

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
    .send(TestHelper.listFilters().pageFilter)
    .end();

  pageFilterResopnse.assertStatus(422);

  const perPageFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(TestHelper.listFilters().perPageFilter)
    .end();

  perPageFilterResopnse.assertStatus(422);

  const orderByFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(TestHelper.listFilters().orderByFilter)
    .end();

  orderByFilterResopnse.assertStatus(422);

  const sortByFilterResopnse = await client
    .get(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(TestHelper.listFilters().sortByFilter)
    .end();

  sortByFilterResopnse.assertStatus(422);
});

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

test("it should list ParkingSpace by id", async ({ client }) => {
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

test("it should validate create ParkingSpace rules", async ({ client }) => {
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

  const parkingLotData = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const data = TestHelper.parkingSpacePayloadProvider();

  data.parking_lot_id = parkingLot.id;

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

  const parkingLotData = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const data = await TestHelper.parkingSpacePayloadProvider();

  data.parking_lot_id = parkingLot.id;

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

test("it should delete ParkingSpace", async ({ client }) => {
  const token = await TestHelper.getToken();

  const parkingLotData = await TestHelper.parkingLotPayloadProvider();

  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const createdData = await TestHelper.parkingSpacePayloadProvider();

  createdData.parking_lot_id = parkingLot.id;

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
