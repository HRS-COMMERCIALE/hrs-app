import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineUserLicenseModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class UserLicense extends ModelClass {
    public id!: number;
    public licenseType!: string;
    public startDate!: Date;
    public endDate!: Date;
    public isActive!: boolean;
    public price!: number;
    public currency!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
  }

  UserLicense.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      licenseType: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
      },
      price: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserLicense',
      tableName: 'user_licenses',
      timestamps: false,
    }
  );

  return UserLicense;
}