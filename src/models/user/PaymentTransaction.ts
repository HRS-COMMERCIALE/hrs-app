import { Sequelize, Model, DataTypes } from 'sequelize';

export function definePaymentTransactionModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class PaymentTransaction extends ModelClass {
    // Removed public class fields to avoid shadowing Sequelize's built-in getters/setters
  }

  PaymentTransaction.init(
    {
      id: {
        type: DataTypesLib.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      stripePaymentIntentId: {
        type: DataTypesLib.STRING,
        allowNull: false,
        unique: true,
        comment: 'Stripe Payment Intent ID'
      },
      stripeCustomerId: {
        type: DataTypesLib.STRING,
        allowNull: true,
        comment: 'Stripe Customer ID'
      },
      planId: {
        type: DataTypesLib.STRING,
        allowNull: false,
        comment: 'Plan ID from payment configuration'
      },
      planName: {
        type: DataTypesLib.STRING,
        allowNull: false,
        comment: 'Plan name for reference'
      },
      amount: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Amount paid in cents'
      },
      currency: {
        type: DataTypesLib.STRING,
        allowNull: false,
        comment: 'Currency code (USD, EUR, etc.)'
      },
      status: {
        type: DataTypesLib.ENUM('pending', 'succeeded', 'failed', 'canceled', 'requires_action'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment status'
      },
      paymentMethod: {
        type: DataTypesLib.STRING,
        allowNull: true,
        comment: 'Payment method used (card, etc.)'
      },
      customerEmail: {
        type: DataTypesLib.STRING,
        allowNull: false,
        comment: 'Customer email at time of payment'
      },
      billingDetails: {
        type: DataTypesLib.JSON,
        allowNull: true,
        comment: 'Billing details from Stripe'
      },
      metadata: {
        type: DataTypesLib.JSON,
        allowNull: true,
        comment: 'Additional metadata from Stripe'
      },
      webhookProcessed: {
        type: DataTypesLib.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether webhook has been processed'
      },
      webhookProcessedAt: {
        type: DataTypesLib.DATE,
        allowNull: true,
        comment: 'When webhook was processed'
      },
      failureReason: {
        type: DataTypesLib.TEXT,
        allowNull: true,
        comment: 'Reason for payment failure'
      },
      createdAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
        defaultValue: DataTypesLib.NOW,
      },
      updatedAt: {
        type: DataTypesLib.DATE,
        allowNull: false,
        defaultValue: DataTypesLib.NOW,
      },
    },
    {
      sequelize,
      modelName: 'PaymentTransaction',
      tableName: 'payment_transactions',
      timestamps: true,
      indexes: [
        {
          fields: ['stripePaymentIntentId'],
          unique: true,
        },
        {
          fields: ['userId'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['createdAt'],
        },
      ],
    }
  );

  return PaymentTransaction;
}
