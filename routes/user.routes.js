import { Router } from 'express';

const userRouter = Router();

userRouter.get('/profile', (req, res) => {
    res.json({ message: 'User profile endpoint' });
});

userRouter.get('/:id', (req, res) => {
    res.json({ message: `Get User details for ID` });
});

userRouter.post('/', (req, res) => {
    res.json({ message: 'Create a new User' });
}); 

userRouter.put('/:id', (req, res) => {
    res.json({ message: `Update User details for ID` });
});

userRouter.delete('/:id', (req, res) => {
    res.json({ message: `Delete User with ID` });
});


export default userRouter;