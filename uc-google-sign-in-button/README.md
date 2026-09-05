# UcGoogleSignInButton

A pre-styled "Sign in with Google" button that redirects the browser to a Google OAuth endpoint.

## Features

- **Zero JavaScript OAuth**: Navigates to the backend Google sign-in URL rather than loading the Google SDK
- **Return-URL support**: Encodes a `returnUrl` query parameter for post-login redirect
- **Configurable API base**: Override the default `/api` base via `apiBaseUrl`

## Usage

```typescript
import { UcGoogleSignInButton } from '@enumsoftware/universal-components';

@Component({
  imports: [UcGoogleSignInButton],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-google-sign-in-button />
```

### With return URL

```html
<uc-google-sign-in-button returnUrl="/dashboard" />
```

### Custom API base

```html
<uc-google-sign-in-button apiBaseUrl="https://api.example.com" returnUrl="/home" />
```

## API

### Inputs

| Input        | Type                  | Default      | Description                                                              |
|--------------|-----------------------|--------------|--------------------------------------------------------------------------|
| `returnUrl`  | `string \| undefined` | `undefined`  | Path appended as `?returnUrl=…` to the sign-in URL                       |
| `apiBaseUrl` | `string`              | `'/api'`     | Base URL prepended to `/auth/google`; trailing slash is stripped         |

The resolved sign-in URL is `{apiBaseUrl}/auth/google[?returnUrl=…]`.
