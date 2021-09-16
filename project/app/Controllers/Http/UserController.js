"use strict";

class UserController {
  async login({ auth, request, response }) {
    try {
      const { uid, password } = request.all();
      const token = await auth.withRefreshToken().attempt(uid, password);
      console.log(token);
      return response.status(200).send(token);
    } catch (err) {
      return response.badRequest(err.message);
    }
  }

  async show({ auth, params, response }) {
    try {
      await auth.check();

      if (auth.user.id !== Number(params.id)) {
        return "You cannot see someone else's profile";
      }

      return response.status(200).send(auth.user);
    } catch (err) {
      return response.badRequest(err.message);
    }
  }
}

module.exports = UserController;
