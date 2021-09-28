"use strict";

const ParkingRecord = use("App/Models/ParkingRecord");
const ParkingSpace = use("App/Models/ParkingSpace");
const ClientInfo = use("App/Models/ClientInfo");
const Payment = use("App/Models/Payment");
const PricingRule = use("App/Models/PricingRule");
const JSONAPISerializer = use("json-api-serializer");
const Serializer = new JSONAPISerializer();
const NotFoundException = use("App/Exceptions/NotFoundException");
const CreateException = use("App/Exceptions/CreateException");
const DB = use("Database");
const _ = use("lodash");

class ParkingRecordRepository {
  /**
   * Checks car size and returns appropriate unoccupied parking spaces
   *
   * @param {sizes} sizes
   * @param {car_size} car_size
   * @param {entry_point} entry_point
   * @returns model
   */
  async allParkingSpace(sizes, car_size, entry_point) {
    const selectedFields = [
      "parking_spaces.id",
      "parking_spaces.parking_lot_id",
      "parking_spaces.space_number",
      "parking_spaces.status",
      "parking_lots.description",
      "parking_lots.entry_point",
      "parking_lots.size",
      "parking_lots.max_occupants",
    ];

    let model = null;

    switch (car_size) {
      case sizes.A:
        model = await DB.select(selectedFields)
          .from("parking_spaces")
          .leftJoin(
            "parking_lots",
            "parking_spaces.parking_lot_id",
            "parking_lots.id"
          )
          .where("parking_spaces.status", "unoccupied");
        break;
      case sizes.B:
        model = await DB.select(selectedFields)
          .from("parking_spaces")
          .leftJoin(
            "parking_lots",
            "parking_spaces.parking_lot_id",
            "parking_lots.id"
          )
          .where("parking_spaces.status", "unoccupied")
          .whereNot("parking_spaces.parking_lot_id", 1);
        break;
      case sizes.C:
        model = await DB.select(selectedFields)
          .from("parking_spaces")
          .leftJoin(
            "parking_lots",
            "parking_spaces.parking_lot_id",
            "parking_lots.id"
          )
          .where("parking_spaces.status", "unoccupied")
          .whereNot("parking_spaces.parking_lot_id", "<=", 2);
        break;
    }

    if (entry_point == "C") {
      model = await _.orderBy(
        model,
        ["entry_point", "space_number"],
        ["desc", "desc"]
      );
    } else if (entry_point == "B") {
      model = await _.orderBy(
        model,
        ["entry_point", "space_number"],
        ["asc", "asc"]
      );
      let finalModel = [];
      let temp = await _.filter(model, ["entry_point", "B"]);
      await temp.forEach((element) => {
        finalModel.push(element);
      });
      temp = await _.filter(model, ["entry_point", "A"]);
      await temp.forEach((element) => {
        finalModel.push(element);
      });
      temp = await _.filter(model, ["entry_point", "C"]);
      await temp.forEach((element) => {
        finalModel.push(element);
      });

      model = finalModel;
    } else {
      model = await _.orderBy(
        model,
        ["entry_point", "space_number"],
        ["asc", "asc"]
      );
    }

    return model;
  }

  async findNearestParkingSpace(spaces) {
    return await _.head(spaces);
  }

  async findClientInfoByPlateNumber(plate_number) {
    return ClientInfo.query()
      .where("plate_number", plate_number)
      .firstOrFail()
      .then(
        (response) => {
          return response;
        },
        (error) => {
          return false;
        }
      );
  }

  async createClientInfo(data) {
    try {
      return await ClientInfo.create(data);
    } catch (error) {
      throw new CreateException(error);
    }
  }

  async createPayment() {
    try {
      return await Payment.create({
        payment_status: "pending",
        total_fee: null,
      });
    } catch (error) {
      throw new CreateException(error);
    }
  }

  async findParkingRecordIfAlreadyExists(client_info_id, plate_number) {
    return await DB.select("*")
      .from("parking_records")
      .leftJoin(
        "parking_spaces",
        "parking_records.parking_space_id",
        "parking_spaces.id"
      )
      .leftJoin(
        "client_infos",
        "parking_records.client_info_id",
        "client_infos.id"
      )
      .where("parking_spaces.status", "occupied")
      .andWhere("client_infos.id", client_info_id)
      .andWhere("client_infos.plate_number", plate_number);
  }

  async createParkingRecord(data) {
    try {
      const selectedFields = [
        "parking_records.id",
        "parking_lots.description",
        "parking_lots.entry_point",
        "parking_spaces.space_number",
        "client_infos.plate_number",
        "parking_records.created_at",
        "parking_records.updated_at",
      ];

      const parkingRecord = await ParkingRecord.create(data);

      const record = await DB.select(selectedFields)
        .from("parking_records")
        .leftJoin(
          "parking_lots",
          "parking_records.parking_lot_id",
          "parking_lots.id"
        )
        .leftJoin(
          "parking_spaces",
          "parking_records.parking_space_id",
          "parking_spaces.id"
        )
        .leftJoin(
          "client_infos",
          "parking_records.client_info_id",
          "client_infos.id"
        )
        .where("parking_records.id", parkingRecord.id);

      await ParkingSpace.query()
        .where("space_number", record[0].space_number)
        .andWhere("id", data.parking_space_id)
        .update({ status: "occupied" });

      return record;
    } catch (error) {
      throw new CreateException(error);
    }
  }

  async findPricingRule(parking_lot_id) {
    return PricingRule.query()
      .where("parking_lot_id", parking_lot_id)
      .firstOrFail()
      .then(
        (response) => {
          return response;
        },
        (error) => {
          throw new NotFoundException(error);
        }
      );
  }

  async findParkingRecord(id) {
    return await ParkingRecord.query()
      .where("id", id)
      .firstOrFail()
      .then(
        (response) => {
          return response;
        },
        (error) => {
          throw new NotFoundException(error);
        }
      );
  }

  async checkPayment(id) {
    return await Payment.query()
      .where("id", id)
      .andWhere("payment_status", "paid")
      .firstOrFail()
      .then(
        (response) => {
          return response;
        },
        (error) => {
          return false;
        }
      );
  }

  async findOldParkingRecord(client_info_id) {
    const selectedFields = [
      "parking_records.id",
      "parking_lots.description",
      "parking_lots.entry_point",
      "parking_spaces.space_number",
      "client_infos.plate_number",
      "payments.payment_status",
      "payments.total_fee",
      "parking_records.created_at",
      "parking_records.updated_at",
    ];

    let model = await DB.select(selectedFields)
      .from("parking_records")
      .leftJoin(
        "parking_lots",
        "parking_records.parking_lot_id",
        "parking_lots.id"
      )
      .leftJoin(
        "parking_spaces",
        "parking_records.parking_space_id",
        "parking_spaces.id"
      )
      .leftJoin(
        "client_infos",
        "parking_records.client_info_id",
        "client_infos.id"
      )
      .leftJoin("payments", "parking_records.payment_id", "payments.id")
      .where("client_infos.id", client_info_id)
      .andWhere("payments.payment_status", "paid");

    model = _.last(model);

    return model;
  }

  getHourlyRateForOldRecord(total_fee, time_spent, hourly_base_rate) {
    let hourlyRate = parseInt(hourly_base_rate) * time_spent;

    total_fee = parseFloat(hourlyRate).toFixed(2);

    return total_fee;
  }

  getHourlyRate(total_fee, time_spent, hourly_base_rate) {
    if (time_spent < 24 && time_spent > 3) {
      let tempTimeSpent = time_spent - 3;

      let hourlyRate = parseInt(hourly_base_rate) * tempTimeSpent;

      total_fee = parseFloat(
        parseFloat(total_fee) + parseFloat(hourlyRate)
      ).toFixed(2);

      return total_fee;
    }
  }

  getOneDayRate(total_fee, time_spent, hourly_base_rate, one_day_rate) {
    if (time_spent >= 24) {
      let tempTimeSpent = time_spent - 24;

      let oneDayRate = parseFloat(one_day_rate);

      let hourlyRate = parseInt(hourly_base_rate)
        ? parseInt(hourly_base_rate) * tempTimeSpent
        : 0;

      total_fee = parseFloat(
        parseFloat(oneDayRate) + parseFloat(hourlyRate)
      ).toFixed(2);

      return total_fee;
    }
  }

  serialize(resourceKey, collection = null, transformed, relationships = null) {
    let toBeSerialized = {
      id: "id",
      links: {
        self: (data) => `${resourceKey}/${data.id}`,
      },
    };

    if (collection) {
      const topLevelMeta = {
        topLevelMeta: () => {
          return {
            pagination: {
              total: collection.pages.total,
              per_page: collection.pages.perPage,
              current_page: collection.pages.page,
              total_pages: collection.pages.lastPage,
            },
          };
        },
      };

      toBeSerialized = Object.assign(toBeSerialized, topLevelMeta);
    }

    Serializer.register(resourceKey, toBeSerialized);

    return Serializer.serialize(resourceKey, transformed);
  }
}

module.exports = ParkingRecordRepository;
