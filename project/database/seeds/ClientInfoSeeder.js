"use strict";

/*
|--------------------------------------------------------------------------
| ClientInfoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const ClientInfo = use("App/Models/ClientInfo");
const moment = use("moment");

class ClientInfoSeeder {
  async run() {
    let clientInfo = new ClientInfo();
    clientInfo.car_size = 0;
    clientInfo.car_color = "blue";
    clientInfo.plate_number = "AAA-111";
    clientInfo.created_at = moment().format();
    clientInfo.updated_at = moment().format();
    await clientInfo.save();
  }
}

module.exports = ClientInfoSeeder;
