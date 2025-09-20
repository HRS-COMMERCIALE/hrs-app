import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineUserModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class User extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  User.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypesLib.STRING,
        allowNull: false,
        unique: true,
      },
      mobile: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      landline: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      emailVerified:{
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      plan:{
        type: DataTypesLib.ENUM('free', 'Premium', 'Platinum',"Diamond", 'custom'),
        allowNull: false,
        defaultValue: 'free',
      },
      planValidUntil:{
        type: DataTypesLib.DATE,
        allowNull: true,
      },
      buinessCount:{
        type: DataTypesLib.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
        allowNull: true,
      },
      isBanned:{
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bannedReason:{
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      bannedAt:{
        type: DataTypesLib.DATE,
        allowNull: true,
      },
      bannedBy:{
        type: DataTypesLib.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    }
  );

  return User;
}