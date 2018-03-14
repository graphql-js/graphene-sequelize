import { sequelize, Category, Ingredient } from "../models";
import schema from "../schema";

beforeAll(() => {
  return sequelize.sync().then(() => {
    Category.create({
      id: 1,
      name: "Dairy",
    });
    Category.create({ id: 2, name: "Meat" });
    Ingredient.create({
      id: 1,
      name: "Eggs",
      notes: "Good old eggs",
      category_id: 1,
    });
    Ingredient.create({
      id: 2,
      name: "Milk",
      notes: "Comes from a cow",
      category_id: 1,
    });
    Ingredient.create({
      id: 3,
      name: "Beef",
      notes: "Much like milk, this comes from a cow",
      category_id: 2,
    });
    Ingredient.create({
      id: 4,
      name: "Chicken",
      notes: "Definitely doesn't come from a cow",
      category_id: 2,
    });
  });
});

describe("models", () => {
  test("has seed data correctly setup", async () => {
    expect(Category.count()).resolves.toEqual(2);
    expect(Ingredient.count()).resolves.toEqual(4);

    const milk = (await Ingredient.findById(2, {
      include: [{ model: Category, as: "category" }],
    })) as any;
    expect(milk).not.toBeNull();
    expect(milk.name).toEqual("Milk");
    expect(milk.notes).toEqual("Comes from a cow");
    expect(milk.category.name).toEqual("Dairy");
  });
});

describe("schema", () => {
  test("can be queried with graphql", async () => {
    const query = `
      query GetIngredients {
        ingredients {
          id
          name
          notes
          category {
            name
          }
        }
      }
  `;
    const result = (await schema.execute(query)) as any;
    expect(result.data.ingredients).toHaveLength(4);

    const milk = result.data.ingredients[1];
    expect(milk.name).toEqual("Milk");
    expect(milk.notes).toEqual("Comes from a cow");
    expect(milk.category.name).toEqual("Dairy");
  });
});
