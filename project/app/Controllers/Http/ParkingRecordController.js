"use strict";

const ParkingRecord = use("App/Models/ParkingRecord");
const PricingRule = use("App/Models/PricingRule");
const Payment = use("App/Models/Payment");
const ParkingSpace = use("App/Models/ParkingSpace");
const ParkingRecordRepository = make(
  "App/Models/Repositories/ParkingRecordRepository"
);
const { validate } = use("Validator");
const moment = use("moment");
const _ = use("lodash");

class ParkingRecordController {
  /**
   * Show a list of all parkingrecords.
   * GET parkingrecords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async findParkingRecordById({ params, request, response, transform }) {
    try {
      const fields = { id: params.id };

      const validation = await validate(
        fields,
        ParkingRecord.findRule(),
        ParkingRecord.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingRecord = await ParkingRecord.findOrFail(params.id);

      const transformed = await transform
        .include(["parkingSpace", "parkingLot", "payment"])
        .item(parkingRecord, "ParkingRecordTransformer");

      const serialize = await ParkingRecordRepository.serialize(
        ParkingRecord.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Create/save a new parkingRecord.
   * POST parkingRecords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async park({ request, response }) {
    try {
      const parking_lot_sizes = {
        A: 0,
        B: 1,
        C: 2,
      };

      const validation = await validate(
        request.all(),
        ParkingRecord.createOrUpdateRules,
        ParkingRecord.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      if (!parking_lot_sizes.hasOwnProperty(request.input("entry_point"))) {
        return response.status(400).json({
          error: "Entry point doesn't exists",
        });
      }

      if (
        !Object.values(parking_lot_sizes).includes(request.input("car_size"))
      ) {
        return response.status(400).json({
          error: "Car size can't be parked here",
        });
      }

      const parkingSpaces = await ParkingRecordRepository.allParkingSpace(
        parking_lot_sizes,
        request.input("car_size"),
        request.input("entry_point")
      );

      const nearestSpace =
        await ParkingRecordRepository.findNearestParkingSpace(parkingSpaces);

      const clientData = {
        car_size: request.input("car_size"),
        car_color: request.input("car_color"),
        plate_number: request.input("plate_number"),
      };

      let clientInfo =
        await ParkingRecordRepository.findClientInfoByPlateNumber(
          request.input("plate_number")
        );

      if (!clientInfo) {
        clientInfo = await ParkingRecordRepository.createClientInfo(clientData);
      }

      await clientInfo.toJSON();

      let parkingRecord =
        await ParkingRecordRepository.findParkingRecordIfAlreadyExists(
          clientInfo.id,
          request.input("plate_number")
        );

      if (!_.isEmpty(parkingRecord)) {
        return response.status(400).json({
          error: "Vehicle already parked",
        });
      }

      const payment = await ParkingRecordRepository.createPayment();

      await payment.toJSON();

      parkingRecord = await ParkingRecordRepository.createParkingRecord({
        parking_lot_id: nearestSpace.parking_lot_id,
        parking_space_id: nearestSpace.id,
        client_info_id: clientInfo.id,
        payment_id: payment.id,
      });

      const pricingRule = await ParkingRecordRepository.findPricingRule(
        nearestSpace.parking_lot_id
      );

      parkingRecord[0]["base_rate"] = pricingRule.base_rate;
      parkingRecord[0]["hourly_base_rate"] = pricingRule.hourly_base_rate;
      parkingRecord[0]["one_day_rate"] = pricingRule.one_day_rate;
      parkingRecord[0]["created_at"] = moment(
        parkingRecord.created_at
      ).format();
      parkingRecord[0]["updated_at"] = moment(
        parkingRecord.updated_at
      ).format();

      const serialize = await ParkingRecordRepository.serialize(
        ParkingRecord.resourceKey,
        null,
        parkingRecord
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Unparks a vehicle by id.
   * PUT parkingRecords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async unpark({ params, request, response }) {
    try {
      const fields = { id: params.id };

      const validation = await validate(
        fields,
        ParkingRecord.findRule(),
        ParkingRecord.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingRecord = await ParkingRecordRepository.findParkingRecord(
        params.id
      );

      const checkIfPaidAlready = await ParkingRecordRepository.checkPayment(
        parkingRecord.payment_id
      );

      if (checkIfPaidAlready) {
        return response.status(400).json({
          error:
            "Record already paid, you might have entered a duplicate record id",
        });
      }

      const pricingRule = await PricingRule.findByOrFail(
        "parking_lot_id",
        parkingRecord.parking_lot_id
      );

      let timeCheckedIn = moment(parkingRecord.created_at);
      let currentTime = moment(new Date());

      let timeSpent = moment.duration(currentTime - timeCheckedIn).asHours();

      timeSpent = Math.abs(Math.floor(-timeSpent));

      let total_fee = parseFloat(pricingRule.base_rate);

      //continuous hourly rate
      let oldParkingRecord = await ParkingRecordRepository.findOldParkingRecord(
        parkingRecord.client_info_id
      );
      let timeOldCheckedIn = null;
      let timeAway = null;

      if (!_.isNil(oldParkingRecord)) {
        // oldParkingRecord = parkingRecord;
        timeOldCheckedIn = moment(oldParkingRecord.created_at);

        timeAway = moment.duration(timeCheckedIn - timeOldCheckedIn).asHours();

        timeAway = Math.abs(Math.floor(-timeAway));
      }

      if (timeAway <= 1 && !_.isNil(timeAway)) {
        total_fee = ParkingRecordRepository.getHourlyRateForOldRecord(
          total_fee,
          timeSpent,
          pricingRule.hourly_base_rate
        );
        //end of continuous hourly rate
      } else {
        //hourly rate
        total_fee = ParkingRecordRepository.getHourlyRate(
          total_fee,
          timeSpent,
          pricingRule.hourly_base_rate
        )
          ? ParkingRecordRepository.getHourlyRate(
              total_fee,
              timeSpent,
              pricingRule.hourly_base_rate
            )
          : total_fee;
        //24 hour rate/penalty
        total_fee = ParkingRecordRepository.getOneDayRate(
          total_fee,
          timeSpent,
          pricingRule.hourly_base_rate,
          pricingRule.one_day_rate
        )
          ? ParkingRecordRepository.getOneDayRate(
              total_fee,
              timeSpent,
              pricingRule.hourly_base_rate,
              pricingRule.one_day_rate
            )
          : total_fee;
      }

      const parkingSpace = await ParkingSpace.findByOrFail(
        "id",
        parkingRecord.parking_space_id
      );
      parkingSpace.merge({ status: "unoccupied" });
      await parkingSpace.save();

      const payment = await Payment.findByOrFail(
        "id",
        parkingRecord.payment_id
      );
      payment.merge({ payment_status: "paid", total_fee: total_fee });
      await payment.save();

      let toBeSerialized = [
        {
          id: parkingRecord.id,
          with_in_the_hour: timeAway <= 1 ? timeAway : "--",
          time_spent: timeSpent,
          payment_status: payment.payment_status,
          total_fee: total_fee,
          date_paid: payment.updated_at,
          space_number: parkingSpace.space_number,
        },
      ];

      const serialize = await ParkingRecordRepository.serialize(
        ParkingRecord.resourceKey,
        null,
        toBeSerialized
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  // validateEntryPointAndSize(sizes, entry_point, size, response) {
  //   if (!sizes.hasOwnProperty(entry_point)) {
  //     return response.status(400).json({
  //       error: "Entry point doesn't exists",
  //     });
  //   }
  //   if (!Object.values(sizes).includes(size)) {
  //     return response.status(400).json({
  //       error: "Car size can't be parked here",
  //     });
  //   }
  // }
}

module.exports = ParkingRecordController;
