import mongoose from "mongoose";

const todoItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, 
});

const todosSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    todo: [todoItemSchema],
}, {
    timestamps: true, 
});

export const Todos = mongoose.model("Todos", todosSchema);
