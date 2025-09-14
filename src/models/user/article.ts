import { Sequelize, Model, DataTypes } from 'sequelize';

export function defineArticleModel(sequelize: Sequelize, ModelClass: typeof Model, DataTypesLib: typeof DataTypes) {
  class Article extends ModelClass {}

  Article.init(
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
      article: {
        type: DataTypesLib.STRING,
        allowNull: false,
      },
      familyId: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
      },
      codeBarre: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      marque: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      supplierId: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
      },
      fournisseur: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      typeArticle: {
        type: DataTypesLib.ENUM('product', 'service'),
        allowNull: true,
      },
      majStock: {
        type: DataTypesLib.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      maintenance: {
        type: DataTypesLib.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      garantie: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
      },
      garantieUnite: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },
      natureArticle: {
        type: DataTypesLib.ENUM('local', 'importe'),
        allowNull: true,
      },
      descriptifTechnique: {
        type: DataTypesLib.TEXT,
        allowNull: true,
      },
      ArticleStatus: {
        type: DataTypesLib.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      Sale: {
        type: DataTypesLib.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      Invoice: {
        type: DataTypesLib.BOOLEAN,
        allowNull: true,
      },
      Serializable: {
        type: DataTypesLib.BOOLEAN,
        allowNull: true,
      },
      qteDepart: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      qteEnStock: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      qteMin: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      qteMax: {
        type: DataTypesLib.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      prixMP: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      imageUrl: {
        type: DataTypesLib.STRING,
        allowNull: true,
      },


      prixAchatHT: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      fraisAchat: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      prixAchatBrut: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },

      pourcentageFODEC: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
      },
      FODEC: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },

      pourcentageTVA: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
      },
      TVASurAchat: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      prixAchatTTC: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      prixVenteBrut: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      pourcentageMargeBeneficiaire: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
      },
      margeBeneficiaire: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      prixVenteHT: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      pourcentageMaxRemise: {
        type: DataTypesLib.DECIMAL(5, 2),
        allowNull: true,
      },
      remise: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      TVASurVente: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      prixVenteTTC: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      margeNet: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      },
      TVAAPayer: {
        type: DataTypesLib.DECIMAL(10, 2),
        allowNull: true,
      }, 

    //   affichageSiteWeb: {
    //     type: DataTypesLib.BOOLEAN,
    //     allowNull: true,
    //     defaultValue: false,
    //   },
    },
    {
      sequelize,
      modelName: 'Article',
      tableName: 'articles',
      timestamps: false,
    }
  );

  return Article;
}
