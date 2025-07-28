import { Router } from 'express';
import { signup } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-in', (req, res) => {
    const {username, password } = req.body;

    if(!username ||!password){
        res.sendStatus(401)
        return;
    }

    res.status(200).json({ message: 'Login Successful', user: {username: username, password: password} });

    // res.status(200).json({ message: 'Login endpoint', user: username });
});

authRouter.post('/sign-up', signup);

authRouter.post('/sign-out', (req, res) => {
    res.json({ message: 'Logout endpoint' });
});


export default authRouter;