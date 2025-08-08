import { sequelize } from '../../libs/Db';
import { Model, DataTypes } from 'sequelize';
import { setupUserAssociations } from './userAssociation';

// Initialize models and associations without auto-syncing
const { User, Role, UserLicense, LoginAttempt, UserToken } = setupUserAssociations(sequelize, Model, DataTypes);

// Export individual models
export { User, Role, UserLicense, LoginAttempt, UserToken };

// Export array of all models for sync operations (ordered by dependencies)
// Parent tables first, then child tables
export const models = [Role, User, UserLicense, LoginAttempt, UserToken];

// Export model names for logging (in same order as models)
export const modelNames = ['roles', 'users', 'user_licenses', 'login_attempts', 'user_tokens'];

