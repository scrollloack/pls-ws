"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingRecordsSchema extends Schema {
  up() {
    this.create("parking_records", (table) => {
      table.increments();
      table
        .integer("parking_lot_id")
        .unsigned()
        .references("parking_lots.id")
        .onDelete("CASCADE");
      table
        .integer("parking_space_id")
        .unsigned()
        .references("parking_spaces.id")
        .onDelete("CASCADE");
      table
        .integer("client_info_id")
        .unsigned()
        .references("client_infos.id")
        .onDelete("CASCADE");
      table
        .integer("payment_id")
        .unsigned()
        .references("payments.id")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_records");
  }
}

module.exports = ParkingRecordsSchema;
