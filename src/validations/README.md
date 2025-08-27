# Validation System

This directory contains the validation logic for the HRS application using **Zod** for schema validation.

## Structure

```
src/validations/
├── auth/
│   └── register.ts          # Registration schema validation
├── fieldValidators.ts       # Reusable field validation utilities
├── registerSchema.ts        # Registration schema definition
└── README.md               # This file
```

## Features

### 1. Zod Schema Validation
- **Type-safe**: Automatic TypeScript type inference
- **Runtime validation**: Validates data at runtime
- **Rich error messages**: Detailed validation error messages
- **Composable**: Easy to combine and extend schemas

### 2. Reusable API Responses
- **Consistent**: Standardized response format across all endpoints
- **DRY**: No more repetitive response code
- **Maintainable**: Centralized response handling

### 3. Field Validation
- **Flexible**: Support for custom validation rules
- **Reusable**: Common validation patterns
- **Extensible**: Easy to add new validation types

## Usage Examples

### Basic Validation
```typescript
import { registerSchema } from '@/validations/auth/register';

// Validate payload
const validationResult = registerSchema.safeParse(requestBody);

if (!validationResult.success) {
  const errors = validationResult.error.issues.map(issue => 
    `${issue.path.join('.')}: ${issue.message}`
  );
  return ApiResponseHandler.validationError(errors);
}

const payload = validationResult.data; // Type-safe!
```

### API Response Handling
```typescript
import { ApiResponseHandler } from '@/utils/apiResponses';

// Success responses
return ApiResponseHandler.success(data, "Operation successful");
return ApiResponseHandler.created(data, "Resource created");

// Error responses
return ApiResponseHandler.badRequest("Invalid input");
return ApiResponseHandler.conflict("Resource already exists", "duplicate");
return ApiResponseHandler.internalError("Something went wrong");
```

## Benefits

1. **Reduced Code**: Eliminated ~80 lines of repetitive validation code
2. **Better Type Safety**: Zod provides automatic TypeScript types
3. **Consistent Validation**: All fields follow the same validation rules
4. **Easy Maintenance**: Changes to validation rules in one place
5. **Better Error Messages**: Clear, user-friendly validation errors
6. **Reusable**: Can be used across different endpoints

## Adding New Validations

1. Create a new schema file in the appropriate subdirectory
2. Define your Zod schema with validation rules
3. Export the schema and inferred type
4. Use in your API routes with `schema.safeParse()`

## Migration from Old System

The old system used manual if-conditions for each field. The new system:
- Uses Zod schemas for validation
- Provides reusable response functions
- Automatically handles type safety
- Reduces code duplication significantly
