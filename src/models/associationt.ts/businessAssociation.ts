import { Sequelize, Model, DataTypes } from "sequelize";
import { defineBusinessModel } from "../user/business";
import { defineAddressModel } from "../user/address";

export function setupBusinessAssociations(
  sequelize: Sequelize,
  ModelClass: typeof Model,
  DataTypesLib: typeof DataTypes
) {
  const Business = defineBusinessModel(sequelize, ModelClass, DataTypesLib);
  const Address = defineAddressModel(sequelize, ModelClass, DataTypesLib);

  // Business has many addresses
  Business.hasMany(Address, { foreignKey: "businessId", as: "addresses" });
  Address.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  return { Business, Address };
}
