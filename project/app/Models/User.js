"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

class User extends Model {
  static get resourceKey() {
    return "users";
  }

  static get primaryKey() {
    return "id";
  }

  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  static get loginRules() {
    return {
      email: "required|email",
      password: "required",
    };
  }

  static get messages() {
    return {
      "email.required": "Email is required",
      "email.email": "Email should be an email",
      "password.required": "Password is required",
    };
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }
}

module.exports = User;
