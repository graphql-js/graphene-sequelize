import { GraphQLObjectType } from "graphql";
import * as Sequelize from "sequelize";
import {
  getFields,
  getGraphQLType,
  ObjectType,
  Field,
  ID,
  Schema
} from "graphene-js";

import { Model } from "./../utils";
import { SequelizeObjectType } from "./../types";
import { Registry } from "./../registry";
import { resetGlobalRegistry } from "..";

describe("utils", () => {
  const sequelize = new Sequelize("db", "username", "pass", {
    dialect: "sqlite",
    storage: ":memory:",
    logging: () => null
  });

  let userModel: Model = sequelize.define("user", {
    name: Sequelize.STRING,
    lastName: { type: Sequelize.STRING, comment: "The last name" }
  });

  let companyModel: Model = sequelize.define("company", {
    name: Sequelize.STRING
  });

  // companyModel.hasOne(userModel, { as: "owner" });
  companyModel.belongsToMany(userModel, {
    as: "employees",
    through: "CompanyEmployees",
    foreignKey: "companyId"
  });

  const createCompany = async (employees: any[]) => {
    let company = await companyModel.create({
      name: "GraphQL"
    });
    await company.setEmployees(employees);
    return company;
  };

  const createUsers = async () => {
    await userModel.create({
      name: "Lee",
      lastName: "Byron"
    });

    await userModel.create({
      name: "Oleg",
      lastName: "Ilyenko"
    });

    await userModel.create({
      name: "Sashko",
      lastName: "Stubailo"
    });

    await userModel.create({
      name: "Johannes",
      lastName: "Schickling"
    });
  };
  beforeEach(async () => {
    resetGlobalRegistry();
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.drop();
  });

  test("SequelizeObjectType works", () => {
    @SequelizeObjectType({ model: userModel })
    class User {}

    expect(
      (<GraphQLObjectType>getGraphQLType(User)).getFields()
    ).toMatchSnapshot();
  });

  test("SequelizeObjectType can overwrite field", () => {
    @SequelizeObjectType({ model: userModel })
    class User {
      @Field(String) public id: string;
    }

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
      @SequelizeObjectType({ model: userModel, registry: <any>{} })
      class User {}
    }).toThrowErrorMatchingSnapshot();
  });

  test("SequelizeObjectType can query", async () => {
    @SequelizeObjectType({ model: userModel })
    class User {
      @Field(String)
      private fullName(this: any) {
        return `${this.name} ${this.lastName}`;
      }
    }

    @ObjectType()
    class Query {
      @Field(User, { args: { id: ID } })
      private getUser({ id }: { id: string }) {
        return userModel.findById(id);
      }

      @Field([User])
      private allUsers() {
        return userModel.findAll();
      }
    }

    await createUsers();

    const schema = new Schema({ query: Query });
    const result = await schema.execute(
      `{ allUsers { id name lastName fullName } }`
    );
    expect(result).toMatchSnapshot();
  });

  test("SequelizeObjectType set many relations", () => {
    @SequelizeObjectType({ model: userModel })
    class User {}

    @SequelizeObjectType({ model: companyModel })
    class Company {}

    expect(
      (<GraphQLObjectType>getGraphQLType(Company)).getFields()
    ).toHaveProperty("employees");

    expect(
      (<GraphQLObjectType>getGraphQLType(Company)).getFields()
    ).toMatchSnapshot();
  });

  test("SequelizeObjectType set many relations (reverse registration)", () => {
    @SequelizeObjectType({ model: companyModel })
    class Company {}

    @SequelizeObjectType({ model: userModel })
    class User {}

    expect(
      (<GraphQLObjectType>getGraphQLType(Company)).getFields()
    ).toHaveProperty("employees");

    expect(
      (<GraphQLObjectType>getGraphQLType(Company)).getFields()
    ).toMatchSnapshot();
  });

  test("SequelizeObjectType many relations can resolve", async () => {
    @SequelizeObjectType({ model: companyModel })
    class Company {}

    @SequelizeObjectType({ model: userModel })
    class User {
      @Field(String)
      private fullName(this: any) {
        return `${this.name} ${this.lastName}`;
      }
    }

    await createUsers();
    let employees = await userModel.findAll();
    let company = await createCompany(employees);
    @ObjectType()
    class Query {
      @Field(Company)
      protected company() {
        return company;
      }
    }

    const schema = new Schema({ query: Query });
    const result = await schema.execute(
      `{ company { id, employees { id fullName } } }`
    );
    expect(result).toMatchSnapshot();
  });
});
