import { Sequelize, Model, DataTypes } from "sequelize";
import { defineBusinessModel } from "../user/business";
import { defineAddressModel } from "../user/address";
import { defineCodesPostauxModel } from "../user/codesPostaux";
import { definePointOfSaleModel } from "../user/PointOfSale";
import { defineSupplierModel } from "../user/suppliers";
import { defineClientsModel } from "../user/Clients";
import { defineArticleModel } from "../user/article";
import { defineFamilyModel } from "../user/family";
import { defineOrderModel } from "../user/order";
import { defineBuinessUsersModel } from "../user/BuinessUsers";
import { defineBuinessInvitationModel } from "../user/buinessInvitation";

export function setupBusinessAssociations(
  sequelize: Sequelize,
  ModelClass: typeof Model,
  DataTypesLib: typeof DataTypes,
  externalModels?: any
) {
  const Business = defineBusinessModel(sequelize, ModelClass, DataTypesLib);
  const Address = defineAddressModel(sequelize, ModelClass, DataTypesLib);
  const CodesPostaux = defineCodesPostauxModel(sequelize, ModelClass, DataTypesLib);
  const PointOfSale = definePointOfSaleModel(sequelize, ModelClass, DataTypesLib);
  const Supplier = defineSupplierModel(sequelize, ModelClass, DataTypesLib);
  const Clients = defineClientsModel(sequelize, ModelClass, DataTypesLib);
  const Article = defineArticleModel(sequelize, ModelClass, DataTypesLib);
  const Family = defineFamilyModel(sequelize, ModelClass, DataTypesLib);
  const Order = defineOrderModel(sequelize, ModelClass, DataTypesLib);
  const BuinessUsers = externalModels?.BuinessUsers || defineBuinessUsersModel(sequelize, ModelClass, DataTypesLib);
  const BuinessInvitation = externalModels?.BuinessInvitation || defineBuinessInvitationModel(sequelize, ModelClass, DataTypesLib);

  // Business has many addresses
  Business.hasMany(Address, { foreignKey: "businessId", as: "addresses" });
  Address.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Business has many postal codes (codes postaux)
  Business.hasMany(CodesPostaux, { foreignKey: "businessId", as: "postalCodes" });
  CodesPostaux.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Business has many suppliers
  Business.hasMany(Supplier, { foreignKey: "businessId", as: "suppliers" });
  Supplier.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Business has many clients
  Business.hasMany(Clients, { foreignKey: "businessId", as: "clients" });
  Clients.belongsTo(Business, { foreignKey: "businessId", as: "business" });


  // Codes postaux has many suppliers
  CodesPostaux.hasMany(Supplier, { foreignKey: "codesPostauxId", as: "suppliers" });
  Supplier.belongsTo(CodesPostaux, { foreignKey: "codesPostauxId", as: "codesPostaux" });

  // Codes postaux has many clients
  CodesPostaux.hasMany(Clients, { foreignKey: "codesPostauxId", as: "clients" });
  Clients.belongsTo(CodesPostaux, { foreignKey: "codesPostauxId", as: "codesPostaux" });

  // Business has many points of sale
  Business.hasMany(PointOfSale, { foreignKey: "businessId", as: "pointsOfSale" });
  PointOfSale.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Business has many articles
  Business.hasMany(Article, { foreignKey: "businessId", as: "articles" });
  Article.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Supplier has many articles
  Supplier.hasMany(Article, { foreignKey: "supplierId", as: "articles" });
  Article.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

  // Business has many families
  Business.hasMany(Family, { foreignKey: "businessId", as: "families" });
  Family.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Family has many articles
  Family.hasMany(Article, { foreignKey: "familyId", as: "articles" });
  Article.belongsTo(Family, { foreignKey: "familyId", as: "family" });

  // Business has many orders
  Business.hasMany(Order, { foreignKey: "businessId", as: "orders" });
  Order.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Business has many BuinessUsers (membership links)
  Business.hasMany(BuinessUsers, { foreignKey: "businessId", as: "members" });
  BuinessUsers.belongsTo(Business, { foreignKey: "businessId", as: "business" });

  // Article has many orders
  Article.hasMany(Order, { foreignKey: "articleId", as: "orders" });
  Order.belongsTo(Article, { foreignKey: "articleId", as: "article" });

  // BuinessUsers has many invitations
  BuinessUsers.hasMany(BuinessInvitation, { foreignKey: "businessUserId", as: "invitations" });
  BuinessInvitation.belongsTo(BuinessUsers, { foreignKey: "businessUserId", as: "businessUser" });

  return { Business, Address, CodesPostaux, PointOfSale, Supplier, Clients, Article, Family, Order, BuinessUsers, BuinessInvitation };
}
