import { Sequelize, Model, DataTypes } from "sequelize";
import { defineUserModel } from "../user/User";
import { defineBusinessModel } from "../user/business";
import { defineUserLicenseModel } from "../user/UserLicense";
import { defineLoginAttemptModel } from "../user/LoginAttempt";
import { defineUserTokenModel } from "../user/UserToken";
import { definePaymentTransactionModel } from "../user/PaymentTransaction";
import { defineBuinessUsersModel } from "../user/BuinessUsers";

export function setupUserAssociations(
  sequelize: Sequelize,
  ModelClass: typeof Model,
  DataTypesLib: typeof DataTypes
) {
  const User = defineUserModel(sequelize, ModelClass, DataTypesLib);
  const Business = defineBusinessModel(sequelize, ModelClass, DataTypesLib);
  const UserLicense = defineUserLicenseModel(
    sequelize,
    ModelClass,
    DataTypesLib
  );
  const LoginAttempt = defineLoginAttemptModel(
    sequelize,
    ModelClass,
    DataTypesLib
  );
  const UserToken = defineUserTokenModel(sequelize, ModelClass, DataTypesLib);
  const PaymentTransaction = definePaymentTransactionModel(sequelize, ModelClass, DataTypesLib);
  const BuinessUsers = defineBuinessUsersModel(sequelize, ModelClass, DataTypesLib);

  // Associations
 

  // User has many businesses
  User.hasMany(Business, { foreignKey: "userId", as: "businesses" });
  Business.belongsTo(User, { foreignKey: "userId", as: "user" });

  // User has many BuinessUsers (membership links)
  User.hasMany(BuinessUsers, { foreignKey: "userId", as: "businessLinks" });
  BuinessUsers.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(UserLicense, { foreignKey: "userId", as: "licenses" });
  UserLicense.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(LoginAttempt, { foreignKey: "userId", as: "loginAttempts" });
  LoginAttempt.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(UserToken, { foreignKey: "userId", as: "tokens" });
  UserToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(PaymentTransaction, { foreignKey: "userId", as: "paymentTransactions" });
  PaymentTransaction.belongsTo(User, { foreignKey: "userId", as: "user" });

  return { User, Business, UserLicense, LoginAttempt, UserToken, PaymentTransaction, BuinessUsers };
}
