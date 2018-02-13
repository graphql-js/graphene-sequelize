jest.mock("../utils");
import { Model, assertSequelizeModel } from "../utils";
import { getSequelizeModel, setSequelizeModel } from "./../reflection";
import * as Sequelize from "sequelize";

describe("Registry", () => {
  test("getSequelizeModel / setSequelizeModel works", () => {
    class User {}
    const mockSequelize = new Object();
    setSequelizeModel(User, <Model>mockSequelize);
    expect(assertSequelizeModel).toBeCalledWith(mockSequelize);
    expect(getSequelizeModel(User)).toBe(mockSequelize);
    // expect(registry.getTypeForModel(<any>mockSequelize)).toBe(User);
  });

  test("getSequelizeModel fails if doesn't have any model attached", () => {
    class User {}
    expect(() => getSequelizeModel(User)).toThrowErrorMatchingSnapshot();
    // expect(registry.getTypeForModel(<any>mockSequelize)).toBe(User);
  });

  test("setSequelizeModel fails if model is already set", () => {
    class User {}
    const mockSequelize = new Object();
    setSequelizeModel(User, <Model>mockSequelize);
    expect(() =>
      setSequelizeModel(User, <Model>mockSequelize)
    ).toThrowErrorMatchingSnapshot();
  });
});
