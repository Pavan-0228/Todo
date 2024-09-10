import React from "react";
import { toast } from "react-toastify";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";

function PriceCard({ onClose }) {
    const subscribeUser = async () => {
        try {

            console.log(localStorage.getItem(
                "accessToken"
            ))

            const response = await axios.post(
                "https://todo-5m23.onrender.com/api/v1/auth/subscribe",{},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`,
                    },
                }
            );

            toast.success(response.data.message);
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } catch (error) {

            toast.error(error.response?.data.message || "Subscription failed!");
        }
    };

    const handlePayment = async (token) => {
        const body = {
            token,
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        return axios
            .post("https://todo-5m23.onrender.com/api/v1/payment", body, {
                headers,
            })
            .then((response) => {
                toast.success("payment is successful");
                console.log("response", response);
                subscribeUser();
            })
            .catch((error) => {
                toast.success("payment is successful");
                subscribeUser();
                console.log("error", error);
            });
    };

    return (
        <>
            <div className="relative flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                {/* X Button to close */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 font-bold text-2xl text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Close"
                >
                    X
                </button>

                <h3 className="mb-4 text-2xl font-semibold">Todo List</h3>
                <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                    Ads free, advanced tools, and 24/7 support for your todos.
                </p>
                <div className="flex justify-center items-baseline my-8">
                    <span className="mr-2 text-5xl font-extrabold">500₹</span>
                    <span className="text-gray-500 dark:text-gray-400">
                        /month
                    </span>
                </div>
                <ul role="list" className="mb-8 space-y-4 text-left">
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>Ads Free</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>Add Unlimited Todos</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>Update Todos</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>24/7 Support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>Advanced Tools</span>
                    </li>
                </ul>
                <StripeCheckout
                    stripeKey={import.meta.env.VITE_KEY}
                    token={handlePayment}
                    amount={7 * 100}
                >
                    <button className="w-full px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700">
                        Buy Now
                    </button>
                </StripeCheckout>
            </div>
        </>
    );
}

export default PriceCard;
