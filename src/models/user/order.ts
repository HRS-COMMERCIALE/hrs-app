import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineOrderModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Order extends ModelClass {}

  Order.init(
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
      articleId: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
      },
      qte: {
        type: DataTypesLib.INTEGER,
        allowNull: false,
        comment: 'Quantity'
      },
      pourcentageRemise: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Discount Percentage'
      },
      remise: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Discount Amount'
      },
      prixVHT: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price Excluding Tax'
      },
      pourcentageFodec: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Fodec Percentage'
      },
      fodec: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Fodec Tax Amount'
      },
      pourcentageTVA: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
        comment: 'VAT Percentage'
      },
      tva: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Value Added Tax Amount'
      },
      ttc: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total Including Tax'
      },
      type: {
        type: DataTypesLib.ENUM('order', 'delivery', 'invoice', 'returns'),
        allowNull: false,
        defaultValue: 'order',
        comment: 'Order Type: order, delivery, invoice, returns'
      },
      transactionType: {
        type: DataTypesLib.ENUM('SALE', 'PURCHASE'),
        allowNull: false,
        defaultValue: 'SALE',
        comment: 'Specifies whether this record is a Sale or a Purchase'
      }
      
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: false,
    }
  );

  return Order;
}
