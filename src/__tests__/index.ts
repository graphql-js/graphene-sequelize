import * as Index from "./../index";

describe("index", () => {
  test("has exported properties", () => {
    expect(Index).toHaveProperty("SequelizeObjectType");
    expect(Index).toHaveProperty("getGlobalRegistry");
    expect(Index).toHaveProperty("resetGlobalRegistry");
    expect(Index).toHaveProperty("Registry");
    expect(Index).toHaveProperty("getSequelizeModel");
    expect(Index).toHaveProperty("setSequelizeModel");
    expect(Index).toHaveProperty("assertSequelizeModel");
  });
});
