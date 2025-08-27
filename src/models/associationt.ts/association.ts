import { sequelize } from '../../libs/Db';
import { Model, DataTypes } from 'sequelize';
import { setupUserAssociations } from './userAssociation';
import { setupBusinessAssociations } from './businessAssociation';

// Initialize models and associations without auto-syncing
const { User, Role, Business, UserLicense, LoginAttempt, UserToken } = setupUserAssociations(sequelize, Model, DataTypes);
const { Address } = setupBusinessAssociations(sequelize, Model, DataTypes);

// Export individual models
export { User, Role, Business, Address, UserLicense, LoginAttempt, UserToken };

// Export array of all models for sync operations (ordered by dependencies)
// Parent tables first, then child tables
export const models = [Role, User, Business, Address, UserLicense, LoginAttempt, UserToken];

// Export model names for logging (in same order as models)
export const modelNames = ['roles', 'users', 'businesses', 'addresses', 'user_licenses', 'login_attempts', 'user_tokens'];

