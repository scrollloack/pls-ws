"use strict";

class userCredentials {
  get rules() {
    return {
      email: "required|email",
      password: "required",
    };
  }

  get messages() {
    return {
      "email.required": "Email is required",
      "email.email": "Email should be an email",
      "password.required": "Password is required",
    };
  }
}

module.exports = userCredentials;
