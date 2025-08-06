import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const verifyToken = async(token) => {
    try{
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Verified Token", verifiedToken);

        const email = verifiedToken.email;
        
        const user = await User.findOne({where: { email }, attributes: { exclude: ['password'] } },)

        if(!user){
            res.status(404).json({
                success: "false",
                message: "User not found"
            });
        }

        return email;
    } catch(error){
        return null; 
    }
}

export default verifyToken;