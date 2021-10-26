"use strict";

const User = use("App/Models/User");
const Hash = use("Hash");
const { validate } = use("Validator");
const Config = use("Config");
const jwt = use("jsonwebtoken");

class UserController {
  /**
   * Generates token to be used on parking mamangement
   * @param {object} ctx
   * @param {object} auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @returns object
   */
  async login({ request, response }) {
    try {
      const { email, password } = request.all();

      const data = {
        email: email,
        password: password,
      };

      const validation = await validate(data, User.loginRules, User.messages);
      if (validation.fails()) {
        return response.unprocessableEntity({ error: validation.messages() });
      }

      const user = await User.findBy({ email: data.email });

      let checkPassword = null;

      if (user) {
        checkPassword = await Hash.verify(data.password, user.password);
      }

      if (!user || !checkPassword) {
        return response.badRequest({ error: "Credentials does not match" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        Config.get("jwt.token")
      );

      user.token = token;
      await user.save();

      return response.ok({ token: token });
    } catch (err) {
      return response.preconditionFailed(error.message);
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
}

module.exports = UserController;
