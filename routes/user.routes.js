import { Router } from 'express';
import authorize from '../middleware/verify.js';
import { getUserProfile, getUserById } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/profile',authorize, getUserProfile);

userRouter.get('/:id', getUserById);

userRouter.post('/', authorize, (req, res) => {
    res.json({ message: 'Create a new User' });
}); 

userRouter.put('/:id', (req, res) => {
    res.json({ message: `Update User details for ID` });
});

userRouter.delete('/:id', (req, res) => {
    res.json({ message: `Delete User with ID` });
});


export default userRouter;