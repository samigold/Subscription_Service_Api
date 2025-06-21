import { Router } from 'express';

const subscriptionRouter = Router();


subscriptionRouter.get('/', (req, res) => {
    res.json({title: 'Get all subscriptions'})
})

subscriptionRouter.get('/:id', (req, res) => {
    res.json({title: 'Get subscription by id'})
})

subscriptionRouter.post('/', (req, res) => {
    res.json({title: 'Create subscription'})
})

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