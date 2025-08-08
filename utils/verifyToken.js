import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const verifyToken = async(token) => {
    try{
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        //console.log("Verified Token", verifiedToken);

        const userId = verifiedToken.userId; // Token contains userId, not email
        
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            raw: true // This returns plain object instead of Sequelize instance
        });

        //write console.log("User from token:", user);

        if(!user){
            return null; // Return null instead of trying to send response
        }

        return user; // Now returns plain object: { id: 'user_...', name: '...', email: '...' }
    } catch(error){
        console.log("Token verification error:", error.message);
        return null; 
    }
}

export default verifyToken;