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

        // Find the user by email (req.user contains the email from the token)
        const user = await User.findOne({ where: { email: req.user } });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

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
            userId: user.id
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