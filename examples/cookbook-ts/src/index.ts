import * as express from "express";
import * as bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";

import schema from "./schema";
import { sequelize, Category, Ingredient } from "./models";

sequelize.sync({ force: true }).then(() => {
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

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(8000, () => {
  // tslint:disable-next-line:no-console
  console.log("Go to http://localhost:8000/graphiql to run queries!");
});
