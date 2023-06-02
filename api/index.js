import TodoList from "../models/lists.js";
import * as logger from "../utils/logger.js";
let api;
let errorMsg;

const createList = async (req, res) => {
  try {
    const todos = req.body.data;
    if (!todos) {
      throw new Error({ message: "Task details is required" });
      logger.error("Details field is not defined");
    }
    let list_id = Math.floor(Math.random() * 16) + `${Date.now()}`;
    const newtodos = await TodoList.create({
      list_id: list_id,
      details: todos.details,
    });

    if (newtodos) {
      res.status(200).json({
        message: "Added new task",
        data: newtodos,
      });
      logger.info("Created new task");
    } else {
      errorMsg = "Unable to create new task";
      res.status(400).send(errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    res.status(400).send(error);
    logger.error(error);
  }
};

const viewList = async (req, res) => {
  try {
    const { page = 1, limit = 10, details } = req.query;
    if (!details) {
      const lists = await TodoList.find({})
        .select("list_id details -_id")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      if (lists) {
        const count = await TodoList.countDocuments();
        res.status(200).json({
          message: "View all tasks",
          data: lists,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        });
        logger.info("View all tasks");
      } else {
        res.status(200).send("No tasks to retrieved");
        logger.info("No tasks to retrieved");
      }
    } else {
      const lists = await TodoList.find({ details: `/${query}/` });
      if (lists) {
        res.status(200).json({
          message: "View tasks",
          data: lists,
        });
        logger.info(`Search tasks param: ${query}`);
      } else {
        res.status(205).send("No tasks with seached term");
        res.info(`No task retrieve with term ${query}`);
      }
    }
  } catch (error) {
    res.status(400).send(error);
    logger.error(error);
  }
};

const updateList = async (req, res) => {
  try {
    const data = req.body.data;
    const lists = await TodoList.findOne({ list_id: data.list_id });

    if (lists) {
      lists.details = data.details;

      await lists.save();
      res.status(204).send();
      logger.info(`Updated task id ${data.list_id}`);
    } else {
      errorMsg = `Error updating task ${data.list_id}`;
      res.status(403).send(errorMsg);
      logger.error(errorMsg);
    }
  } catch (error) {
    res.status(400).send(error);
    logger.error(error);
  }
};

const deleteList = async (req, res) => {
  try {
    const data = req.body.data;
    const list = await TodoList.findOne({ list_id: data.list_id });

    if (list) {
      const deleteList = await TodoList.deleteOne({ list_id: data.list_id });
      if (deleteList) {
        res.status(204).send("Task deleted");
        logger.info(`Task deleted list_id ${data.list_id}`);
      } else {
        errorMsg = "Cannot delete task";
        res.status(403).send(errorMsg);
        logger.error(`${errorMsg} list_id ${data.list_id}`);
      }
    } else {
      errorMsg = "Cannot find list id";
      res.status(403).send(errorMsg);
      logger.error(`${errorMsg} list_id ${data.list_id}`);
    }
  } catch (error) {
    res.status(400).send(error);
    logger.error(error);
  }
};

export { createList, viewList, updateList, deleteList };
