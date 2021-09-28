"use strict";

/*
|--------------------------------------------------------------------------
| ParkingSpaceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const ParkingSpace = use("App/Models/ParkingSpace");
const moment = use("moment");

class ParkingSpaceSeeder {
  async run() {
    let parkingSpace = new ParkingSpace();
    parkingSpace.parking_lot_id = 1;
    parkingSpace.space_number = 1;
    parkingSpace.created_at = moment().format();
    parkingSpace.updated_at = moment().format();
    await parkingSpace.save();

    parkingSpace = new ParkingSpace();
    parkingSpace.parking_lot_id = 1;
    parkingSpace.space_number = 2;
    parkingSpace.created_at = moment().format();
    parkingSpace.updated_at = moment().format();
    await parkingSpace.save();

    parkingSpace = new ParkingSpace();
    parkingSpace.parking_lot_id = 2;
    parkingSpace.space_number = 1;
    parkingSpace.created_at = moment().format();
    parkingSpace.updated_at = moment().format();
    await parkingSpace.save();

    parkingSpace = new ParkingSpace();
    parkingSpace.parking_lot_id = 2;
    parkingSpace.space_number = 2;
    parkingSpace.created_at = moment().format();
    parkingSpace.updated_at = moment().format();
    await parkingSpace.save();

    parkingSpace = new ParkingSpace();
    parkingSpace.parking_lot_id = 3;
    parkingSpace.space_number = 1;
    parkingSpace.created_at = moment().format();
    parkingSpace.updated_at = moment().format();
    await parkingSpace.save();

    parkingSpace = new ParkingSpace();
    parkingSpace.parking_lot_id = 3;
    parkingSpace.space_number = 2;
    parkingSpace.created_at = moment().format();
    parkingSpace.updated_at = moment().format();
    await parkingSpace.save();
  }
}

module.exports = ParkingSpaceSeeder;
