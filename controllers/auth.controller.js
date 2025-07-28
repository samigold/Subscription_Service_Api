import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both username and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    generateToken(res, email)

    res.status(201).json({
        message: "Login Was Successfull!",
        email: user.email,
        name: user.name
    })

}

export const signup = async (req, res) => {
    try{
    const { name, email, username, password } = req.body;

    if(!name || !email || !username || !password) {
        return res.status(400).json({ message: "Please enter all details"})
    }

    const userExists = await User.findOne({ where: { email } });

    if(userExists){
        return res.status(400).json({message: 'User is already registered'})
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        username,
        password: hashedPassword
    })

    if(user){
   const token = generateToken(res, email)

    return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username
        }
    });
}
} catch (err) {
    console.error('User registeration failed', err);
    return res.status(500).json({
        success: false,
        message: "User registration failed",
        ...(process.env.NODE_ENV === 'development' ? { error: err.message } : {})

    })
}

}