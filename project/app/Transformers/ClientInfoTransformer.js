"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = use("moment");

/**
 * ClientInfoTransformer class
 *
 * @class ClientInfoTransformer
 * @constructor
 */
class ClientInfoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(ClientInfo) {
    return {
      id: ClientInfo.id,
      car_size: ClientInfo.car_size,
      car_color: ClientInfo.car_color,
      plate_number: ClientInfo.plate_number,
      created_at: moment(ClientInfo.created_at).format(),
      updated_at: moment(ClientInfo.updated_at).format(),
    };
  }
}

module.exports = ClientInfoTransformer;
