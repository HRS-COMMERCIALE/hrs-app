import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineBuinessUsersModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class BuinessUsers extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  BuinessUsers.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      businessId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        references: {
          model: 'businesses',
          key: 'id',
        },
      },
      role: {
        type: DataTypesLib.ENUM('member', 'manager', 'admin'),
        allowNull: false,
        defaultValue: 'member',
      },
      isOnline: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isBanned: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bannedReason: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      bannedAt: {
        type: DataTypesLib.DATE,
        allowNull: true,
      },
      joinedAt: {
        type: DataTypesLib.DATE,
        allowNull: true,
      },
      lastActiveAt: {
        type: DataTypesLib.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'BuinessUsers',
      tableName: 'business_users',
      timestamps: false,
    }
  );

  return BuinessUsers;
}


