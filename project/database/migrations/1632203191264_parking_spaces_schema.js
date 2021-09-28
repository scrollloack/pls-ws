"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingSpacesSchema extends Schema {
  up() {
    this.create("parking_spaces", (table) => {
      table.increments();
      table
        .integer("parking_lot_id")
        .unsigned()
        .references("parking_lots.id")
        .onDelete("CASCADE");
      table.integer("space_number").notNullable();
      table.string("status").defaultTo("unoccupied");
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_spaces");
  }
}

module.exports = ParkingSpacesSchema;
