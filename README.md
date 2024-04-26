# Task Manager

> This is a comprehensive task management application designed to organize, and prioritize tasks.

## Installation

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/ORG/PROJECT.git
$ cd task-manager
```

To install dependencies, run:

```sh
$ npm install
```

## Usage

### Serving the app

```sh
$ npm start
```

The application is running on [localhost](http:localhost:3000/tasks).

### Running the tests

```sh
$ npm test
```

## API

1. **GET /tasks** - Retrieve all the tasks.
2. **GET /tasks?completed=true&sort=DESC** - Retrieve sorted data based on creation date and completion status.
3. **GET /tasks/:id** - Retrieve a single task by its ID.
4. **GET /tasks/priority/:level** - Retrieve tasks based on the input priority level.
5. **POST /tasks** - Create a new task.
6. **PUT /tasks/:id** - Update an existing task by its ID.
7. **DELETE /tasks/:id** -Delete a task by its ID.
