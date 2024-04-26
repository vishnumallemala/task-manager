const express = require("express");
const app = express();
const taskData = require("./task.json");
const fs = require("fs");
const Validator = require("./helpers/validator");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  let tasks = taskData.tasks;
  if (req.query.completed && req.query.completed !== "") {
    let filteredTasks;
    filteredTasks = tasks.filter(
      (task) =>
        task.completed == (req.query.completed.toLocaleLowerCase() == "true")
    );

    if (filteredTasks.length !== 0) {
      if (req.query.sort.toLocaleLowerCase() == "desc") {
        filteredTasks = filteredTasks.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );
      } else {
        filteredTasks = filteredTasks.sort(
          (a, b) => new Date(a.createdOn) - new Date(b.createdOn)
        );
      }
      return res.status(200).send(filteredTasks);
    }
    return res
      .status(404)
      .send("There are no taks present with the input completion status");
  }
  return res.status(200).send(taskData.tasks);
});

app.get("/tasks/:id", (req, res) => {
  let tasks = taskData.tasks;
  let filteredTask = tasks.filter((task) => task.id == req.params.id);
  if (filteredTask.length === 0) {
    return res
      .status(404)
      .send("No appropriate task is found with the provided task id");
  }
  res.status(200).send(filteredTask[0]);
});

app.get("/tasks/priority/:level", (req, res) => {
  let tasks = taskData.tasks;
  let filteredTasks = tasks.filter((task) => task.priority == req.params.level);
  if (filteredTasks.length === 0) {
    return res
      .status(404)
      .send("There are no tasks present with the input priority level");
  }
  return res.status(200).send(filteredTasks);
});

app.post("/tasks", (req, res) => {
  const taskInfo = req.body;
  let modifiedTaskData = taskData;
  taskInfo["id"] =
    modifiedTaskData.tasks[modifiedTaskData.tasks.length - 1].id + 1;
  taskInfo.priority = taskInfo.priority ? taskInfo.priority : "low";
  taskInfo.createdOn = new Date().toJSON();
  if (Validator.validateTaskInfo(taskInfo).status === true) {
    modifiedTaskData.tasks.push(taskInfo);
    // fs.writeFile(
    //   "./task.json",
    //   JSON.stringify(modifiedTaskData),
    //   { encoding: "utf8", flag: "w" },
    //   (err, data) => {
    //     if (err) {
    //       return res.status(500).send("Task creation failed");
    //     }
    //     return res.status(201).send("Successfully created task");
    //   }
    // );
    return res.status(201).send("Successfully created task");
  } else {
    let message = Validator.validateTaskInfo(taskInfo).message;
    res.status(400).send(message);
  }
});

app.put("/tasks/:id", (req, res) => {
  const taskInfo = req.body;
  let id = req.params.id;
  let updatedFlag = false;
  let modifiedTaskData = taskData;
  if (Validator.validateTaskInfo(taskInfo).status === true) {
    modifiedTaskData.tasks.forEach((task) => {
      if (task.id == id) {
        updatedFlag = true;
        task.title = taskInfo.title ? taskInfo.title : task.title;
        task.description = taskInfo.description
          ? taskInfo.description
          : task.description;
        task.completed = taskInfo.completed
          ? taskInfo.completed
          : task.completed;
      }
    });

    if (updatedFlag) {
      //   fs.writeFile(
      //     "./task.json",
      //     JSON.stringify(modifiedTaskData),
      //     { encoding: "utf8", flag: "w" },
      //     (err, data) => {
      //       if (err) {
      //         return res.status(500).send("Task update failed");
      //       }
      //       return res.status(201).send("Successfully updated task");
      //     }
      //   );
      return res.status(200).send("Successfully updated task");
    } else {
      return res
        .status(404)
        .send("No appropriate task is found with the provided task id");
    }
  } else {
    let message = Validator.validateTaskInfo(taskInfo).message;
    res.status(400).send(message);
  }
});

app.delete("/tasks/:id", (req, res) => {
  let id = req.params.id;
  let modifiedTaskData = taskData;

  for (let i = 0; i < modifiedTaskData.tasks.length; i++) {
    if (modifiedTaskData.tasks[i].id == id) {
      modifiedTaskData.tasks.splice(i, 1);
      //   delete modifiedTaskData.tasks[i];
      //   fs.writeFileSync(
      //     "./task.json",
      //     JSON.stringify(modifiedTaskData),
      //     { encoding: "utf8", flag: "w" },
      //     (err, data) => {
      //       if (err) {
      //         return res.status(500).send("Task delete failed");
      //       }
      //       return res.status(201).send("Successfully deleted task");
      //     }
      //   );
      return res.status(200).send("Task deleted successfully");
    }
  }

  return res
    .status(404)
    .send("No appropriate task is found with the provided task id");
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
