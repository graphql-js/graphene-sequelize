import { Hooks, Associations, DataTypes, Model } from "sequelize";

export type ModelAttributes = {
  [key: string]: {
    type: DataTypes[keyof DataTypes];
    model: Model<any, any>;
    allowNull?: boolean;
    primaryKey?: boolean;
    fieldName: string;
    field: string;
    comment?: string;
  };
};

declare namespace sequelize {
  interface Model<TInstance, TAttributes>
    extends Hooks<TInstance>,
      Associations {
    attributes: ModelAttributes;
  }
}
