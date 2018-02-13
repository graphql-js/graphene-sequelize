jest.mock("../utils");
import { setSequelizeModel } from "./../reflection";
import { Model, assertSequelizeModel } from "../utils";
import {
  Registry,
  getGlobalRegistry,
  resetGlobalRegistry
} from "./../registry";
import * as Sequelize from "sequelize";

describe("Registry", () => {
  test("can create registry", () => {
    const registry = new Registry();
    class User {}
    const mockSequelize = new Object();
    setSequelizeModel(User, <Model>mockSequelize);
    registry.register(User);
    expect(assertSequelizeModel).toBeCalledWith(mockSequelize);
    expect(registry.getTypeForModel(<any>mockSequelize)).toBe(User);
  });

  test("getTypeForModel returns null if model not in registry", () => {
    const registry = new Registry();
    class User {}
    const mockSequelize = new Object();
    expect(registry.getTypeForModel(<any>mockSequelize)).toBeNull();
  });

  test("getGlobalRegistry returns a Registry", () => {
    const registry: Registry = getGlobalRegistry();
    expect(registry).toBeInstanceOf(Registry);
  });

  test("getGlobalRegistry returns the same registry if called twice", () => {
    const registry1: Registry = getGlobalRegistry();
    const registry2: Registry = getGlobalRegistry();
    expect(registry1).toBe(registry2);
  });

  test("resetGlobalRegistry", () => {
    const registry1: Registry = getGlobalRegistry();
    resetGlobalRegistry();
    const registry2: Registry = getGlobalRegistry();
    expect(registry1).not.toBe(registry2);
  });
});
