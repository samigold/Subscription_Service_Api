import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const createSubscription = async (req, res) => {
    try {
        const { name, price, currency, frequency, category, paymentMethod, startDate } = req.body;
        //console.log("Authenticated user email:", req.user);

        if (!name || !price || !currency || !frequency || !category || !paymentMethod) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required (name, price, currency, frequency, category, paymentMethod)' 
            });
        }

        // req.user now contains the full user object
        const userId = req.user.id;

        console.log("User ID for subscription:", userId);

        // Use current date as start date if not provided
        const subscriptionStartDate = startDate ? new Date(startDate) : new Date();

        const subscription = await Subscription.create({
            name,
            price,
            currency,
            frequency,
            category,
            paymentMethod,
            startDate: subscriptionStartDate,
            userId: userId
        });

        //console.log('Subscription created:', subscription);

        return res.status(201).json({ 
            success: true,
            message: 'Subscription created successfully', 
            subscription 
        });
    } catch (error) {
        //console.error('Error creating subscription:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' ? { error: error.message } : {})
        });
    }
}; 

export const getUserSubscriptions = async(req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated user

        const subscriptions = await Subscription.findAll({ where: { userId } });

        if(subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subscriptions found for this user'
            });
        }

           return res.status(200).json({
            success: true,
            subscriptions
        });
        
    } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' ? { error: error.message } : {})
        });
    }
}

export const getSubscriptionById = async (req, res) => {
    const subscriptionId = req.params.id;
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        if(subscription.userId !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to access this subscription' 
            });
        }
        
        res.status(200).json({
            success: true,
            subscription
        });
    } catch (error) {
        console.error('Error fetching subscription by ID:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};