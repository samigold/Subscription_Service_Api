import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import TermiiOTPSDK from 'termii-otp-sdk';

// Initialize Termii SDK
const termii = new TermiiOTPSDK({
    apiKey: process.env.TERMII_API_KEY,
    senderId: process.env.TERMII_SENDER_ID
});

// test-termii.js
// const TermiiOTPSDK = require('termii-otp-sdk'); // or your chosen method

// const termii = new TermiiOTPSDK({
//     apiKey: 'your-actual-api-key',
//     senderId: 'your-actual-sender-id'
// });

// async function testSDK() {
//     try {
//         // Test sending OTP
//         console.log('Testing OTP send...');
//         const result = await termii.sendOTP('+2348123456789', {
//             pinLength: 6,
//             messageText: 'Your test code is <123456>'
//         });
//         console.log('✅ OTP sent successfully:', result);

//         // Test balance check
//         console.log('\nTesting balance check...');
//         const balance = await termii.getBalance();
//         console.log('✅ Balance retrieved:', balance);

//     } catch (error) {
//         console.error('❌ Error:', error.message);
//     }
// }

// testSDK();

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

    try{
        console.log('Sending OTP...');
        const otpResponse = await termii.sendOTP('+2347050998109', {
            pinLength: 6,
            messageText: 'Your verification code is <123456>'
        });

        console.log('OTP sent successfully:', otpResponse);
    } catch (error) {
        console.error('Error:', error.message)
    }

    generateToken(res, user.id)

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
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const userExists = await User.findOne({ where: { email } });

    if(userExists){
        return res.status(400).json({message: 'User is already registered'})
    }


    const user = await User.create({
        name,
        email,
        username,
        password
    })

    if(user){
   const token = await generateToken(res, user.id)

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
} catch (error) {
    console.error('User registeration failed', error);

    return res.status(500).json({
        success: false,
        message: "User registration failed",
        ...(process.env.NODE_ENV === 'development' ? { error: error.message } : {})

    })
}

}