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
const connectDb = async () => {
  if (!sequelize) {
    throw new Error('Sequelize instance is not defined');
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Postgres connected');

    const syncOptions = {
      alter: true,
      force: true
    }
    try{
      await sequelize.sync(syncOptions);
      console.log('✅ Database tables created/updated');
    } catch(err){
      if (error.name === 'SequelizeUnknownContraintError') {
        console.log('Constraint error detected:', error.constraint)
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('❌ Postgres connection error:', error);
    throw new Error('Database connection failed');
  }
}

export default sequelize; // Default export
export { sequelize, connectDb }; // Named exports for flexibility

