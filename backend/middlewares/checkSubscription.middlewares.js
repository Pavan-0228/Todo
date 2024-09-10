import { User } from "../models/user.model.js";

export const checkSubscription = async (req, res, next) => {
    
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.isSubscribed == false && !user.subscriptionExpiry) {
        return res.status(403).json({ message: "Access denied. You must subscribe to access this feature." });
    }

    if (!user.isSubscriptionValid()) {
        return res.status(403).json({ message: "Your subscription has expired. Please renew to continue." });
    }

    next();
};
