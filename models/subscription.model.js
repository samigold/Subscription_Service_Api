import { DataTypes } from 'sequelize';
import sequelize      from '../Database/pgDb.js';

const Subscription = sequelize.define('Subscription', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull:  { msg: 'Subscription name is required' },
      notEmpty: { msg: 'Subscription name cannot be empty' }
    }
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Price is required' },
      isFloat: { msg: 'Price must be a number' },
      min:     { args: [0.01], msg: 'Price must be at least 0.01' },
      max:     { args: [1000],  msg: 'Price cannot exceed 1000' }
    }
  },

  currency: {
    type: DataTypes.ENUM('USD', 'EUR', 'NGN'),
    allowNull: false,
    defaultValue: 'USD',
    validate: {
      notNull:  { msg: 'Currency is required' },
      isIn:     { args: [['USD','EUR','NGN']], msg: 'Invalid currency' }
    }
  },

  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    allowNull: false,
    defaultValue: 'monthly',
    validate: {
      notNull:  { msg: 'Frequency is required' },
      isIn:     {
        args: [['daily','weekly','monthly','yearly']],
        msg: 'Frequency must be daily, weekly, monthly, or yearly'
      }
    }
  },

  category: {
    type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Category is required' },
      isIn:    {
        args: [['basic','premium','enterprise']],
        msg: 'Category must be basic, premium, or enterprise'
      }
    }
  },

  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('paymentMethod', value.trim());
    },
    validate: {
      notNull:  { msg: 'Payment method is required' },
      notEmpty: { msg: 'Payment method cannot be empty' }
    }
  },

  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      notNull: { msg: 'Status is required' },
      isIn:    {
        args: [['active','expired','cancelled']],
        msg: 'Status must be active, expired, or cancelled'
      }
    }
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'Start date is required' },
      isDate:  { msg: 'Start date must be a valid date' },
      isInPast(value) {
        if (new Date(value) > new Date()) {
          throw new Error('Start date must be in the past');
        }
      }
    }
  },

   renewalDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'Renewal date is required' },
      isDate:  { msg: 'Renewal date must be a valid date' },
      isAfterStart(value) {
        if (new Date(value) <= new Date(this.startDate)) {
          throw new Error('Renewal date must be after start date');
        }
      }
    }
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    },
    onDelete: 'CASCADE'
  }

}, {
  timestamps: true,
});

// 2️⃣ Tell Sequelize “Subscription belongsTo User”
Subscription.belongsTo(User, {
  foreignKey: 'userId',
  as:       'user'
});

//auto calculate renewal date if missing 
Subscription.beforeCreate((subscription, options) => {
  if (!subscription.renewalDate) {
    const startDate = new Date(subscription.startDate);
    switch (subscription.frequency) {
      case 'daily':
        subscription.renewalDate = new Date(startDate.setDate(startDate.getDate() + 1));
        break;
      case 'weekly':
        subscription.renewalDate = new Date(startDate.setDate(startDate.getDate() + 7));
        break;
      case 'monthly':
        subscription.renewalDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        break;
      case 'yearly':
        subscription.renewalDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        break;
    }
  }
});

export default Subscription;
