import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../Database/pgDb.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false, // Required, but will be set in beforeValidate hook
        validate: {
            notNull: {
                msg: 'ID is required'
            },
            notEmpty: {
                msg: 'ID cannot be empty'
            }
        }
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        vallidate: {
            notNull: {
                msg: 'Name is required'
            },
            notEmpty: {
                msg: 'Name cannot be empty'
            },
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('email', value.trim().toLowerCase());
        },
          validate: {
            notNull: {
                msg: 'Email is required'
            },
            notEmpty: {
                msg: 'Email cannot be empty'
            },
            isEmail: {
                msg: 'Must be a valid email address'
            },
        },
    },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
           validate: {
      notNull: { msg: 'Username is required' },
      notEmpty: { msg: 'Username cannot be empty' },
    },
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required'
            },
            notEmpty: {
                msg: 'Password cannot be empty'
            },
            len: {
                args: [6, 100],
                msg: 'Password must be between 6 and 100 characters long'
            }
        }
    }
}, {
    timestamps: true,});



User.beforeValidate(async(user, options) => {
    // Generate a unique string ID if not already set
    if (!user.id) {
        user.id = 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
});

User.beforeCreate(async(user, options) => {
    if(user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.beforeUpdate(async(user, options) => {
    if(user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

export default User;