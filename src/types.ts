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
  let modelFields: Fields = attributesToFields(attributes);
  let baseFields = getFields(target);
  for (let fieldName in modelFields) {
    if (fieldName in baseFields) {
      // If the field is already defined on the base
      // objecttype, then we just skip it to avoid conflict.
      continue;
    }
    let field = modelFields[fieldName];
    // We setup the field
    field(target.prototype, fieldName);
  }
  setSequelizeModel(target, model);
  return ObjectType(objectTypeOpts)(target);
};
