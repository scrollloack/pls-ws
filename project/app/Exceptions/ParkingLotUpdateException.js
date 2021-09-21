"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");
const Config = use("Config");

class ParkingLotUpdateException extends LogicalException {
  constructor(message) {
    super(Config.get("errors.update"), 400);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = ParkingLotUpdateException;
