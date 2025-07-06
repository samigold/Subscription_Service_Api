// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
});

// Try to connect immediately
const connectDb = sequelize.authenticate()
  .then(() => console.log('✅ Postgres connected'))
  .catch(err => console.error('❌ Postgres connection error:', err));

export default {connectDb, sequelize};
