import { sequelize } from '../../libs/Db';
import { Model, DataTypes } from 'sequelize';
import { setupUserAssociations } from './userAssociation';
import { setupBusinessAssociations } from './businessAssociation';

// Initialize models and associations without auto-syncing
const { User, Business, UserLicense, LoginAttempt, UserToken } = setupUserAssociations(sequelize, Model, DataTypes);
const { Address, CodesPostaux, PointOfSale, Supplier, Clients, Article, Family, Order } = setupBusinessAssociations(sequelize, Model, DataTypes);

// Export individual models
export { User, Business, Address, CodesPostaux, PointOfSale, Supplier, Clients, Article, Family, Order, UserLicense, LoginAttempt, UserToken };

// Export array of all models for sync operations (ordered by dependencies)
// Parent tables first, then child tables
export const models = [
  User,
  Business,
  CodesPostaux,
  Supplier,
  Clients,
  Family,
  Address,
  PointOfSale,
  Article,
  Order,
  UserLicense,
  LoginAttempt,
  UserToken,
];

// Export model names for logging (in same order as models)
export const modelNames = [
  'users',
  'businesses',
  'codes_postaux',
  'suppliers',
  'clients',
  'families',
  'addresses',
  'points_of_sale',
  'articles',
  'orders',
  'user_licenses',
  'login_attempts',
  'user_tokens',
];

