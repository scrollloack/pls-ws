"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PricingRuleSchema extends Schema {
  up() {
    this.create("pricing_rules", (table) => {
      table.increments();
      table
        .integer("parking_lot_id")
        .unsigned()
        .references("parking_lots.id")
        .onDelete("CASCADE");
      table.decimal("base_rate").defaultTo(40.0);
      table.decimal("hourly_base_rate").notNullable();
      table.decimal("one_day_rate").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("pricing_rules");
  }
}

module.exports = PricingRuleSchema;
