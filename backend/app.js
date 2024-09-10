import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

const stripe = Stripe(
    "sk_test_51PxRtfP9nHh7WTMC1LV2yT5QvDy4tN2LpcD013nYMg7xb5k5HMhUsXABrnVeO9zxwxKhbnbSBCMLFDstRTNf3OIB00xiviO7ya"
);

const app = express();

// Middleware setup
app.use(cors({ origin:"*", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

import { userRouter } from "./routers/user.routes.js";
import { todoRouter } from "./routers/todo.routes.js";
import { verifyJWT } from "./middlewares/auth.middlewares.js";

// API routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/todo", todoRouter);

app.post("/api/v1/payment", verifyJWT, async (req, res) => {

    const {token} = req.body;

    const idempotencyKey = uuidv4(); 

    try {
        const customer = await stripe.customers.create({
            email: req.body?.email,
            source: token.id, 
        });

        const charge = await stripe.charges.create(
            {
                amount: 7 * 100,
                currency: "usd",
                customer: customer.id,
                receipt_email: req.body?.email,
            },
            { idempotencyKey }
        );

        res.status(200).json(charge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("API is running....");
});

export { app };
