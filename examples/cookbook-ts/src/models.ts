import * as Sequelize from "sequelize";

export const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "db.sqlite",
  sync: { force: true },
});

export const Category = sequelize.define(
  "category",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "ingredients_category",
  }
);

export const Ingredient = sequelize.define(
  "ingredient",
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    notes: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
  },
  {
    timestamps: false,
    tableName: "ingredients_ingredient",
  }
);

Category.hasMany(Ingredient, {
  foreignKey: "category_id",
});
Ingredient.belongsTo(Category, {
  foreignKey: "category_id",
});
