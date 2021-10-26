"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = use("moment");

/**
 * PaymentTransformer class
 *
 * @class PaymentTransformer
 * @constructor
 */
class PaymentTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(Payment) {
    return {
      id: Payment.id,
      payment_status: Payment.payment_status,
      total_fee: Payment.total_fee,
      created_at: moment(Payment.created_at).format(),
      updated_at: moment(Payment.updated_at).format(),
    };
  }
}

module.exports = PaymentTransformer;
