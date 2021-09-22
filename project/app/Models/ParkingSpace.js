"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { rule } = use("Validator");

class ParkingSpace extends Model {
  static get resourceKey() {
    return "parking_spaces";
  }

  static get fillables() {
    return ["id", "parking_lot_id", "space_number", "created_at", "updated_at"];
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
      space_number: "required|number",
    };
  }

  static get messages() {
    return {
      "parking_lot_id.required": "Parking Lot ID is required",
      "parking_lot_id.string": "Parking Lot ID should be a string",
      "space_number.required": "Space Number is required",
      "space_number.string": "Space Number should be a string",
    };
  }
}

module.exports = ParkingSpace;
