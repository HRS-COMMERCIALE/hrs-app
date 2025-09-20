# i18n Migration Guide

This guide explains how to migrate from the old object-based localization system to the new i18n system using `next-intl`.

## What Changed

### Before (Object-based)
```tsx
import { useLanguageStore } from '@/store/languageStore';

function MyComponent() {
  const { currentTranslations } = useLanguageStore();
  
  return (
    <div>
      <h1>{currentTranslations.homePage.navbar.home}</h1>
      <p>{currentTranslations.auth.login.title}</p>
    </div>
  );
}
```

### After (i18n with next-intl)
```tsx
import { useI18n } from '@/i18n/hooks';

function MyComponent() {
  const { tNested } = useI18n();
  
  return (
    <div>
      <h1>{tNested('homePage.navbar').t('home')}</h1>
      <p>{tNested('auth.login').t('title')}</p>
    </div>
  );
}
```

## How to Use

### 1. Basic Translation
```tsx
import { useI18n } from '@/i18n/hooks';

function MyComponent() {
  const { t } = useI18n();
  
  return <h1>{t('homePage.navbar.home')}</h1>;
}
```

### 2. Nested Translations
```tsx
import { useI18n } from '@/i18n/hooks';

function MyComponent() {
  const { tNested } = useI18n();
  
  return (
    <div>
      <h1>{tNested('homePage.heroSection.hero.title').t('line1')}</h1>
      <p>{tNested('auth.login').t('subtitle')}</p>
    </div>
  );
}
```

### 3. Get Current Locale
```tsx
import { useI18n } from '@/i18n/hooks';

function MyComponent() {
  const { locale } = useI18n();
  
  return <p>Current language: {locale}</p>;
}
```

## File Structure

```
src/
├── i18n/
│   ├── config.ts          # i18n configuration
│   ├── provider.tsx       # i18n provider component
│   ├── hooks.ts          # Custom hooks
│   └── MIGRATION_GUIDE.md # This file
├── messages/
│   ├── en.json           # English translations
│   ├── fr.json           # French translations
│   └── ar.json           # Arabic translations
└── middleware.ts          # Locale detection middleware
```

## Benefits

1. **Type Safety**: Full TypeScript support with autocomplete
2. **Performance**: Only loads translations for the current locale
3. **SEO**: Proper URL structure with locale prefixes
4. **Scalability**: Easy to add new languages
5. **Standards**: Uses industry-standard i18n practices

## Adding New Translations

1. Add the key to all locale files (`en.json`, `fr.json`, `ar.json`)
2. Use the key in your component with `t('key')` or `tNested('namespace').t('key')`

## Migration Steps

1. Replace `useLanguageStore` imports with `useI18n`
2. Update translation access patterns
3. Test all locales
4. Remove old language store if no longer needed
