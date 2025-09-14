import { Sequelize, Model, DataTypes } from 'sequelize';

export function definePointOfSaleModel(
  sequelize: Sequelize,
  ModelClass: typeof Model,
  DataTypesLib: typeof DataTypes
) {
  class PointOfSale extends ModelClass {}

  PointOfSale.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      businessId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
      },
      pointOfSale: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypesLib.DATE,
        allowNull: true, // Allow null initially for existing records
        defaultValue: DataTypesLib.NOW,
      },
      updatedAt: {
        type: DataTypesLib.DATE,
        allowNull: true, // Allow null initially for existing records
        defaultValue: DataTypesLib.NOW,
      },
    },
    {
      sequelize,
      modelName: 'PointOfSale',
      tableName: 'points_of_sale',
      timestamps: true,
    }
  );

  return PointOfSale;
}
