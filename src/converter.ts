import { ModelAssociations } from "./sequelize.d";
import * as Sequelize from "sequelize";
import { DataTypes as DT, Associations } from "sequelize";
import {
  Int,
  Float,
  Date,
  DateTime,
  Time,
  Boolean,
  ID,
  List,
  NonNull,
  Field,
  DynamicField,
  FieldConfig
} from "graphene-js";
import { ModelAttributes } from "./sequelize";
import { Registry } from ".";

// Hack to fix the typing issue on Sequelize
// as DataTypes is written as an interface rather than a proper type structure.
const DataTypes: DT = (Sequelize as any).DataTypes;

type DataType = DT[keyof DT];

const ATTR_MAPPING = [
  // [DataTypes.ABSTRACT, null],
  [DataTypes.STRING, String],
  [DataTypes.CHAR, String],
  [DataTypes.TEXT, String],
  [DataTypes.TINYINT, Int],
  [DataTypes.SMALLINT, Int],
  [DataTypes.MEDIUMINT, Int],
  [DataTypes.INTEGER, Int],
  [DataTypes.BIGINT, Int],
  [DataTypes.FLOAT, Float],
  [DataTypes.NUMBER, Number],
  [DataTypes.DATEONLY, Date],
  [DataTypes.TIME, Time],
  [DataTypes.DATE, DateTime],
  [DataTypes.BOOLEAN, Boolean],
  [DataTypes.NOW, DateTime],
  [DataTypes.BLOB, String],
  [DataTypes.DECIMAL, Float],
  [DataTypes.NUMERIC, Number],
  [DataTypes.UUID, ID],
  [DataTypes.UUIDV1, ID],
  [DataTypes.UUIDV4, ID],
  [DataTypes.HSTORE, null],
  [DataTypes.JSON, null],
  [DataTypes.JSONB, null],
  [DataTypes.VIRTUAL, null],
  [DataTypes.ARRAY, List],
  [DataTypes.NONE, null],
  [DataTypes.ENUM, null],
  [DataTypes.RANGE, List],
  [DataTypes.REAL, Float],
  [DataTypes.DOUBLE, Float],
  [DataTypes["DOUBLE PRECISION"], Float],
  [DataTypes.GEOMETRY, null]
];

export const getGrapheneTypeFromAttributeType = (type: DataType): any => {
  for (let [dataType, grapheneType] of ATTR_MAPPING) {
    // console.log(dataType);
    if (type instanceof <any>dataType) {
      return grapheneType;
    }
  }
  return null;
};

export type Fields = {
  [key: string]: (target: any, name: string) => void;
};

export const attributesToFields = (attributes: ModelAttributes): Fields => {
  let fields: Fields = {};
  for (let attrName in attributes) {
    let attribute = attributes[attrName];
    let grapheneType = getGrapheneTypeFromAttributeType(attribute.type);
    if (!grapheneType) {
      continue;
    }
    if (attribute.allowNull === false) {
      grapheneType = NonNull(grapheneType);
    }
    fields[attrName] = Field(grapheneType, { description: attribute.comment });
  }
  return fields;
};

const getResolverGetter = (
  model: Sequelize.Model<any, any>,
  name: string
): Function => {
  return (<any>model).prototype[
    "get" + name.substr(0, 1).toUpperCase() + name.substr(1)
  ];
};

export const associationsToFields = (
  associations: ModelAssociations,
  registry: Registry
): Fields => {
  let fields: Fields = {};
  for (let associationName in associations) {
    let association = associations[associationName];
    // let fieldType: any;
    // fields[associationName] = Field()
    switch (association.associationType) {
      case "HasMany":
      case "BelongsToMany":
        fields[associationName] = DynamicField((): FieldConfig | null => {
          let targetType = registry.getTypeForModel(association.target);
          if (!targetType) {
            return null;
          }
          let resolverGetter = getResolverGetter(
            association.source,
            associationName
          );

          return {
            type: List(targetType),
            resolver: function(root: any) {
              return resolverGetter.call(root);
            }
          };
        });
        break;
      case "HasOne":
      case "BelongsTo":
        fields[associationName] = DynamicField((): FieldConfig | null => {
          let targetType = registry.getTypeForModel(association.target);
          if (!targetType) {
            return null;
          }
          let resolverGetter = getResolverGetter(
            association.source,
            associationName
          );
          return {
            type: targetType,
            resolver: function(root: any) {
              return resolverGetter.call(root);
            }
          };
        });
        break;
      default:
        break;
    }
    // if ()
    // console.log(
    //   associationName,
    //   association.source,
    //   association.target,
    //   association.as,
    //   association.associationType
    // );
  }
  return fields;
};
