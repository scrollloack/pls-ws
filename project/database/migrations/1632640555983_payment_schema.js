"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PaymentSchema extends Schema {
  up() {
    this.create("payments", (table) => {
      table.increments();
      table.string("payment_status").defaultTo("pending");
      table.decimal("total_fee").defaultTo(null);
      table.timestamps();
    });
  }

  down() {
    this.drop("payments");
  }
}

module.exports = PaymentSchema;
