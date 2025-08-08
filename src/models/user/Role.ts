import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineRoleModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Role extends ModelClass {
    public id!: number;
    public name!: string; // 'user' or 'admin'
  }

  Role.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypesLib.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      timestamps: false,
    }
  );

  return Role;
}