import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const verifyToken = async(token) => {
    try{
        const verifiedToken = jwt.verify(token, process.env,JWT_SECRET);
        const user = await User.findOne({where: { email }, attributes: { exclude: ['password'] } },)

        return user;
    } catch(error){
        return null; 
    }
}