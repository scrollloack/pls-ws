"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("login", "UserController.login");

// Route.get("users/:id", "UserController.show").middleware("auth");

Route.resource("parking-lots", "ParkingLotController")
  .except(["edit", "create"])
  .middleware("jwt");

Route.resource("parking-space", "ParkingSpaceController")
  .except(["edit", "create"])
  .middleware("jwt");

Route.resource("pricing-rule", "PricingRuleController")
  .except(["edit", "create"])
  .middleware("jwt");

Route.resource("client-info", "ClientInfoController").except([
  "edit",
  "create",
]);

Route.group(() => {
  Route.get(
    "parking-record/:id",
    "ParkingRecordController.findParkingRecordById"
  );
  Route.post("parking-record", "ParkingRecordController.park");
  Route.put("parking-record/:id", "ParkingRecordController.unpark");
});
