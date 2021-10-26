"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { rule } = use("Validator");

class ParkingRecord extends Model {
  static get resourceKey() {
    return "parking_records";
  }

  static get fillables() {
    return [
      "id",
      "parking_lot_id",
      "parking_space_id",
      "client_info_id",
      "status",
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
      entry_point: "required|string",
      car_size: "required|number",
      car_color: "required|string",
      plate_number: "required|string",
    };
  }

  static get messages() {
    return {
      "entry_point.required": "Entry Point is required",
      "entry_point.string": "Entry Point should be a string",
      "car_size.required": "Car Size is required",
      "car_size.number": "Car Size should be a number",
      "car_color.required": "Car Color is required",
      "car_color.string": "Car Color should be a string",
      "plate_number.required": "Plate Number is required",
      "plate_number.string": "Plate Number should be a string",
    };
  }

  parkingSpace() {
    return this.belongsTo("App/Models/ParkingSpace");
  }

  parkingLot() {
    return this.belongsTo("App/Models/ParkingLot");
  }

  payment() {
    return this.belongsTo("App/Models/Payment");
  }
}

module.exports = ParkingRecord;
