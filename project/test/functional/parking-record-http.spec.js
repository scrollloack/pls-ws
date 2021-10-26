"use strict";

const { test, trait } = use("Test/Suite")("Parking Record Http");
const ParkingRecord = use("App/Models/ParkingRecord");
const Factory = use("Factory");
const TestHelper = use("/TestHelper");

trait("Test/ApiClient");
trait("Session/Client");

const URL_PATH = "/parking-record";

test("it should validate list ParkingRecord by ID", async ({ client }) => {
  const parkingRecordData = await TestHelper.parkPayloadProvider();

  await Factory.model("App/Models/ParkingRecord").create(parkingRecordData);

  const requiredResponse = await client.get(`${URL_PATH}/""`).end();

  requiredResponse.assertStatus(422);

  const numberResponse = await client.get(`${URL_PATH}/aaa`).end();

  numberResponse.assertStatus(422);
});

test("it should list ParkingRecord by ID", async ({ client }) => {
  const parkingRecordData = await TestHelper.parkPayloadProvider();

  const parkingRecord = await Factory.model("App/Models/ParkingRecord").create(
    parkingRecordData
  );

  const response = await client.get(`${URL_PATH}/${parkingRecord.id}`).end();

  response.assertStatus(200);
});

test("it should validate park payload", async ({ client }) => {
  const requiredData = {
    entry_point: "",
    car_size: "",
    car_color: "",
    plate_number: "",
  };

  const requiredResponse = await client.post(URL_PATH).send(requiredData).end();

  requiredResponse.assertStatus(422);

  const numberData = {
    entry_point: "A",
    car_size: "asd",
    car_color: "blue",
    plate_number: "AAA-111",
  };

  const numberResponse = await client.post(URL_PATH).send(numberData).end();

  numberResponse.assertStatus(422);

  const stringData = {
    entry_point: 1,
    car_size: 0,
    car_color: 1,
    plate_number: 1,
  };

  const stringResponse = await client.post(URL_PATH).send(stringData).end();

  stringResponse.assertStatus(422);
});

test("it should validate park payload entry point and car size", async ({
  client,
}) => {
  const entryPointData = {
    entry_point: "T",
    car_size: 0,
    car_color: "blue",
    plate_number: "AAA-111",
  };

  const entryPointResponse = await client
    .post(URL_PATH)
    .send(entryPointData)
    .end();

  entryPointResponse.assertStatus(400);

  const carSizeData = {
    entry_point: "A",
    car_size: 11,
    car_color: "blue",
    plate_number: "AAA-111",
  };

  const carSizeResponse = await client.post(URL_PATH).send(carSizeData).end();

  carSizeResponse.assertStatus(400);
});

test("it should validate duplicate parking", async ({ client }) => {
  const parkingLotData = TestHelper.parkingLotPayloadProvider();
  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const parkingSpaceData = TestHelper.parkingSpacePayloadProvider();
  parkingSpaceData.parking_lot_id = parkingLot.id;
  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    parkingSpaceData
  );

  const clientInfoData = TestHelper.clientInfoPayloadProvider();
  const clientInfo = await Factory.model("App/Models/ClientInfo").create(
    clientInfoData
  );

  const pricingRuleData = TestHelper.pricingRulePayloadProvider();
  pricingRuleData.parking_lot_id = parkingLot.id;
  await Factory.model("App/Models/PricingRule").create(pricingRuleData);

  const payment = await Factory.model("App/Models/Payment").create();

  const parkingRecordData = {
    parking_lot_id: parkingLot.id,
    parking_space_id: parkingSpace.id,
    client_info_id: clientInfo.id,
    payment_id: payment.id,
  };

  const data = {
    entry_point: "A",
    car_size: 0,
    car_color: "blue",
    plate_number: "AAA-111",
  };

  await Factory.model("App/Models/ParkingRecord").create(parkingRecordData);

  const response = await client.post(URL_PATH).send(data).end();
  response.assertStatus(200);

  const duplicateResponse = await client.post(URL_PATH).send(data).end();
  duplicateResponse.assertStatus(400);
  duplicateResponse.assertJSONSubset({ error: "Vehicle already parked" });
});

test("it should create parking", async ({ client }) => {
  const parkingLotData = TestHelper.parkingLotPayloadProvider();
  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const parkingSpaceData = TestHelper.parkingSpacePayloadProvider();
  parkingSpaceData.parking_lot_id = parkingLot.id;
  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    parkingSpaceData
  );

  const clientInfoData = TestHelper.clientInfoPayloadProvider();
  const clientInfo = await Factory.model("App/Models/ClientInfo").create(
    clientInfoData
  );

  const pricingRuleData = TestHelper.pricingRulePayloadProvider();
  pricingRuleData.parking_lot_id = parkingLot.id;
  await Factory.model("App/Models/PricingRule").create(pricingRuleData);

  const payment = await Factory.model("App/Models/Payment").create();

  const parkingRecordData = {
    parking_lot_id: parkingLot.id,
    parking_space_id: parkingSpace.id,
    client_info_id: clientInfo.id,
    payment_id: payment.id,
  };

  const data = TestHelper.parkingRecordPayloadProvider();

  await Factory.model("App/Models/ParkingRecord").create(parkingRecordData);

  const response = await client.post(URL_PATH).send(data).end();
  response.assertStatus(200);
});

test("it should validate unparking by id", async ({ client }) => {
  const requiredResponse = await client.put(`${URL_PATH}/""`).end();

  requiredResponse.assertStatus(422);

  const numberResponse = await client.put(`${URL_PATH}/aaa`).end();

  numberResponse.assertStatus(422);
});

test("it should validate duplicate payment parking by id", async ({
  client,
}) => {
  const parkingLotData = TestHelper.parkingLotPayloadProvider();
  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const parkingSpaceData = TestHelper.parkingSpacePayloadProvider();
  parkingSpaceData.parking_lot_id = parkingLot.id;
  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    parkingSpaceData
  );

  const clientInfoData = TestHelper.clientInfoPayloadProvider();
  const clientInfo = await Factory.model("App/Models/ClientInfo").create(
    clientInfoData
  );

  const pricingRuleData = TestHelper.pricingRulePayloadProvider();
  pricingRuleData.parking_lot_id = parkingLot.id;
  await Factory.model("App/Models/PricingRule").create(pricingRuleData);

  const paymentData = {
    payment_status: "paid",
    total_fee: 40.0,
  };

  const payment = await Factory.model("App/Models/Payment").create(paymentData);

  const parkingRecordData = {
    parking_lot_id: parkingLot.id,
    parking_space_id: parkingSpace.id,
    client_info_id: clientInfo.id,
    payment_id: payment.id,
  };

  const parkingRecord = await Factory.model("App/Models/ParkingRecord").create(
    parkingRecordData
  );

  const response = await client.put(`${URL_PATH}/${parkingRecord.id}`).end();
  response.assertStatus(400);
  response.assertJSONSubset({
    error: "Record already paid, you might have entered a duplicate record id",
  });
});

test("it should unpark by id", async ({ client }) => {
  const parkingLotData = TestHelper.parkingLotPayloadProvider();
  const parkingLot = await Factory.model("App/Models/ParkingLot").create(
    parkingLotData
  );

  const parkingSpaceData = TestHelper.parkingSpacePayloadProvider();
  parkingSpaceData.parking_lot_id = parkingLot.id;
  const parkingSpace = await Factory.model("App/Models/ParkingSpace").create(
    parkingSpaceData
  );

  const clientInfoData = TestHelper.clientInfoPayloadProvider();
  const clientInfo = await Factory.model("App/Models/ClientInfo").create(
    clientInfoData
  );

  const pricingRuleData = TestHelper.pricingRulePayloadProvider();
  pricingRuleData.parking_lot_id = parkingLot.id;
  await Factory.model("App/Models/PricingRule").create(pricingRuleData);

  const payment = await Factory.model("App/Models/Payment").create();

  const parkingRecordData = {
    parking_lot_id: parkingLot.id,
    parking_space_id: parkingSpace.id,
    client_info_id: clientInfo.id,
    payment_id: payment.id,
  };

  const parkingRecord = await Factory.model("App/Models/ParkingRecord").create(
    parkingRecordData
  );

  const response = await client.put(`${URL_PATH}/${parkingRecord.id}`).end();

  response.assertStatus(200);
});
