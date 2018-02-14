import { attributesToFields, associationsToFields, Fields } from "./converter";
import { setSequelizeModel } from "./reflection";
import { assertSequelizeModel, Model, assertRegistry } from "./utils";
import { Registry, getGlobalRegistry } from "./registry";
import { getFields, ObjectTypeConfig, ObjectType } from "graphene-js";
import { ModelAttributes, ModelAssociations } from "./sequelize";

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
  let associations: ModelAssociations = (model as any).associations;
  // console.log((model as any).associations);
  // console.log(target.name, model.);
  let modelAttributeFields: Fields = attributesToFields(attributes);
  let modelAssociationFields: Fields = associationsToFields(
    associations,
    registry
  );
  let baseFields = getFields(target);
  let modelFields: Fields = {
    ...modelAttributeFields,
    ...modelAssociationFields
  };
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
  registry.register(target);
  return ObjectType(objectTypeOpts)(target);
};
