import { Router } from 'express';

const authRouter = Router();

authRouter.post('/sign-in', (req, res) => {
    res.json({ message: 'Login endpoint' });
});

authRouter.post('/sign-up', (req, res) => {
    res.json({ message: 'Registration endpoint' });
});

authRouter.post('/sign-out', (req, res) => {
    res.json({ message: 'Logout endpoint' });
});


export default authRouter;