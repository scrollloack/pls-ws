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
  let sizeItems = [0, 1, 2];
  return {
    description: data.description ? data.description : faker.word(),
    entry_point: data.entry_point
      ? data.entry_point
      : entryPointItems[Math.floor(Math.random() * entryPointItems.length)],
    size: data.size
      ? data.size
      : sizeItems[Math.floor(Math.random() * sizeItems.length)],
    max_occupants: data.max_occupants
      ? data.max_occupants
      : ~~(Math.random() * y) + x,
    created_at: data.created_at ? data.created_at : moment().format(),
    updated_at: data.updated_at ? data.updated_at : moment().format(),
  };
});
