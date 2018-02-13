import { attributesToFields, Fields } from "./converter";
import { setSequelizeModel } from "./reflection";
import { assertSequelizeModel, Model, assertRegistry } from "./utils";
import { Registry, getGlobalRegistry } from "./registry";
import { getFields, ObjectTypeConfig, ObjectType } from "graphene-js";
import { ModelAttributes } from "./sequelize";

export type SequelizeObjectTypeConfig = ObjectTypeConfig & {
  model: Model;
  registry?: Registry;
};

export const SequelizeObjectType = (opts: SequelizeObjectTypeConfig) => <
  T extends { new (...args: any[]): {}; [key: string]: any }
>(
  target: T
): T => {
  let { model, registry, ...objectTypeOpts } = opts;
  assertSequelizeModel(model);
  if (!registry) {
    registry = getGlobalRegistry();
  } else {
    assertRegistry(registry);
  }
  let attributes: ModelAttributes = (model as any).attributes;
  let fields: Fields = attributesToFields(attributes);
  for (let fieldName in fields) {
    let field = fields[fieldName];
    // We setup the field
    field(target.prototype, fieldName);
  }
  // let fields = getFields(target);
  setSequelizeModel(target, model);
  return ObjectType(objectTypeOpts)(target);
};
