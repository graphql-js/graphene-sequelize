# [Graphene-JS](http://graphene-js.org) [![Build Status](https://travis-ci.org/graphql-js/graphene-sequelize.svg?branch=master)](https://travis-ci.org/graphql-js/graphene-sequelize) [![PyPI version](https://badge.fury.io/js/graphene-sequelize.svg)](https://badge.fury.io/js/graphene-sequelize) [![Coverage Status](https://coveralls.io/repos/graphql-js/graphene-sequelize/badge.svg?branch=master&service=github)](https://coveralls.io/github/graphql-js/graphene-sequelize?branch=master)

A [Sequelize](http://docs.sequelizejs.com/) integration for [Graphene-JS](http://graphene-js.org/).

## Installation

For installing Graphene Sequelize, just run this command in your shell

```bash
npm install --save graphene-sequelize
# or
yarn add graphene-sequelize
```

## Examples

Here is a simple Sequelize model:

```js
import * as Sequelize from "sequelize";

const UserModel = sequelize.define("user", {
  name: Sequelize.STRING,
  lastName: Sequelize.STRING
});
```

To create a GraphQL schema for it you simply have to write the following:

```js
import { ObjectType, Field, Schema } from "graphene";
import { SequelizeObjectType } from "graphene-sequelize";

@SequelizeObjectType({ model: UserModel })
class User {
  // Fields will be populated automatically from the sequelize
  // model, and we can also add extra fields here.
}

class Query {
  @Field([User])
  users() {
    return UserModel.findAll();
  }
}

schema = new Schema({ query: Query });
```

Then you can simply query the schema:

```js
const query = `
query {
  users {
    name,
    lastName
  }
}
`
result = await schema.execute(query)
```

To learn more check out the following [examples](examples/):

* **Schema with Filtering**: [Cookbook example](examples/cookbook)
* **Relay Schema**: [Starwars Relay example](examples/starwars)

## Contributing

After developing, the full test suite can be evaluated by running:

```sh
yarn test --coverage
```

### Documentation

The [documentation](http://docs.graphene-js.org/projects/sequelize/en/latest/) is generated using the excellent [Sphinx](http://www.sphinx-doc.org/) and a custom theme.

The documentation dependencies are installed by running:

```sh
cd docs
pip install -r requirements.txt
```

Then to produce a HTML version of the documentation:

```sh
make html
```
