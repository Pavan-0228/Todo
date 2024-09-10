import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../store/todoSlice";
import { toast } from "react-toastify";

function TodoForm() {
    const [todoData, setTodoData] = useState({
        title: "",
        description: "",
    });
    const dispatch = useDispatch(); // Get dispatch function from react-redux

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTodoData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, description } = todoData;
        if(!todoData.title || !todoData.description){
            toast.error("Title and Description are required");
        }
        if (!title || !description) return;

        try {
            await dispatch(createTodo({ title, description })).unwrap(); // Dispatch the action
            setTodoData({ title: "", description: "" }); // Reset form
        } catch (error) {
            console.error("Failed to create todo:", error); // Handle error
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-4 rounded-lg shadow-md max-w-md mx-auto"
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Add New Todo
            </h2>
            <div className="mb-3">
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter todo title..."
                    value={todoData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 duration-150"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Enter todo description..."
                    value={todoData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 duration-150"
                    rows="3"
                />
            </div>
            <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-150"
            >
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
