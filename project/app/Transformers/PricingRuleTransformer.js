"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = use("moment");

/**
 * PricingRuleTransformer class
 *
 * @class PricingRuleTransformer
 * @constructor
 */
class PricingRuleTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(PricingRule) {
    return {
      id: PricingRule.id,
      parking_lot_id: PricingRule.parking_lot_id,
      base_rate: PricingRule.base_rate,
      hourly_base_rate: PricingRule.hourly_base_rate,
      one_day_rate: PricingRule.one_day_rate,
      created_at: moment(PricingRule.created_at).format(),
      updated_at: moment(PricingRule.updated_at).format(),
    };
  }
}

module.exports = PricingRuleTransformer;
