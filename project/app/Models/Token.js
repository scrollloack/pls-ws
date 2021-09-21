"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const User = use("App/Models/User");

class Token extends Model {
  static get primaryKey() {
    return "id";
  }

  user() {
    return belongsTo(User, "id", "user_id");
  }
}

module.exports = Token;
