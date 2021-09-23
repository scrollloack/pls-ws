"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Hash = use("Hash");
const moment = use("moment");

Factory.blueprint("App/Models/User", async (faker, i, data) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: faker.password(),
    created_at: moment().format(),
    updated_at: moment().format().toString(),
  };
});

Factory.blueprint("App/Models/ParkingLot", async (faker, i, data) => {
  const x = 1;
  const y = 6;

  let entryPointItems = ["A", "B", "C"];
  let sizeX = 0,
    sizeY = 2;
  return {
    description: data.description ? data.description : faker.word(),
    entry_point: data.entry_point
      ? data.entry_point
      : entryPointItems[Math.floor(Math.random() * entryPointItems.length)],
    size: data.size ? data.size : ~~(Math.random() * sizeY) + sizeX,
    max_occupants: data.max_occupants
      ? data.max_occupants
      : ~~(Math.random() * y) + x,
    created_at: data.created_at ? data.created_at : moment().format(),
    updated_at: data.updated_at ? data.updated_at : moment().format(),
  };
});

Factory.blueprint("App/Models/ParkingSpace", async (faker, i, data) => {
  return {
    parking_lot_id: data.parking_lot_id
      ? data.parking_lot_id
      : faker.datatype.number(),
    space_number: data.space_number
      ? data.space_number
      : faker.datatype.number(),
  };
});

Factory.blueprint("App/Models/PricingRule", async (faker, i, data) => {
  return {
    parking_lot_id: data.parking_lot_id
      ? data.parking_lot_id
      : faker.datatype.number(),
    base_rate: data.base_rate
      ? data.base_rate
      : faker.datatype.number({ min: 40, max: 60, precision: 0.01 }),
    hourly_base_rate: data.hourly_base_rate
      ? data.hourly_base_rate
      : faker.datatype.number({ min: 20, max: 30, precision: 0.01 }),
    one_day_rate: data.one_day_rate
      ? data.one_day_rate
      : faker.datatype.number({ min: 5000, max: 6000, precision: 0.01 }),
  };
});

Factory.blueprint("App/Models/ClientInfo", async (faker, i, data) => {
  const x = 0,
    y = 2;

  return {
    car_size: data.car_size ? data.car_size : ~~(Math.random() * y) + x,
    car_color: data.car_color ? data.car_color : faker.lorem.word(),
    plate_number: data.plate_number ? data.plate_number : faker.lorem.word(),
  };
});
