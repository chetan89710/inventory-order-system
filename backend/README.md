# Inventory Order System Backend

## Overview
This is the backend service for the **Inventory Order System**, built with the NestJS framework.  
It manages **users, products, and orders** with **role-based authentication**, JWT, and S3 file uploads.  
Supports **Admin, Staff, and Customer** portals.

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

Environment Setup
Copy the example environment file:
cp .env.example .env

Update environment variables:
Database credentials
JWT secrets
AWS S3 keys (if using file uploads)

Database Setup

Using Docker (Recommended)
docker run --name inventory-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=inventory_db -p 

Create database:
createdb inventory_db

Run migrations:
npx sequelize-cli db:migrate

Seed initial data:
npx sequelize-cli db:seed:all

Development
Running the Application
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod

Code Style and Linting
We use ESLint and Prettier:
# Lint the code
npm run lint

# Fix linting issues automatically
npm run lint:fix
Database Management

Migrations
# Create a new migration
npx sequelize-cli migration:generate --name create-table-name

# Run all migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

Seeding
# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed YYYYMMDDHHMMSS-seeder-name.js

Testing
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

Deployment
You can deploy on any Node.js hosting platform (AWS, Heroku, DigitalOcean).
Build production bundle:
npm run build
npm run start:prod

API Documentation
Swagger documentation is available at http://localhost:3000/api/docs when running in development mode.

API endpoints are documented using OpenAPI/Swagger decorators.

Project Structure
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

Contributing Guidelines

Create a new branch for each feature/bugfix
Follow coding standards and naming conventions
Write unit tests for new features
Update documentation as needed
Submit pull requests for review

Support and Resources
NestJS Documentation
Sequelize Documentation
AWS S3 Documentation
Internal team documentation (contact project lead)

License
MIT licensed