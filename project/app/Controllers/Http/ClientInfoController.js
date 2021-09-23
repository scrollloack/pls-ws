"use strict";

const ClientInfo = use("App/Models/ClientInfo");
const ClientInfoRepository = make(
  "App/Models/Repositories/ClientInfoRepository"
);
const { validate } = use("Validator");

/**
 * Resourceful controller for interacting with clientinfos
 */
class ClientInfoController {
  /**
   * Show a list of all clientinfos.
   * GET clientinfos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async index({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(ClientInfo.filters()),
        ClientInfo.filterRules(),
        {}
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const clientInfo = await ClientInfoRepository.all(
        request.input("page"),
        request.input("per_page"),
        request.input("order_by"),
        request.input("sort_by")
      );

      const transformed = await transform.collection(
        clientInfo,
        "ClientInfoTransformer"
      );

      const serialize = await ClientInfoRepository.serialize(
        ClientInfo.resourceKey,
        clientInfo,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Create/save a new clientinfo.
   * POST clientinfos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async store({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(ClientInfo.fillables),
        ClientInfo.createOrUpdateRules,
        ClientInfo.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const clientInfo = await ClientInfoRepository.create(
        request.only(ClientInfo.fillables)
      );

      const transformed = await transform.item(
        clientInfo,
        "ClientInfoTransformer"
      );

      const serialize = await ClientInfoRepository.serialize(
        ClientInfo.resourceKey,
        null,
        transformed
      );

      return response.created(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Display a single clientinfo.
   * GET clientinfos/:id
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
        ClientInfo.findRule(),
        ClientInfo.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const clientInfo = await ClientInfoRepository.findClientInfoId(params.id);

      const transformed = await transform.item(
        clientInfo,
        "ClientInfoTransformer"
      );

      const serialize = await ClientInfoRepository.serialize(
        ClientInfo.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Update clientinfo details.
   * PUT or PATCH clientinfos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async update({ params, request, response, transform }) {
    try {
      const dataToUpdate = request.only(ClientInfo.fillables);
      const validation = await validate(
        dataToUpdate,
        ClientInfo.createOrUpdateRules,
        ClientInfo.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const model = await ClientInfoRepository.findClientInfoId(params.id);
      await ClientInfoRepository.update(model, dataToUpdate);

      const transformed = await transform.item(model, "ClientInfoTransformer");

      const serialize = await ClientInfoRepository.serialize(
        ClientInfo.resourceKey,
        null,
        transformed
      );
      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Delete a clientinfo with id.
   * DELETE clientinfos/:id
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
        ClientInfo.findRule(),
        ClientInfo.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const clientInfo = await ClientInfoRepository.findClientInfoId(params.id);

      await clientInfo.delete();

      return response.accepted();
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }
}

module.exports = ClientInfoController;
