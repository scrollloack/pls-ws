"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const ParkingSpaceTransformer = use("App/Transformers/ParkingSpaceTransformer");
const ParkingLotTransformer = use("App/Transformers/ParkingLotTransformer");
const PaymentTransformer = use("App/Transformers/PaymentTransformer");
const moment = use("moment");

/**
 * ParkingRecordTransformer class
 *
 * @class ParkingRecordTransformer
 * @constructor
 */
class ParkingRecordTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ["parkingSpace", "parkingLot", "payment"];
  }
  /**
   * This method is used to transform the data.
   */
  transform(ParkingRecord) {
    return {
      id: ParkingRecord.id,
      parking_lot_id: ParkingRecord.parking_lot_id,
      parking_space_id: ParkingRecord.parking_space_id,
      client_info_id: ParkingRecord.client_info_id,
      payment_id: ParkingRecord.payment_id,
      created_at: moment(ParkingRecord.created_at).format(),
      updated_at: moment(ParkingRecord.updated_at).format(),
    };
  }

  includeParkingSpace(ParkingRecord) {
    return this.item(
      ParkingRecord.getRelated("parkingSpace"),
      ParkingSpaceTransformer
    );
  }

  includeParkingLot(ParkingRecord) {
    return this.item(
      ParkingRecord.getRelated("parkingLot"),
      ParkingLotTransformer
    );
  }

  includePayment(ParkingRecord) {
    return this.item(ParkingRecord.getRelated("payment"), PaymentTransformer);
  }
}

module.exports = ParkingRecordTransformer;
