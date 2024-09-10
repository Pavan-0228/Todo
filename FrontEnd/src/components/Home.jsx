import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { fetchTodos } from "../store/todoSlice";
import PriceCard from "./PriceCard";

function Home() {
    const dispatch = useDispatch();
    const { todos, loading, error } = useSelector((state) => state.todos);

    const [showPriceCard, setShowPriceCard] = useState(false);

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch, todos]);

    // Toggle the PriceCard visibility
    const handleBuyClick = () => {
        setShowPriceCard(true); // Show PriceCard
    };

    // Handle closing the PriceCard
    const handleCloseClick = () => {
        setShowPriceCard(false); // Hide PriceCard and return to Home
    };

    if (showPriceCard) {
        return (
            <div className="bg-[#172842] min-h-screen py-8 flex justify-center items-center">
                <PriceCard onClose={handleCloseClick} />
            </div>
        );
    }

    return (
        <div className="bg-[#172842] min-h-screen py-8">
            <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-black">
                <div className="flex justify-center mb-4">
                    <button
                        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={handleBuyClick}
                    >
                        Buy
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-8 mt-2">
                    Manage Your Todos
                </h1>

                <div className="mb-4">
                    <TodoForm />
                </div>

                <div className="flex flex-wrap gap-y-3">
                    {error && (
                        <p className="text-red-400 text-center w-full">
                            {error}
                        </p>
                    )}
                    {todos.map((todo) => (
                        <div key={todo._id} className="w-full">
                            <TodoItem todo={todo} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
