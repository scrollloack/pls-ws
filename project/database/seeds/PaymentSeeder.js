"use strict";

/*
|--------------------------------------------------------------------------
| PaymentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Payment = use("App/Models/Payment");
const moment = use("moment");

class PaymentSeeder {
  async run() {
    let payment = new Payment();
    payment.created_at = moment().format();
    payment.updated_at = moment().format();
    await payment.save();

    payment = new Payment();
    payment.created_at = moment().format();
    payment.updated_at = moment().format();
    await payment.save();

    payment = new Payment();
    payment.created_at = moment().format();
    payment.updated_at = moment().format();
    await payment.save();
  }
}

module.exports = PaymentSeeder;
