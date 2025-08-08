import jwt from 'jsonwebtoken';

const generateToken = async(res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
   // console.log("Token", token);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, //this is 1 day in milliseconds
    })

    return token;
}

export default generateToken;