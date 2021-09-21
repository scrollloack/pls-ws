"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = use("moment");

/**
 * ParkingLotTransformer class
 *
 * @class ParkingLotTransformer
 * @constructor
 */
class ParkingLotTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(ParkingLot) {
    return {
      id: ParkingLot.id,
      description: ParkingLot.description,
      entry_point: ParkingLot.entry_point,
      size: ParkingLot.size,
      max_occupants: ParkingLot.max_occupants,
      created_at: moment(ParkingLot.created_at).format(),
      updated_at: moment(ParkingLot.updated_at).format(),
    };
  }
}

module.exports = ParkingLotTransformer;
