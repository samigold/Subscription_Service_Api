import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-in', login);

authRouter.post('/sign-up', signup);

authRouter.post('/sign-out', (req, res) => {
    res.json({ message: 'Logout endpoint' });
});


export default authRouter;