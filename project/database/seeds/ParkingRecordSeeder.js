"use strict";

/*
|--------------------------------------------------------------------------
| ParkingRecordSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const ParkingRecord = use("App/Models/ParkingRecord");
const moment = use("moment");

class ParkingRecordSeeder {
  async run() {
    let parkingRecord = new ParkingRecord();
    parkingRecord.parking_lot_id = 1;
    parkingRecord.parking_space_id = 1;
    parkingRecord.client_info_id = 1;
    parkingRecord.payment_id = 1;
    parkingRecord.created_at = moment().format();
    parkingRecord.updated_at = moment().format();
    await parkingRecord.save();

    parkingRecord = new ParkingRecord();
    parkingRecord.parking_lot_id = 2;
    parkingRecord.parking_space_id = 1;
    parkingRecord.client_info_id = 2;
    parkingRecord.payment_id = 2;
    parkingRecord.created_at = moment().format();
    parkingRecord.updated_at = moment().format();
    await parkingRecord.save();

    parkingRecord = new ParkingRecord();
    parkingRecord.parking_lot_id = 3;
    parkingRecord.parking_space_id = 1;
    parkingRecord.client_info_id = 3;
    parkingRecord.payment_id = 3;
    parkingRecord.created_at = moment().format();
    parkingRecord.updated_at = moment().format();
    await parkingRecord.save();
  }
}

module.exports = ParkingRecordSeeder;
