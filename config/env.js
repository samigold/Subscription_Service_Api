import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRY, TERMII_API_KEY, TERMII_SENDER_ID, ARCJET_KEY, ARCJET_ENV } = process.env;