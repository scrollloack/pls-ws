"use strict";

const { test, trait } = use("Test/Suite")("Pricing Rule Http");
const PricingRule = use("App/Models/PricingRule");
const User = use("App/Models/User");
const Factory = use("Factory");
const TestHelper = use("/TestHelper");

trait("Test/ApiClient");
trait("Session/Client");

const URL_PATH = "/pricing-rule";

test("it should validate jwt token access", async ({ client }) => {
  const response = await client.get(URL_PATH).end();

  response.assertStatus(401);
  response.assertJSONSubset({
    error: "No token found in the request",
  });
});

test("it should validate lists PricingRule rules", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.pricingRulePayloadProvider();

  await Factory.model("App/Models/PricingRule").create(data);

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

test("it should list PricingRule", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.pricingRulePayloadProvider();

  await Factory.model("App/Models/PricingRule").create(data);

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

test("it should validate list PricingRule by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.pricingRulePayloadProvider();

  await Factory.model("App/Models/PricingRule").create(data);

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

test("it should list PricingRule by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.pricingRulePayloadProvider();

  const pricingRule = await Factory.model("App/Models/PricingRule").create(
    data
  );

  const response = await client
    .get(`${URL_PATH}/${pricingRule.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      attributes: data,
    },
  });
});

test("it should validate create PricingRule rules", async ({ client }) => {
  const token = await TestHelper.getToken();

  const requiredData = {
    parking_lot_id: "",
    base_rate: "",
    hourly_base_rate: "",
    one_day_rate: "",
  };

  const requiredResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const numberData = {
    parking_lot_id: "asd",
    base_rate: "asd",
    hourly_base_rate: "asd",
    one_day_rate: "asd",
  };

  const numberResponse = await client
    .post(URL_PATH)
    .header("Authorization", "Bearer " + token)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should create PricingRule", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = TestHelper.pricingRulePayloadProvider();

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

test("it should validate update PricingRule by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.pricingRulePayloadProvider();

  const pricingRule = await Factory.model("App/Models/PricingRule").create(
    data
  );

  const requiredData = {
    parking_lot_id: "",
    base_rate: "",
    hourly_base_rate: "",
    one_day_rate: "",
  };

  const requiredResponse = await client
    .put(`${URL_PATH}/${pricingRule.id}`)
    .header("Authorization", "Bearer " + token)
    .send(requiredData)
    .end();

  requiredResponse.assertStatus(422);

  const numberData = {
    parking_lot_id: "asd",
    base_rate: "asd",
    hourly_base_rate: "asd",
    one_day_rate: "asd",
  };

  const numberResponse = await client
    .put(`${URL_PATH}/${pricingRule.id}`)
    .header("Authorization", "Bearer " + token)
    .send(numberData)
    .end();

  numberResponse.assertStatus(422);
});

test("it should update PricingRule", async ({ client }) => {
  const token = await TestHelper.getToken();

  const data = await TestHelper.pricingRulePayloadProvider();

  const pricingRule = await Factory.model("App/Models/PricingRule").create(
    data
  );

  const updatedData = TestHelper.pricingRulePayloadProvider();

  const response = await client
    .put(`${URL_PATH}/${pricingRule.id}`)
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

test("it should validate delete PricingRule by id", async ({ client }) => {
  const token = await TestHelper.getToken();

  const createdData = await TestHelper.pricingRulePayloadProvider();

  const pricingRule = await Factory.model("App/Models/PricingRule").create(
    createdData
  );

  const findPricingRuleResponse = await client
    .get(`${URL_PATH}/${pricingRule.id}`)
    .header("Authorization", "Bearer " + token)
    .end();

  findPricingRuleResponse.assertStatus(200);

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
