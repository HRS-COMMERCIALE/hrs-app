import { sequelize } from '../../libs/Db';
import { Model, DataTypes } from 'sequelize';
import { setupUserAssociations } from './userAssociation';
import { setupBusinessAssociations } from './businessAssociation';

// Lazy initialization of models to prevent build-time database connection
let userModels: any = null;
let businessModels: any = null;

function initializeModels() {
  if (!userModels || !businessModels) {
    userModels = setupUserAssociations(sequelize(), Model, DataTypes);
    businessModels = setupBusinessAssociations(sequelize(), Model, DataTypes);
  }
  return { ...userModels, ...businessModels };
}

// Export individual models as getters to prevent immediate initialization
export const User = () => initializeModels().User;
export const Business = () => initializeModels().Business;
export const UserLicense = () => initializeModels().UserLicense;
export const LoginAttempt = () => initializeModels().LoginAttempt;
export const UserToken = () => initializeModels().UserToken;
export const PaymentTransaction = () => initializeModels().PaymentTransaction;
export const Address = () => initializeModels().Address;
export const CodesPostaux = () => initializeModels().CodesPostaux;
export const PointOfSale = () => initializeModels().PointOfSale;
export const Supplier = () => initializeModels().Supplier;
export const Clients = () => initializeModels().Clients;
export const Article = () => initializeModels().Article;
export const Family = () => initializeModels().Family;
export const Order = () => initializeModels().Order;
export const BuinessUsers = () => initializeModels().BuinessUsers;

// Export array of all models for sync operations (ordered by dependencies)
// Parent tables first, then child tables
export const models = () => [
  User(),
  Business(),
  BuinessUsers(),
  CodesPostaux(),
  Supplier(),
  Clients(),
  Family(),
  Address(),
  PointOfSale(),
  Article(),
  Order(),
  UserLicense(),
  LoginAttempt(),
  UserToken(),
  PaymentTransaction(),
];

// Export model names for logging (in same order as models)
export const modelNames = [
  'users',
  'businesses',
  'business_users',
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
  'payment_transactions',
];

