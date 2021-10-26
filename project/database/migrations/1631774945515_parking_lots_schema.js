"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingLotsSchema extends Schema {
  up() {
    this.create("parking_lots", (table) => {
      table.increments();
      table.string("description").notNullable();
      table.string("entry_point").notNullable();
      table.integer("size").notNullable();
      table.integer("max_occupants").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_lots");
  }
}

module.exports = ParkingLotsSchema;
