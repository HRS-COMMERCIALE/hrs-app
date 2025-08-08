import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineLoginAttemptModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class LoginAttempt extends ModelClass {
    public id!: number;
    public ipAddress!: string;
    public userAgent!: string;
    public successful!: boolean;
    public failureReason!: string;
    public attemptAt!: Date;
    public location!: string;
  }

  LoginAttempt.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ipAddress: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      userAgent: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      successful: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
      },
      failureReason: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      attemptAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'LoginAttempt',
      tableName: 'login_attempts',
      timestamps: false,
    }
  );

  return LoginAttempt;
}