"use strict";

/*
|--------------------------------------------------------------------------
| PricingRuleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const PricingRule = use("App/Models/PricingRule");
const moment = use("moment");

class PricingRuleSeeder {
  async run() {
    let priciingRule = new PricingRule();
    priciingRule.parking_lot_id = 1;
    priciingRule.base_rate = parseFloat(40.0);
    priciingRule.hourly_base_rate = parseFloat(20.0);
    priciingRule.one_day_rate = parseFloat(5000.0);
    priciingRule.created_at = moment().format();
    priciingRule.updated_at = moment().format();
    await priciingRule.save();
  }
}

module.exports = PricingRuleSeeder;
