import { Model, assertSequelizeModel } from "./utils";
import "reflect-metadata";
import * as Sequelize from "sequelize";

export const GRAPHENE_SEQUELIZE_MODEL = "graphene:sequelize:model";

// A utility funciton to get the sequelize model given a type
export const getSequelizeModel = (target: any): Sequelize.Model<any, any> => {
  const metadataType: Model = Reflect.getMetadata(
    GRAPHENE_SEQUELIZE_MODEL,
    target
  );
  if (metadataType) {
    return metadataType;
  }
  throw new Error(
    `The target ${target} have no Sequelize type associated to it.`
  );
};

// An utility function to associate a Sequelize Model
// with the specified target.
// This method takes full advantage of the Reflection API.
export const setSequelizeModel = (
  target: any,
  model: Sequelize.Model<any, any>
): void => {
  // Has the provided type a Sequelize Model?
  // Will fail if not.
  assertSequelizeModel(model);

  // First we check this type have no other model associated with it.
  if (Reflect.hasMetadata(GRAPHENE_SEQUELIZE_MODEL, target)) {
    throw new Error(
      `Type ${String(target)} already have a Sequelize model attached.`
    );
  }
  // We define the type metadata through reflection
  Reflect.defineMetadata(GRAPHENE_SEQUELIZE_MODEL, model, target);
};
