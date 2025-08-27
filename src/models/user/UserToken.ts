import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineUserTokenModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class UserToken extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  UserToken.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      refresh_token: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
      isRevoked: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
      },
      ipAddress: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserToken',
      tableName: 'user_tokens',
      timestamps: false,
    }
  );

  return UserToken;
}