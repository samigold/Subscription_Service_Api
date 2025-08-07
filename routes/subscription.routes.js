import { Router } from 'express';
import { createSubscription } from '../controllers/subscription.controller.js';
import authorize from '../middleware/verify.js';

const subscriptionRouter = Router();

subscriptionRouter.use(authorize);

subscriptionRouter.get('/', (req, res) => {
    res.json({title: 'Get all subscriptions'})
})

subscriptionRouter.get('/:id', (req, res) => {
    res.json({title: 'Get subscription by id'})
})

subscriptionRouter.post('/', createSubscription);

subscriptionRouter.put('/', (req, res) => {
    res.json({title: 'Update subscription'})
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.json({title: 'Delete subscription'})
})

subscriptionRouter.get('/user/:id', (req, res) => {
    res.json({title: 'Get all user subscriptions'})
})

subscriptionRouter.get('/:id/cancel', (req, res) => {
    res.json({title: 'cancel subscriptions'})
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.json({title: 'Get all upcoming renewals'})
})

export default subscriptionRouter;