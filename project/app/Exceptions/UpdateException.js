"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class UpdateException extends LogicalException {
  constructor(message) {
    super(Config.get("errors.update"), 400);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = UpdateException;
