# SecurePaste

A secure paste service with end-to-end encryption, password protection, and view limits. Built with NestJS and Next.js.

## Overview

SecurePaste is a modern paste service that prioritizes security and privacy. It allows users to share encrypted text snippets with optional password protection and view limits.

## Features

- 🔒 End-to-end encryption for all pastes
- 🔐 Optional password protection
- 👁️ Configurable view limits
- ⏱️ Automatic expiration
- 📱 Modern, responsive UI
- 📊 Comprehensive logging
- 🔍 Request tracing

## Tech Stack

### Backend

- NestJS
- PostgreSQL
- Prisma ORM
- Winston Logger
- JWT Authentication
  [View Backend Documentation →](./backend/README.md)

### Frontend

- Next.js 14
- React
- Tailwind CSS
- TypeScript
- Vercel Deployment
  [View Frontend Documentation →](./frontend/README.md)

## Project Structure

```
securepaste/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration
│   │   ├── paste/          # Paste feature
│   │   ├── crypto/         # Encryption service
│   │   └── prisma/         # Database service
│   ├── prisma/             # Database schema
│   └── test/               # Backend tests
│
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── public/           # Static assets
│   └── styles/           # CSS styles
│
└── docker/               # Docker configuration
    ├── backend/         # Backend Dockerfile
    └── frontend/        # Frontend Dockerfile
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Yarn package manager
- Docker (optional)

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/securepaste.git
   cd securepaste
   ```

2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd backend
   yarn install

   # Install frontend dependencies
   cd ../frontend
   yarn install
   ```

3. Set up environment variables:

   ```bash
   # Backend
   cd backend
   cp .env.example .env

   # Frontend
   cd ../frontend
   cp .env.example .env
   ```

4. Start development servers:

   ```bash
   # Terminal 1 - Backend
   cd backend
   yarn start:dev

   # Terminal 2 - Frontend
   cd frontend
   yarn dev
   ```

### Docker Setup

```bash
# Build and start all services
docker-compose up --build

# Or start individual services
docker-compose up backend
docker-compose up frontend
```

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Run tests:

   ```bash
   # Backend tests
   cd backend
   yarn test

   # Frontend tests
   cd frontend
   yarn test
   ```

4. Submit a pull request

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
