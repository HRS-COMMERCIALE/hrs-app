import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineUserModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class User extends ModelClass {
    public id!: number;
    public Matricule!: string;
    public NomPrenom!: string;
    public password!: string;
  }

  User.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Matricule: {
        type: DataTypesLib.STRING,
        allowNull: false,
        unique: true,
      },
      NomPrenom: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    }
  );

  return User;
}