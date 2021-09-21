"use strict";

const ParkingLot = use("App/Models/ParkingLot");
const ParkingLotRepository = make(
  "App/Models/Repositories/ParkingLotRepository"
);
const { validate } = use("Validator");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/**
 * Resourceful controller for interacting with parkinglots
 */
class ParkingLotController {
  /**
   * Show a list of all parkinglots.
   * GET parkinglots
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async index({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(ParkingLot.filters()),
        ParkingLot.filterRules(),
        {}
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingLot = await ParkingLotRepository.all(
        request.input("page"),
        request.input("per_page"),
        request.input("order_by"),
        request.input("sort_by")
      );

      const transformed = await transform.collection(
        parkingLot,
        "ParkingLotTransformer"
      );

      const serialize = await ParkingLotRepository.serialize(
        ParkingLot.resourceKey,
        parkingLot,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Create/save a new parkinglot.
   * POST parkinglots
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async store({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(ParkingLot.fillables),
        ParkingLot.createOrUpdateRules,
        ParkingLot.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingLot = await ParkingLotRepository.create(
        request.only(ParkingLot.fillables)
      );

      const transformed = await transform.item(
        parkingLot,
        "ParkingLotTransformer"
      );

      const serialize = await ParkingLotRepository.serialize(
        ParkingLot.resourceKey,
        null,
        transformed
      );

      return response.created(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Display a single parkinglot.
   * GET parkinglots/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async show({ params, request, response, transform }) {
    try {
      const fields = { id: params.id };

      const validation = await validate(
        fields,
        ParkingLot.findRule(),
        ParkingLot.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingLot = await ParkingLotRepository.findParkingLotId(params.id);

      const transformed = await transform.item(
        parkingLot,
        "ParkingLotTransformer"
      );

      const serialize = await ParkingLotRepository.serialize(
        ParkingLot.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Update parkinglot details.
   * PUT or PATCH parkinglots/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async update({ params, request, response, transform }) {
    try {
      const dataToUpdate = request.only(ParkingLot.fillables);
      const validation = await validate(
        dataToUpdate,
        ParkingLot.createOrUpdateRules,
        ParkingLot.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const model = await ParkingLotRepository.findParkingLotId(params.id);
      await ParkingLotRepository.update(model, dataToUpdate);

      const transformed = await transform.item(model, "ParkingLotTransformer");

      const serialize = await ParkingLotRepository.serialize(
        ParkingLot.resourceKey,
        null,
        transformed
      );
      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Delete a parkinglot with id.
   * DELETE parkinglots/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const fields = { id: params.id };

      const validation = await validate(
        fields,
        ParkingLot.findRule(),
        ParkingLot.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingLot = await ParkingLotRepository.findParkingLotId(params.id);

      await parkingLot.delete();

      return response.accepted();
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }
}

module.exports = ParkingLotController;
