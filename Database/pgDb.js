import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import 'pg';
import 'pg-hstore';
// Load environment variables from .env file
dotenv.config();


// Flag to check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Prefer DATABASE_URL (for Vercel/production), fallback to individual vars (for local dev)
let sequelize;

/**
 * Returns the Sequelize configuration object with optimized settings for production and development
 * Includes connection pooling, retry logic, and SSL configuration for production
 */
const getSequelizeConfig = () => {
  const config = {
    dialect: 'postgres',
    // Only log SQL queries in development for better performance in production
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Connection pool configuration
    pool: {
      max: 5, // Maximum number of connections in pool
      min: 0, // Minimum number of connections in pool
      acquire: 60000, // Max time (ms) to wait for a connection
      idle: 10000, // Max time (ms) a connection can be idle
      evict: 1000, // Time interval (ms) to check for idle connections
    },
    
    // Retry configuration for failed queries
    retry: {
      max: 3, // Maximum number of retry attempts
      timeout: 30000, // Timeout (ms) for retry attempts
    },
    
    // Database-specific options
    dialectOptions: {
      // SSL configuration for production (required for most cloud databases)
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false // Required for self-signed certificates
      } : false,
      
      // Timeout settings to prevent long-running queries
      statement_timeout: 10000, // 10 seconds max query execution time
      idle_in_transaction_session_timeout: 10000, // 10 seconds max idle transaction time
    },
  };

  return config;
};

// Initialize Sequelize with retry logic
const initializeSequelize = async () => {
  if (!process.env.DB_URI) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const config = getSequelizeConfig();
  const sequelize = new Sequelize(process.env.DB_URI, config);

  // Add error handling for connection issues
  sequelize.addHook('afterDisconnect', async (instance) => {
    console.warn('Database connection lost. Attempting to reconnect...');
    try {
      await sequelize.authenticate();
      console.log('Successfully reconnected to the database');
    } catch (error) {
      console.error('Failed to reconnect to database:', error.message);
    }
  });

  return sequelize;
};

// Initialize the database connection
if (process.env.DB_URI) {
  sequelize = new Sequelize(process.env.DB_URI, getSequelizeConfig());
}

// Test the connection and sync models
const connectDB = async () => {
  if (!sequelize) {
    throw new Error('Database connection not initialized. DATABASE_URL might be missing.');
  }

  try {
    await sequelize.authenticate({ logging: true });
    console.log('✅ PostgreSQL connected successfully');

    // In development, use alter: true to update tables without dropping data
    const syncOptions = {
      alter: false, // Temporarily disable alter mode
      force: process.env.FORCE_DB_RESET === 'true', // Only force if explicitly set
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    };

    try {
      await sequelize.sync(syncOptions);
      console.log('✅ Models synchronized successfully');
    } catch (error) {
      if (error.name === 'SequelizeUnknownConstraintError') {
        console.log('Constraint error detected:', error.constraint);
      } else {
        throw error; // Re-throw other types of errors
      }
    }
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error('Error details:', error);
    
    // If connection fails, try to reconnect after a delay
    if (error.name === 'SequelizeConnectionError') {
      console.log('Attempting to reconnect in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(); // Retry the connection
    }
    
    throw error;
  }
};

export  {
  sequelize, connectDB, initializeSequelize
};