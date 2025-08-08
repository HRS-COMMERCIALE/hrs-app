import { Sequelize, Model, DataTypes } from "sequelize";
import { defineUserModel } from "../user/User";
import { defineRoleModel } from "../user/Role";
import { defineUserLicenseModel } from "../user/UserLicense";
import { defineLoginAttemptModel } from "../user/LoginAttempt";
import { defineUserTokenModel } from "../user/UserToken";

export function setupUserAssociations(
  sequelize: Sequelize,
  ModelClass: typeof Model,
  DataTypesLib: typeof DataTypes
) {
  const Role = defineRoleModel(sequelize, ModelClass, DataTypesLib);
  const User = defineUserModel(sequelize, ModelClass, DataTypesLib);
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

  // Associations
  User.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role",
  });

  // Role has one User
  Role.hasOne(User, {
    foreignKey: "roleId",
    as: "user",
  });

  User.hasMany(UserLicense, { foreignKey: "userId", as: "licenses" });
  UserLicense.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(LoginAttempt, { foreignKey: "userId", as: "loginAttempts" });
  LoginAttempt.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(UserToken, { foreignKey: "userId", as: "tokens" });
  UserToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  return { User, Role, UserLicense, LoginAttempt, UserToken };
}
