import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineBuinessInvitationModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class BuinessInvitation extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  BuinessInvitation.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      businessUserId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        references: {
          model: 'business_users',
          key: 'id',
        },
        comment: 'Reference to business_users table for business context'
      },
      role: {
        type: DataTypesLib.ENUM('member', 'manager'),
        allowNull: false,
        defaultValue: 'member',
        comment: 'Role to be assigned when invitation is accepted'
      },
      invitationCode: {
        type: DataTypesLib.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique invitation code for the invite link'
      },
      invitedBy: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'User who sent the invitation'
      },
      isUsed: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the invitation has been used'
      },
      usedAt: {
        type: DataTypesLib.DATE,
        allowNull: true,
        comment: 'When the invitation was used'
      },
      usedBy: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'User who used the invitation (might be different from userId if email was used)'
      },
      expiredAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
        comment: 'When the invitation expires (typically 7-30 days)'
      },
      status: {
        type: DataTypesLib.ENUM('pending', 'accepted', 'expired', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Current status of the invitation'
      },
      createdAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
        defaultValue: DataTypesLib.NOW,
        comment: 'When the invitation was created'
      },
      updatedAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
        defaultValue: DataTypesLib.NOW,
        comment: 'When the invitation was last updated'
      }
    },
    {
      sequelize,
      modelName: 'BuinessInvitation',
      tableName: 'business_invitations',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['invitationCode']
        },
        {
          fields: ['invitedBy', 'businessUserId']
        },
        {
          fields: ['expiredAt']
        },
        {
          fields: ['status']
        },
        {
          fields: ['invitedBy']
        }
      ]
    }
  );

  return BuinessInvitation;
}
