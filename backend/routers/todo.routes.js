import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkSubscription } from "../middlewares/checkSubscription.middlewares.js";
import {
    createTodo,
    deleteTodo,
    getTodos,
    updateTodo,
} from "../conntroller/todos.controller.js";

const todoRouter = Router();

todoRouter
    .route("/")
    .post(verifyJWT, checkSubscription, createTodo)
    .get(verifyJWT, checkSubscription, getTodos);
todoRouter
    .route("/:todoId")
    .delete(verifyJWT, checkSubscription, deleteTodo)
    .patch(verifyJWT, checkSubscription, updateTodo);

export { todoRouter };
