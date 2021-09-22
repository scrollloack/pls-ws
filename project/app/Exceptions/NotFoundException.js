"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");
const Config = use("Config");

class NotFoundException extends LogicalException {
  constructor(message) {
    super(Config.get("errors.show"), 404);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = NotFoundException;
