"use strict";

const PricingRule = use("App/Models/PricingRule");
const PricingRuleRepository = make(
  "App/Models/Repositories/PricingRuleRepository"
);
const { validate } = use("Validator");

/**
 * Resourceful controller for interacting with pricingrules
 */
class PricingRuleController {
  /**
   * Show a list of all pricingrules.
   * GET pricingrules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async index({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(PricingRule.filters()),
        PricingRule.filterRules(),
        {}
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const pricingRule = await PricingRuleRepository.all(
        request.input("page"),
        request.input("per_page"),
        request.input("order_by"),
        request.input("sort_by")
      );

      const transformed = await transform.collection(
        pricingRule,
        "PricingRuleTransformer"
      );

      const serialize = await PricingRuleRepository.serialize(
        PricingRule.resourceKey,
        pricingRule,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Create/save a new pricingrule.
   * POST pricingrules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {transform} transform
   */
  async store({ request, response, transform }) {
    try {
      const validation = await validate(
        request.only(PricingRule.fillables),
        PricingRule.createOrUpdateRules,
        PricingRule.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      await PricingRuleRepository.findParkingLotId(
        request.input("parking_lot_id")
      );

      const pricingRule = await PricingRuleRepository.create(
        request.only(PricingRule.fillables)
      );

      const transformed = await transform.item(
        pricingRule,
        "PricingRuleTransformer"
      );

      const serialize = await PricingRuleRepository.serialize(
        PricingRule.resourceKey,
        null,
        transformed
      );

      return response.created(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Display a single pricingrule.
   * GET pricingrules/:id
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
        PricingRule.findRule(),
        PricingRule.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const pricingRule = await PricingRuleRepository.findPricingRuleId(
        params.id
      );

      const transformed = await transform.item(
        pricingRule,
        "PricingRuleTransformer"
      );

      const serialize = await PricingRuleRepository.serialize(
        PricingRule.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Update pricingrule details.
   * PUT or PATCH pricingrules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, transform }) {
    try {
      const dataToUpdate = request.only(PricingRule.fillables);
      const validation = await validate(
        dataToUpdate,
        PricingRule.createOrUpdateRules,
        PricingRule.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const model = await PricingRuleRepository.findPricingRuleId(params.id);
      await PricingRuleRepository.update(model, dataToUpdate);

      const transformed = await transform.item(model, "PricingRuleTransformer");

      const serialize = await PricingRuleRepository.serialize(
        PricingRule.resourceKey,
        null,
        transformed
      );

      return response.ok(serialize);
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }

  /**
   * Delete a pricingrule with id.
   * DELETE pricingrules/:id
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
        PricingRule.findRule(),
        PricingRule.messages
      );

      if (validation.fails()) {
        return response.unprocessableEntity({ errors: validation.messages() });
      }

      const pricingRule = await PricingRuleRepository.findPricingRuleId(
        params.id
      );

      await pricingRule.delete();

      return response.accepted();
    } catch (error) {
      return response.preconditionFailed(error.message);
    }
  }
}

module.exports = PricingRuleController;
