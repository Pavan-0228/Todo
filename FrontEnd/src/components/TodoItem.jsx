import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTodo, deleteTodo } from "../store/todoSlice";

function TodoItem({ todo }) {
    const dispatch = useDispatch();
    const [todoMsg, setTodoMsg] = useState(todo.title); // Changed from `todo.todo` to `todo.title`
    const [isTodoEditable, setIsTodoEditable] = useState(false);

    const handleUpdateTodo = () => {
        dispatch(updateTodo({
            todoId: todo._id, // Ensure this matches the key used in your API
            updates: { title: todoMsg, description: todo.description, isCompleted: todo.isCompleted }
        }));
        setIsTodoEditable(false);
    };

    const handleToggleCompleted = () => {
        dispatch(updateTodo({
            todoId: todo._id,
            updates: { isCompleted: !todo.isCompleted }
        }));
    };

    const handleDeleteTodo = () => {
        dispatch(deleteTodo(todo._id)); // Ensure this matches the key used in your API
    };

    return (
        <div
            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black ${
                todo.isCompleted ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"
            }`}
        >
            <input
                type="checkbox"
                className="cursor-pointer"
                checked={todo.isCompleted}
                onChange={handleToggleCompleted}
            />
            <input
                type="text"
                className={`border outline-none w-full bg-transparent rounded-lg ${
                    isTodoEditable ? "border-black/10 px-2" : "border-transparent"
                } ${todo.isCompleted ? "line-through" : ""}`}
                value={todoMsg}
                onChange={(e) => setTodoMsg(e.target.value)}
                readOnly={!isTodoEditable}
            />
            {/* Edit/Save Button */}
            <button
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                onClick={() => {
                    if (todo.isCompleted) return;

                    if (isTodoEditable) {
                        handleUpdateTodo();
                    } else {
                        setIsTodoEditable(true);
                    }
                }}
                disabled={todo.isCompleted}
            >
                {isTodoEditable ? "📁" : "✏️"}
            </button>
            {/* Delete Todo Button */}
            <button
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
                onClick={handleDeleteTodo}
            >
                ❌
            </button>
        </div>
    );
}

export default TodoItem;
