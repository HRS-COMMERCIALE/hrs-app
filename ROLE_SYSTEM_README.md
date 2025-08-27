# Role System Implementation

## Overview
The application now implements a role-based access control (RBAC) system with four predefined roles:

- **USER**: Basic user role
- **MANAGER**: Manager role with elevated permissions
- **ADMIN**: Administrator role with high-level permissions
- **SUPER_ADMIN**: Super administrator with highest permissions

## Changes Made

### 1. Role Model (`src/models/user/Role.ts`)
- Added `UserRole` enum with the four role values
- Changed the `name` field to use ENUM type instead of STRING
- Ensures only valid role values can be stored

### 2. User Model (`src/models/user/User.ts`)
- Added `roleId` field to establish relationship with Role model
- Added `title` field to match the validation schema
- Added foreign key reference to the roles table

### 3. Role Assignment Service (`src/services/auth/register/AssignRole.ts`)
- Automatically finds or creates roles as needed
- Defaults to assigning the ADMIN role to new users
- Handles role creation if the role doesn't exist

### 4. User Creation Service (`src/services/auth/register/createUser.ts`)
- Automatically assigns the ADMIN role to all new users
- Includes roleId when creating new users

### 5. API Response (`src/app/api/auth/register/route.ts`)
- Returns role information in the registration response
- Includes roleId, title, and status in the response
- Updated success message to indicate admin role assignment

## Database Setup

### 1. Sync Database Models
Run the database sync to create the new tables and fields:
```bash
npm run db:alter-sync
```

### 2. Seed Default Roles
Seed the database with the default roles:
```bash
npm run db:seed-roles
```

## Usage

### Automatic Role Assignment
When a user registers through the `/api/auth/register` endpoint, they are automatically assigned the ADMIN role.

### Manual Role Assignment
To assign a different role, you can modify the `assignRole` function call in `createUser.ts`:

```typescript
// Assign a specific role
const roleId = await assignRole(UserRole.USER); // or MANAGER, ADMIN, SUPER_ADMIN
```

### Role Enum Usage
Import and use the UserRole enum in your code:

```typescript
import { UserRole } from '@/models/user/Role';

// Check if user has admin role
if (user.roleId === UserRole.ADMIN) {
  // Admin-specific logic
}
```

## Database Schema

### Roles Table
```sql
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('user', 'manager', 'admin', 'super_admin') NOT NULL UNIQUE
);
```

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mobile VARCHAR(255) NOT NULL,
  landline VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  roleId INT NOT NULL,
  FOREIGN KEY (roleId) REFERENCES roles(id)
);
```

## API Response Format

After successful registration, the API returns:

```json
{
  "success": true,
  "message": "User registered successfully with admin role",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "title": "Mr.",
    "roleId": 3,
    "status": "active"
  }
}
```

## Error Handling

The system now handles role-related errors:
- If role assignment fails, returns a specific error message
- Logs role assignment errors for debugging
- Gracefully handles database connection issues

## Future Enhancements

Consider implementing:
1. Role-based middleware for route protection
2. Permission system based on roles
3. Role hierarchy and inheritance
4. Dynamic role assignment based on business logic
5. Role change audit logging
