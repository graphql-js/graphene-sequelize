import * as Sequelize from "sequelize";
import { assertSequelizeModel, assertRegistry, Model } from "./../utils";
import { Registry } from "./../registry";

describe("utils", () => {
  const sequelize = new Sequelize("db", "username", "pass", {
    dialect: "sqlite",
    storage: ":memory:",
    logging: () => null
  });

  let model: Model = sequelize.define("user", {
    name: Sequelize.STRING,
    lastName: Sequelize.STRING
  });

  beforeEach(async () => {
    await model.sync();
  });

  afterEach(async () => {
    await model.drop();
  });

  test("assertSequelizeModel fails on non sequelize models", () => {
    expect(() => assertSequelizeModel(null)).toThrowErrorMatchingSnapshot();
  });

  test("assertSequelizeModel fails on model instance", async () => {
    let user = await model.create({ name: "Peter", lastName: "Griffin" });
    expect(() => assertSequelizeModel(user)).toThrowErrorMatchingSnapshot();
  });

  test("assertSequelizeModel succeeds on model", () => {
    assertSequelizeModel(model);
  });

  test("assertRegistry fails on non registry", async () => {
    let registry = new Object();
    expect(() => assertRegistry(registry)).toThrowErrorMatchingSnapshot();
  });

  test("assertRegistry succeeds on registry", () => {
    let registry = new Registry();
    assertRegistry(registry);
  });
});
