import * as Sequelize from "sequelize";
import { Model } from "./../utils";
import { SequelizeObjectType } from "./../types";
import { Registry } from "./../registry";
import { getGraphQLType } from "graphene-js";
import { GraphQLObjectType } from "../../../graphene-js/node_modules/@types/graphql";

describe("utils", () => {
  const sequelize = new Sequelize("db", "username", "pass", {
    dialect: "sqlite",
    storage: ":memory:",
    logging: () => null
  });

  let model: Model = sequelize.define("user", {
    name: Sequelize.STRING,
    lastName: { type: Sequelize.STRING, comment: "The last name" }
  });

  beforeEach(() => {
    model.sync();
  });

  afterEach(() => {
    model.drop();
  });

  test("SequelizeObjectType works", () => {
    @SequelizeObjectType({ model: model })
    class User {}

    expect(
      (<GraphQLObjectType>getGraphQLType(User)).getFields()
    ).toMatchSnapshot();
  });

  test("SequelizeObjectType works", () => {
    expect(() => {
      @SequelizeObjectType({ model: <any>null })
      class User {}
    }).toThrowErrorMatchingSnapshot();
  });

  test("SequelizeObjectType works", () => {
    expect(() => {
      @SequelizeObjectType({ model: model, registry: <any>{} })
      class User {}
    }).toThrowErrorMatchingSnapshot();
  });
});
