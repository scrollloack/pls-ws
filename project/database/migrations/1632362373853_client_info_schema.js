"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ClientInfoSchema extends Schema {
  up() {
    this.create("client_infos", (table) => {
      table.increments();
      table.integer("car_size").notNullable();
      table.string("car_color").notNullable();
      table.string("plate_number").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("client_infos");
  }
}

module.exports = ClientInfoSchema;
