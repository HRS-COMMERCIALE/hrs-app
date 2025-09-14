import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineCodesPostauxModel(
  sequelize: Sequelize,
  ModelClass: typeof Model,
  DataTypesLib: typeof DataTypes
) {
  class CodesPostaux extends ModelClass {}

  CodesPostaux.init(
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
      supplierId: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
      },
      governorate: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      city: {
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
      modelName: 'CodesPostaux',
      tableName: 'codes_postaux',
      timestamps: true,
    }
  );

  return CodesPostaux;
}
