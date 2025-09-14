import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineSupplierModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Supplier extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  Supplier.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      businessId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        references: {
          model: 'businesses',
          key: 'id',
        },
      },
      codesPostauxId: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
        references: {
          model: 'codes_postaux',
          key: 'id',
        },
      },
      name: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      taxId: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      registrationNumber: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      phone1: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      phone2: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      phone3: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      timestamps: false,
    }
  );

  return Supplier;
}


