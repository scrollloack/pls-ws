"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { rule } = use("Validator");

class PricingRule extends Model {
  static get resourceKey() {
    return "pricing_rules";
  }

  static get fillables() {
    return [
      "id",
      "parking_lot_id",
      "base_rate",
      "hourly_base_rate",
      "one_day_rate",
      "created_at",
      "updated_at",
    ];
  }

  static filters() {
    return ["page", "per_page", "order_by", "sort_by"];
  }

  static findRule() {
    return {
      id: "required|number",
    };
  }

  static filterRules() {
    return {
      page: `number`,
      per_page: "number",
      order_by: [rule("in", this.fillables)],
      sort_by: [rule("in", ["asc", "desc"])],
    };
  }

  static get createOrUpdateRules() {
    return {
      parking_lot_id: "required|number",
      base_rate: "required|number",
      hourly_base_rate: "required|number",
      one_day_rate: "required|number",
    };
  }

  static get messages() {
    return {
      "parking_lot_id.required": "Parking Lot ID is required",
      "parking_lot_id.number": "Parking Lot ID should be a number",
      "base_rate.required": "Base Rate is required",
      "base_rate.decimal": "Base Rate should be a decimal",
      "hourly_base_rate.required": "Hourly Base Rate is required",
      "hourly_base_rate.decimal": "Hourly Base Rate should be a decimal",
      "one_day_rate.required": "24 Hour Fee is required",
      "one_day_rate.decimal": "24 Hour Fee should be a decimal",
    };
  }

  parkingLots() {
    return this.belongsTo("App/Models/ParkingLot");
  }
}

module.exports = PricingRule;
