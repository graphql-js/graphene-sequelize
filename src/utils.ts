import * as Sequelize from "sequelize";
import { Registry } from "./registry";

export type Model = Sequelize.Model<any, any>;

export const assertSequelizeModel = (model: any) => {
  if (model instanceof <any>Sequelize.Model) {
    throw new Error(
      `Expected to receive a Sequelize.Model. Received a sequelize instance instead: ${model}.`
    );
  }
  if (!model || model.constructor !== Sequelize.Model.constructor) {
    throw new Error(
      `Expected to receive a Sequelize.Model. Received ${model} instead.`
    );
  }
};

export const assertRegistry = (registry: any) => {
  if (!(registry instanceof Registry)) {
    throw new Error(
      `Expected to receive a Registry instance. Received ${registry} instead.`
    );
  }
};
