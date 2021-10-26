"use strict";

/*
|--------------------------------------------------------------------------
| ParkingLotSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const ParkingLot = use("App/Models/ParkingLot");
const moment = use("moment");

class ParkingLotSeeder {
  async run() {
    let parkingLot = new ParkingLot();
    parkingLot.description = "SP";
    parkingLot.entry_point = "A";
    parkingLot.size = 0;
    parkingLot.max_occupants = 6;
    parkingLot.created_at = moment().format();
    parkingLot.updated_at = moment().format();
    await parkingLot.save();

    parkingLot = new ParkingLot();
    parkingLot.description = "MP";
    parkingLot.entry_point = "B";
    parkingLot.size = 1;
    parkingLot.max_occupants = 6;
    parkingLot.created_at = moment().format();
    parkingLot.updated_at = moment().format();
    await parkingLot.save();

    parkingLot = new ParkingLot();
    parkingLot.description = "LP";
    parkingLot.entry_point = "C";
    parkingLot.size = 2;
    parkingLot.max_occupants = 6;
    parkingLot.created_at = moment().format();
    parkingLot.updated_at = moment().format();
    await parkingLot.save();
  }
}

module.exports = ParkingLotSeeder;
