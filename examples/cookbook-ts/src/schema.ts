import { ObjectType, Field, NonNull, Schema } from "graphene-js";
import { SequelizeObjectType } from "../../../src";
import { Category, Ingredient } from "./models";

@SequelizeObjectType({ model: Category })
class CategoryType {
  // We can add here additional files
}

@SequelizeObjectType({ model: Ingredient })
class IngredientType {
  // We can add here additional files
}

@ObjectType()
class Query {
  @Field(IngredientType, { args: { id: NonNull(String) } })
  public async ingredient({ id }: { id: string }) {
    const ingredient = await Ingredient.findById(id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return ingredient;
  }
  @Field([IngredientType])
  public async ingredients() {
    const ingredients = await Ingredient.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return ingredients;
  }
  @Field(CategoryType, { args: { id: NonNull(String) } })
  public async category({ id }: { id: string }) {
    const category = await Category.findById(id);
    return category;
  }
  @Field([CategoryType])
  public async categories() {
    const categories = await Category.findAll();
    return categories;
  }
}

const schema = new Schema({ query: Query });

export default schema;
