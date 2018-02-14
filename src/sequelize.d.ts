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

export type AssociationType =
  | "HasMany"
  | "BelongsTo"
  | "HasOne"
  | "BelongsToMany";

export type Association = {
  source: Model<any, any>;
  target: Model<any, any>;
  options: any;
  isSelfAssociation: boolean;
  as?: string;
  associationType: AssociationType;
};

export type ModelAssociations = {
  [key: string]: Association;
};

declare namespace sequelize {
  interface Model<TInstance, TAttributes>
    extends Hooks<TInstance>,
      Associations {
    attributes: ModelAttributes;
    associations: ModelAssociations;
  }
}
