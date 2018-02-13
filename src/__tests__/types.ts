import * as Sequelize from "sequelize";
import { Model } from "./../utils";
import { SequelizeObjectType } from "./../types";
import { Registry } from "./../registry";
import { getGraphQLType, ObjectType, Field, ID, Schema } from "graphene-js";
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

  beforeEach(async () => {
    await sequelize.sync();
    await model.sync();
  });

  afterEach(async () => {
    await model.drop();
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

  test("SequelizeObjectType can query", async () => {
    @SequelizeObjectType({ model: model })
    class User {
      @Field(String)
      fullName(this: any) {
        return `${this.name} ${this.lastName}`;
      }
    }

    await model.create({
      name: "Lee",
      lastName: "Byron"
    });

    await model.create({
      name: "Oleg",
      lastName: "Ilyenko"
    });

    await model.create({
      name: "Sashko",
      lastName: "Stubailo"
    });

    await model.create({
      name: "Johannes",
      lastName: "Schickling"
    });

    @ObjectType()
    class Query {
      @Field(User, { args: { id: ID } })
      private getUser({ id }: { id: string }) {
        return model.findById(id);
      }

      @Field([User])
      private allUsers() {
        return model.findAll();
      }
    }

    const schema = new Schema({ query: Query });
    var result = await schema.execute(
      `{ allUsers { id name lastName fullName } }`
    );
    expect(result).toMatchSnapshot();
  });
});
