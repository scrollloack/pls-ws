"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const User = use("App/Models/User");
const moment = use("moment");

class UserSeeder {
  async run() {
    const user = new User();
    user.username = "sample";
    user.email = "sample@asd.com";
    user.password = "password";
    user.created_at = moment().format();
    user.updated_at = moment().format();

    await user.save();
  }
}

module.exports = UserSeeder;
