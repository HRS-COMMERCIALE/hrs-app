import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineFamilyModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Family extends ModelClass {}

  Family.init(
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
      name: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Family',
      tableName: 'families',
      timestamps: false,
    }
  );

  return Family;
}
