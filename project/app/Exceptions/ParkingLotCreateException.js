"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");
const Config = use("Config");

class ParkingLotCreateException extends LogicalException {
  constructor(message) {
    super(Config.get("errors.create"), 400);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = ParkingLotCreateException;
