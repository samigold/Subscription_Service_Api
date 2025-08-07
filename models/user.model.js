import { DataTypes } from 'sequelize';
import sequelize from '../Database/pgDb.js';

const User = sequelize.define('User', {
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


export default User;