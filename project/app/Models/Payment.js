"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Payment extends Model {
  static get resourceKey() {
    return "payments";
  }

  parkingRecord() {
    return this.hasOne("App/Models/ParkingRecord");
  }
}

module.exports = Payment;
