import User from "../models/user.model.js";

export const getUserProfile = async (req, res, next) => {
    try {
        // req.user now contains the full user object
        const user = req.user;

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username
                    }
            });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
    };
