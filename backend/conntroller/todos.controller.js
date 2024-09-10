import { Todos } from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTodo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const userId = req.user.id;

    if (!userId || !title) {
        return res
            .status(400)
            .json({ message: "userId and title are required." });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ message: "User not found." });
    }

    const newTodo = { title, description };

    const todo = await Todos.findOneAndUpdate(
        { user: userId },
        { $push: { todo: newTodo } },
        { new: true, upsert: true }
    );

    if (!todo) {
        return res.status(500).json({ message: "Failed to create todo." });
    }

    const sortedTodos = todo.todo.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(201).json({
        message: "Todo created successfully.",
        todo: sortedTodos,
    });
});

export const getTodos = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ message: "User not found." });
    }

    const todos = await Todos.findOne({ user: userId });

    if (!todos || todos.todo.length === 0) {
        return res
            .status(404)
            .json({ message: "No todos found for this user." });
    }

    const sortedTodos = todos.todo.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ ...todos._doc, todo: sortedTodos });
});

export const updateTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const { title, description, isCompleted } = req.body;
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ message: "User not found." });
    }

    const updateFields = {};
    if (title !== undefined) updateFields["todo.$.title"] = title;
    if (description !== undefined)
        updateFields["todo.$.description"] = description;
    if (isCompleted !== undefined)
        updateFields["todo.$.isCompleted"] = isCompleted;

    if (Object.keys(updateFields).length === 0) {
        return res
            .status(400)
            .json({ message: "No fields provided to update." });
    }

    const todo = await Todos.findOneAndUpdate(
        { user: userId, "todo._id": todoId },
        { $set: updateFields },
        { new: true }
    );

    if (!todo) {
        return res.status(404).json({ message: "Todo not found." });
    }

    const sortedTodos = todo.todo.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ message: "Todo updated successfully.", todo: sortedTodos });
});

export const deleteTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const userId = req.user.id;

    const userExists = await User.findById(userId);
    if (!userExists) {
        return res.status(404).json({ message: "User not found." });
    }

    const todo = await Todos.findOneAndUpdate(
        { user: userId },
        { $pull: { todo: { _id: todoId } } },
        { new: true }
    );

    if (!todo) {
        return res
            .status(404)
            .json({ message: "Todo not found or already deleted." });
    }

    res.status(200).json({ message: "Todo deleted successfully." });
});
