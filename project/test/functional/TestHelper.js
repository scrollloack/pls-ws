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
}

module.exports = TestHelper;
