# Alert Components

A collection of reusable alert components for the HRS App, designed to provide consistent user feedback across the application.

## Components

### 1. Alert (Basic)
A flexible alert component that supports different types and configurations.

```tsx
import { Alert } from '@/components/ui/alerts';

<Alert
  type="success"
  title="Success!"
  message="Operation completed successfully."
  onClose={() => setShowAlert(false)}
  autoClose={true}
  autoCloseDelay={3000}
/>
```

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: Optional title for the alert
- `message`: The main message content
- `onClose`: Optional callback when alert is closed
- `className`: Additional CSS classes
- `showIcon`: Whether to show the type icon (default: true)
- `autoClose`: Whether to auto-close the alert (default: false)
- `autoCloseDelay`: Delay before auto-closing in milliseconds (default: 5000)

### 2. EmailVerificationSuccess
Specialized component for email verification success states.

```tsx
import { EmailVerificationSuccess } from '@/components/ui/alerts';

<EmailVerificationSuccess
  onClose={() => router.push('/dashboard')}
  showRedirectMessage={true}
/>
```

**Props:**
- `onClose`: Optional callback when user clicks continue
- `className`: Additional CSS classes
- `showRedirectMessage`: Whether to show redirect message (default: true)

### 3. VerificationCodeSent
Component for when verification codes are sent successfully.

```tsx
import { VerificationCodeSent } from '@/components/ui/alerts';

<VerificationCodeSent
  onClose={() => setShowAlert(false)}
  countdown={600}
/>
```

**Props:**
- `onClose`: Optional callback when alert is closed
- `className`: Additional CSS classes
- `countdown`: Optional countdown in seconds to show expiration time

### 4. VerificationError
Component for verification-related errors with predefined error types.

```tsx
import { VerificationError } from '@/components/ui/alerts';

<VerificationError
  error="invalid_code"
  onClose={() => setShowError(false)}
  customMessage="Custom error message"
/>
```

**Props:**
- `error`: 'invalid_code' | 'expired_code' | 'too_many_attempts' | 'network_error' | 'unknown'
- `onClose`: Optional callback when alert is closed
- `className`: Additional CSS classes
- `customMessage`: Optional custom message to override default

## Usage Examples

### Basic Success Alert
```tsx
<Alert
  type="success"
  message="Your changes have been saved successfully!"
  autoClose={true}
/>
```

### Error Alert with Title
```tsx
<Alert
  type="error"
  title="Upload Failed"
  message="Please check your file and try again."
  onClose={() => setShowError(false)}
/>
```

### Email Verification Flow
```tsx
// When code is sent
<VerificationCodeSent countdown={600} />

// When verification succeeds
<EmailVerificationSuccess onClose={() => router.push('/dashboard')} />

// When verification fails
<VerificationError error="invalid_code" />
```

### Custom Styling
```tsx
<Alert
  type="warning"
  message="Please review your information before proceeding."
  className="my-4 shadow-lg"
  showIcon={false}
/>
```

## Styling

All components use Tailwind CSS classes and follow the design system:
- **Success**: Green colors with checkmark icon
- **Error**: Red colors with X icon
- **Warning**: Yellow colors with warning icon
- **Info**: Blue colors with info icon

## Accessibility

- All alerts have proper ARIA roles (`role="alert"`)
- Close buttons include screen reader text
- Icons are decorative and properly labeled
- Keyboard navigation is supported

## Best Practices

1. **Use appropriate types**: Choose the right alert type for your message
2. **Keep messages concise**: Short, clear messages work best
3. **Provide actions**: Include close buttons or action buttons when appropriate
4. **Auto-close wisely**: Use auto-close for informational messages, not for errors
5. **Consistent placement**: Use consistent positioning across your app
6. **Test accessibility**: Ensure alerts work with screen readers

## Examples Component

You can view all components in action by importing and using the `AlertExamples` component:

```tsx
import { AlertExamples } from '@/components/ui/alerts';

// In your development page
<AlertExamples />
```

This will show interactive examples of all alert types and configurations.
