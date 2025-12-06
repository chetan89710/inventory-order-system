# Inventory Order System Backend

## Overview
This is the backend service for the Inventory Order Syste, built with the NestJS framework.  
It manages users, products, and orders with role-based authentication, JWT, and S3 file uploads.  
Supports Admin, Staff, and Customer portals.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Development](#development)
4. [Database Management](#database-management)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [API Documentation](#api-documentation)
8. [Project Structure](#project-structure)
9. [Contributing Guidelines](#contributing-guidelines)
10. [Support and Resources](#support-and-resources)
11. [License](#license)

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn
- AWS account for S3 (optional, for file uploads)

## Project Setup

### Installation
```bash
npm install
npm install --legacy-peer-deps
```

### Environment Setup
1. Copy the appropriate .env file for your environment:
   ```bash
   cp .env.example .env
   ```
2. Update the environment variables as needed

### Database Setup
#### Using Docker (Recommended)
```bash 
docker run --name inventory-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=inventory_db -p 

```

## Development

### Running the Application
```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

### Code Style and Linting
- We use ESLint and Prettier for code formatting
- Run linting: `npm run lint`
- Fix linting issues: `npm run lint:fix`

## Database Management

### Migration Commands
```bash
# Create a new migration
npx sequelize-cli migration:generate --name create-table-name

# Run all migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

### Seeding Data
```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed YYYYMMDDHHMMSS-seeder-name.js
```

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure
```
backend/
├─ src/
│  ├─ auth/        # JWT authentication & refresh tokens
│  ├─ users/       # User module (CRUD, roles)
│  ├─ products/    # Product module (CRUD, S3 uploads)
│  ├─ orders/      # Order module (create, cancel, confirm)
│  ├─ aws/         # S3 file upload service
│  ├─ common/      # Common decorators, utils, guards
│  └─ main.ts      # App entry point
├─ migrations/     # Sequelize migrations
├─ seeders/        # Seed data for initial setup
├─ .env            # Environment variables
├─ package.json
└─ README.md
```

## API Documentation
- Swagger documentation is available at http://localhost:3000/api/docs when running in development mode.
- API endpoints are documented using OpenAPI/Swagger decorators.

## Contributing Guidelines
1. Create a new branch for each feature/bugfix
2. Follow coding standards and naming conventions
3. Write unit tests for new features
4. Update documentation as needed
5. Submit pull requests for review

## Support and Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [Sequelize Documentation](https://sequelize.org)
- Internal team documentation (contact team lead)

## License
[MIT licensed](LICENSE)