import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineBusinessModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Business extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  Business.init(
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
      currency: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      industry: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      businessName: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      taxId: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      cnssCode: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      logoFile: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Business',
      tableName: 'businesses',
      timestamps: false,
    }
  );

  return Business;
}
