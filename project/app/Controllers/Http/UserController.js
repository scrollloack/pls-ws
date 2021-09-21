"use strict";

const User = use("App/Models/User");
const Hash = use("Hash");
const { validate } = use("Validator");

class UserController {
  /**
   * Generates token to be used on parking mamangement
   * @param {object} auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @returns object
   */
  async login({ auth, request, response }) {
    try {
      const { email, password } = request.all();

      const data = {
        email: email,
        password: password,
      };

      const validation = await validate(data, User.loginRules, User.messages);
      if (validation.fails()) {
        return response.badRequest({ error: validation.messages() });
      }

      if (!(await this.checkCredentials(data))) {
        return response.badRequest({ error: "Credentials does not match" });
      }

      const token = await auth.attempt(email, password, true);

      return response.ok(token);
    } catch (err) {
      return response.internalServerError({ error: err.message });
    }
  }

  // async show({ auth, params, response }) {
  //   try {
  //     await auth.check();

  //     if (auth.user.id !== Number(params.id)) {
  //       return "You cannot see someone else's profile";
  //     }

  //     return response.ok({ user: auth.user });
  //   } catch (err) {
  //     return response.badRequest({ error: err.message });
  //   }
  // }

  /**
   * Verifies admin credentials
   * @param {object} data
   * @returns boolean
   */
  async checkCredentials(data) {
    const user = await User.findBy({ email: data.email });
    if (!user) {
      return false;
    }

    const checkPassword = await Hash.verify(data.password, user.password);
    if (!checkPassword) {
      return false;
    }

    return true;
  }
}

module.exports = UserController;
