import express from 'express';
import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Service');
});

app.use(notFound);
app.use(errorHandler);

export default app;