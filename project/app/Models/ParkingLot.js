"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParkingLot extends Model {
  static get resourceKey() {
    return "parking_lots";
  }

  static get fillables() {
    return ["id", "description", "entry_point", "size", "max_occupants"];
  }

  static get createOrUpdateRules() {
    return {
      description: "required|string",
      entry_point: "required|string|alpha|max:1",
      size: "required|number",
      max_occupants: "required|number",
    };
  }

  static get messages() {
    return {
      "description.required": "Description is required",
      "description.string": "Description should be a string",
      "entry_point.required": "Entry point is required",
      "entry_point.string": "Entry point should be a string",
      "entry_point.alpha": "Entry point should be an alphabet",
      "entry_point.max": "Entry point has maximum of one letter only",
      "size.required": "Size is required",
      "size.number": "Size should be a number",
      "max_occupants.required": "Size is required",
      "max_occupants.number": "Size should be a number",
    };
  }
}

module.exports = ParkingLot;
