import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        isSubscribed: {
            type: Boolean,
            default: false,
        },
        subscriptionExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.isSubscriptionValid = function () {
    const currentDate = new Date();
    return currentDate < this.subscriptionExpiry;
};

userSchema.methods.renewSubscription = function () {
    this.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
    this.isSubscribed = true; 
    return this.save();
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
