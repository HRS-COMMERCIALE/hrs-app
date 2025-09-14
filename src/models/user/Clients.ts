import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineClientsModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Clients extends ModelClass {}

  Clients.init(
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
      codesPostauxId: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      address:{
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      governorate: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      Billing:{
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      Price:{
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      affiliation:{
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      ExemptionNumber:{
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      registrationNumber: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      taxId: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      vat: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      email: {
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
      faxNumber: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypesLib.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypesLib.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Clients',
      tableName: 'clients',
      timestamps: false,
    }
  );

  return Clients;
}


