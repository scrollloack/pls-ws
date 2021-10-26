"use strict";

const ParkingSpace = use("App/Models/ParkingSpace");
const ParkingSpaceRepository = make(
  "App/Models/Repositories/ParkingSpaceRepository"
);
const { validate } = use("Validator");
const _ = use("lodash");

/**
 * Resourceful controller for interacting with parkingspaces
 */
class ParkingSpaceController {
  /**
   * Show a list of all parkingspaces.
   * GET parkingspaces
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async index({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(ParkingSpace.filters()),
        ParkingSpace.filterRules(),
        {}
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingSpace = await ParkingSpaceRepository.all(
        request.input("page"),
        request.input("per_page"),
        request.input("order_by"),
        request.input("sort_by")
      );

      const transformed = await transform.collection(
        parkingSpace,
        "ParkingSpaceTransformer"
      );

      const serialize = await ParkingSpaceRepository.serialize(
        ParkingSpace.resourceKey,
        parkingSpace,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Create/save a new parkingspace.
   * POST parkingspaces
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async store({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(ParkingSpace.fillables),
        ParkingSpace.createOrUpdateRules,
        ParkingSpace.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const checkSpaceNumber = await ParkingSpace.query()
        .where("parking_lot_id", request.input("parking_lot_id"))
        .andWhere("space_number", request.input("space_number"))
        .fetch();

      if (!_.isEmpty(checkSpaceNumber.toJSON())) {
        return response
          .status(400)
          .json({ error: "Space Number already exists for the Parking Lot" });
      }

      await ParkingSpaceRepository.findParkingLotId(
        request.input("parking_lot_id")
      );

      const parkingSpace = await ParkingSpaceRepository.create(
        request.only(ParkingSpace.fillables)
      );

      const transformed = await transform.item(
        parkingSpace,
        "ParkingSpaceTransformer"
      );

      const serialize = await ParkingSpaceRepository.serialize(
        ParkingSpace.resourceKey,
        null,
        transformed
      );

      return response.created(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Display a single parkingspace.
   * GET parkingspaces/:id
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
        ParkingSpace.findRule(),
        ParkingSpace.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingSpace = await ParkingSpaceRepository.findParkingSpaceId(
        params.id
      );

      const transformed = await transform.item(
        parkingSpace,
        "ParkingSpaceTransformer"
      );

      const serialize = await ParkingSpaceRepository.serialize(
        ParkingSpace.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Update parkingspace details.
   * PUT or PATCH parkingspaces/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async update({ params, request, response, transform }) {
    try {
      const dataToUpdate = request.only(ParkingSpace.fillables);
      const validation = await validate(
        dataToUpdate,
        ParkingSpace.createOrUpdateRules,
        ParkingSpace.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const checkSpaceNumber = await ParkingSpace.query()
        .where("parking_lot_id", request.input("parking_lot_id"))
        .andWhere("space_number", request.input("space_number"))
        .fetch();

      if (!_.isEmpty(checkSpaceNumber.toJSON())) {
        return response
          .status(400)
          .json({ error: "Space Number already exists for the Parking Lot" });
      }

      const model = await ParkingSpaceRepository.findParkingSpaceId(params.id);
      await ParkingSpaceRepository.update(model, dataToUpdate);

      const transformed = await transform.item(
        model,
        "ParkingSpaceTransformer"
      );

      const serialize = await ParkingSpaceRepository.serialize(
        ParkingSpace.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Delete a parkingspace with id.
   * DELETE parkingspaces/:id
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
        ParkingSpace.findRule(),
        ParkingSpace.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const parkingSpace = await ParkingSpaceRepository.findParkingSpaceId(
        params.id
      );

      await parkingSpace.delete();

      return response.accepted();
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }
}

module.exports = ParkingSpaceController;
