import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineAddressModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Address extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  Address.init(
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
      country: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      governorate: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      fax: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      timestamps: false,
    }
  );

  return Address;
}
