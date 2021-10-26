"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = use("moment");

/**
 * ParkingSpaceTransformer class
 *
 * @class ParkingSpaceTransformer
 * @constructor
 */
class ParkingSpaceTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(ParkingSpace) {
    return {
      id: ParkingSpace.id,
      parking_lot_id: ParkingSpace.parking_lot_id,
      space_number: ParkingSpace.space_number,
      status: ParkingSpace.status,
      created_at: moment(ParkingSpace.created_at).format(),
      updated_at: moment(ParkingSpace.updated_at).format(),
    };
  }
}

module.exports = ParkingSpaceTransformer;
