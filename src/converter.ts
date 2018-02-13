import * as Sequelize from "sequelize";
import { DataTypes as DT } from "sequelize";
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
  Field
} from "graphene-js";
import { ModelAttributes } from "./sequelize";

// Hack to fix the typing issue on Sequelize
// as DataTypes is written as an interface rather than a object structure.
const DataTypes: DT = (Sequelize as any).DataTypes;

type DataType = DT[keyof DT];

const ATTR_MAPPING: Map<DataType, any> = new Map([
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
]);

export const getGrapheneTypeFromAttributeType = (type: DataType): any => {
  for (let [dataType, grapheneType] of ATTR_MAPPING.entries()) {
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
