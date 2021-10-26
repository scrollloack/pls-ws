"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const jwt = use("jsonwebtoken");
const Config = use("Config");

class JwtAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    if (!request.header("Authorization")) {
      return response.unauthorized({ error: "No token found in the request" });
    }

    const token = request.header("Authorization").split(" ")[1];

    try {
      jwt.verify(token, Config.get("jwt.token"));

      await next();
    } catch (err) {
      console.log(err);
      return response.unauthorized({ error: "Token invalid or has expired" });
    }
  }
}

module.exports = JwtAuth;
