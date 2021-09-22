"use stric";

const User = use("App/Models/User");
const Factory = use("Factory");
const jwt = use("jsonwebtoken");
const Config = use("Config");
const moment = use("moment");
const faker = use("faker");

class TestHelper {
  static async getToken() {
    const { username, email, password } = await Factory.model(
      "App/Models/User"
    ).make();

    const user = await User.create({
      username,
      email,
      password,
    });

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

    return token;
  }

  static listFilters() {
    return {
      pageFilter: {
        page: "asd",
        per_page: 10,
        order_by: "created_at",
        sort_by: "asc",
      },
      perPageFilter: {
        page: 1,
        per_page: "asd",
        order_by: "created_at",
        sort_by: "asc",
      },
      orderByFilter: {
        page: 1,
        per_page: 10,
        order_by: "asd",
        sort_by: "asc",
      },
      sortByFilter: {
        page: 1,
        per_page: 10,
        order_by: "created_at",
        sort_by: "asd",
      },
    };
  }

  static parkingLotPayloadProvider() {
    const x = 1,
      y = 6;
    let entryPointItems = ["A", "B", "C"];
    let sizeItems = [0, 1, 2];
    const data = {
      description: faker.lorem.word(),
      entry_point:
        entryPointItems[Math.floor(Math.random() * entryPointItems.length)],
      size: sizeItems[Math.floor(Math.random() * sizeItems.length)],
      max_occupants: ~~(Math.random() * y) + x,
    };

    return data;
  }

  static parkingSpacePayloadProvider() {
    const data = {
      parking_lot_id: faker.datatype.number({ min: 1, max: 3 }),
      space_number: faker.datatype.number({ min: 1, max: 100 }),
    };

    return data;
  }

  static pricingRulePayloadProvider() {
    return {
      parking_lot_id: faker.datatype.number({ min: 1, max: 3 }),
      base_rate: parseFloat(
        faker.datatype.number({ min: 40, max: 60, precision: 0.01 })
      ),
      hourly_base_rate: parseFloat(
        faker.datatype.number({
          min: 20,
          max: 30,
          precision: 0.01,
        })
      ),
      one_day_rate: parseFloat(
        faker.datatype.number({
          min: 5000,
          max: 6000,
          precision: 0.01,
        })
      ),
    };
  }
}

module.exports = TestHelper;
