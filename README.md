# Employee Management System API

A robust NestJS-based REST API for employee management with authentication, caching, and logging capabilities.

## Features

- JWT-based authentication
- Role-based access control
- Employee CRUD operations
- Redis caching
- Custom logging
- PostgreSQL database
- Docker support
- Connection pooling
- Request timeout handling

## Tech Stack

- NestJS - Node.js framework
- TypeORM - ORM for database operations
- PostgreSQL - Primary database
- Redis - Caching layer
- Docker - Containerization
- JWT - Authentication
- TypeScript - Programming language

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (for local setup)
- Redis (for local setup)

## Running the Application

### Using Docker (Recommended)

1. Build and start the containers:
 ```bash
 docker compose up --build
 ```

2. Access the API at:
 ```bash
 http://localhost:3000/api/
 ```
3. Run the tests:
 ```bash
 npm run test
 ```

### Running Locally
1. Create a `.env` file and populate it with the required environment variables.

2. Install dependencies:
 ```bash
 npm install --legacy-peer-deps
 ```

3. Run the application:
 ```bash
 npm run start:dev
 ```

4. Access the API at:
 ```bash
 http://localhost:3000/api/
 ```

5. Run the tests:
 ```bash
 npm run test
 ```

## Running End-to-End Tests

1. Create a `.env.test` file with test environment configurations:
 ```bash
 DB_HOST=localhost
 DB_PORT=5432
 DB_USERNAME=test_user
 DB_PASSWORD=test_password
 DB_DATABASE=test_db
 REDIS_HOST=localhost
 REDIS_PORT=6379
 JWT_SECRET=test_secret
 JWT_EXPIRES_IN=1d
 ```

2. Set up a test database:
 ```bash
 # Create test database
 createdb test_db
 
 # Run migrations
 npm run migration:run
 ```

3. Run the e2e tests:
 ```bash
 # Start test database and Redis containers (if using Docker)
 docker compose -f docker-compose.test.yml up -d

 # Run the tests
 npm run test:e2e
 ```

The e2e tests will:
- Create a fresh database instance for testing
- Run all migrations to set up the schema
- Execute test suites that verify API endpoints
- Test authentication flows
- Validate business logic across integrated components
- Clean up test data after completion

Note: The tests use a separate database to avoid interfering with development data.


## Performance Optimization with Caching

To improve API performance and reduce database load, we can implement caching strategies using Redis:

### Setting Up Redis Caching

1. Install required dependencies:

```bash
npm install redis @nestjs/cache-manager cache-manager
``` 

2. Configure caching in `src/app.module.ts`:

```typescript
@Module({
  imports: [CacheModule.register({
    isGlobal: true,
  })],
})
```   

3. Use caching in services or controllers:

```typescript
@Injectable()
export class EmployeeService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
}
```

4. Test caching by running the application and making requests to cached endpoints.
