import { assertSequelizeModel, Model } from "./utils";
import * as Sequelize from "sequelize";
import { getSequelizeModel } from "./reflection";

export type RegistryMapping = Sequelize.Model<any, any>[];

export class Registry {
  public mapping: RegistryMapping[];
  constructor() {
    this.mapping = [];
  }
  public register(sequelizeType: any) {
    let model: Model = getSequelizeModel(sequelizeType);
    this.mapping.push(sequelizeType);
  }
  public getTypeForModel(model: Sequelize.Model<any, any>) {
    assertSequelizeModel(model);
    for (let sequelizeType of this.mapping) {
      let sequelizeTypeModel: Model = getSequelizeModel(sequelizeType);
      if (sequelizeTypeModel === model) {
        return sequelizeType;
      }
    }
    return null;
  }
}

let registry: Registry | null = null;

export const getGlobalRegistry = (): Registry => {
  if (registry === null) {
    registry = new Registry();
  }
  return registry;
};

export const resetGlobalRegistry = () => {
  registry = null;
};
