"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { rule } = use("Validator");

class ClientInfo extends Model {
  static get resourceKey() {
    return "client_infos";
  }

  static get fillables() {
    return [
      "id",
      "car_size",
      "car_color",
      "plate_number",
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
      car_size: "required|number",
      car_color: "required|string",
      plate_number: "required|string",
    };
  }

  static get messages() {
    return {
      "car_size.required": "Car Size is required",
      "car_size.number": "Car Size should be a number",
      "car_color.required": "Car Color is required",
      "car_color.string": "Car Color should be a string",
      "plate_number.required": "Plate Number is required",
      "plate_number.string": "Plate Number should be a string",
    };
  }
}

module.exports = ClientInfo;
