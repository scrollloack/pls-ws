"use strict";

module.exports = {
  create: {
    errors: [
      {
        detail: "Creating resource error.",
        code: 400,
      },
    ],
  },
  show: {
    errors: [
      {
        detail: "Resource not found error.",
        code: 404,
      },
    ],
  },
  update: {
    errors: [
      {
        detail: "Update resource error.",
        code: 400,
      },
    ],
  },
  delete: {
    errors: [
      {
        detail: "Delete request is invalid or cannot be otherwise served.",
        code: 400,
      },
    ],
  },
};
