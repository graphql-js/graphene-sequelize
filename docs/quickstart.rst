Getting started
===============

What is GraphQL?
----------------

For an introduction to GraphQL and an overview of its concepts, please refer
to `the official introduction <http://graphql.org/learn/>`_.

Let’s build a basic GraphQL schema from sequelize models.

Requirements
------------

-  Node or Typescript(any)
-  Graphene-JS

Project setup
-------------

.. code:: bash

    yarn add graphene-sequelize
    # or
    npm install graphene-sequelize

Creating a basic Schema
-----------------------

A GraphQL schema describes your data model, and provides a GraphQL
server with an associated set of resolve methods that know how to fetch
data.

We are going to create a very simple schema, with a ``Query`` with only
one field: ``hello`` and an input name. And when we query it, it should return ``"Hello {name}"``.

.. code:: js

    import * as Sequelize from "sequelize";
    import { ObjectType, Field, NonNull } from "graphene";
    import { SequelizeObjectType } from "graphene-sequelize";

    // We define the Sequelize Models
    const sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: 'db.sqlite',
    });

    const Project = sequelize.define('project', {
        title: Sequelize.STRING,
        description: Sequelize.TEXT
    })

    const Task = sequelize.define('task', {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        deadline: Sequelize.DATE
    })

    // We define the GraphQL types

    @SequelizeObjectType({model: Project})
    class ProjectType {
        // We can add here additional files
    }

    @SequelizeObjectType({model: Task})
    class TaskType {
        // We can add here additional files
    }
    
    @ObjectType()
    class Query {
        @Field(ProjectType, { args: {id: NonNull(String)}})
        getProject({id}) {
            return Project.findById(id);
        }
    }

    schema = new Schema({query: Query})


Querying
--------

Then we can start querying our schema:

.. code:: js

    var result = await schema.execute('{ getProject(id: "1") { id, title } }')
    console.log(result.data.getProject)

Congrats! You got your first graphene sequelize schema working!
