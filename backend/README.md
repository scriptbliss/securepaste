# SecurePaste Backend

A secure paste service backend built with NestJS, providing encrypted paste storage with optional password protection and view limits.

[← Back to Project Root](../README.md)

## Overview

The backend provides a secure API for managing encrypted pastes. It handles encryption, password protection, and view limits while ensuring data privacy and security.

## Features

- 🔒 Secure paste storage with optional password protection
- ⏱️ Configurable expiration times
- 👁️ View limit controls
- 🔐 End-to-end encryption
- 📝 Request tracing with correlation IDs
- 📊 Comprehensive logging system

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL with Prisma ORM
- **Security:**
  - bcrypt for password hashing
  - Node.js crypto for encryption
- **Logging:** Winston with daily rotation
- **Validation:** class-validator, class-transformer
- **Configuration:** @nestjs/config with Joi validation

## Project Structure

```
src/
├── common/           # Shared code
│   ├── logger/      # Logging service
│   ├── middleware/  # HTTP middleware
│   ├── filter/      # Exception filters
│   └── utils/       # Utility functions
├── config/          # Configuration
├── paste/           # Paste feature
├── crypto/          # Encryption service
└── prisma/          # Database service
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Yarn package manager

### Installation

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Generate Prisma client:
   ```bash
   yarn prisma generate
   ```

## Development

```bash
# Start development server
yarn start:dev

# Run tests
yarn test

# Run e2e tests
yarn test:e2e

# Lint code
yarn lint
```

## Environment Variables

Required environment variables:

```env
# App
NODE_ENV=development
APP_HOST=localhost
APP_PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/securepaste?schema=public"

# Crypto
CRYPTO_SECRET_KEY=your-secret-key
CRYPTO_ALGORITHM=aes-256-gcm
CRYPTO_IV_LENGTH=16
```

## API Endpoints

### Paste Management

- `POST /paste` - Create a new paste

  ```json
  {
    "content": "string",
    "password": "string?",
    "expiry": "ISO date string?",
    "viewLimit": "number?"
  }
  ```

- `GET /paste/:id` - Get paste content

  - Header: `x-paste-password` (optional)

- `GET /paste/:id/metadata` - Get paste metadata
  - Returns: `{ isPasswordProtected: boolean, isExpired: boolean }`

## Logging

The application uses a structured logging system:

- Development: Pretty-printed logs with colors
- Production: JSON format with daily rotation
- Log files:
  - `logs/app-*.log`: General logs (14 days retention)
  - `logs/error-*.log`: Error logs (30 days retention)
- Features:
  - Request tracing with correlation IDs
  - Stack trace sanitization in production
  - Sensitive data redaction
  - Secure file permissions

## Security Features

- Password-protected pastes using bcrypt
- End-to-end encryption for paste content
- View limits to prevent abuse
- Automatic paste expiration
- CORS protection
- Request validation
- Secure error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
