#!/bin/bash
set -e

# Function to check if PostgreSQL is ready
wait_for_postgres() {
  echo "Waiting for PostgreSQL to start..."
  until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -c '\q'; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
  done
  echo "PostgreSQL is up and running!"
}

# Function to check if tables exist
check_tables_exist() {
  echo "Checking if tables exist..."
  TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
  if [ "$TABLE_COUNT" -gt "0" ]; then
    echo "Tables already exist. Cleaning up database..."
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  fi
  echo "Database is clean"
}

# Function to generate timestamp
get_timestamp() {
  date +%s
}

# Function to generate migrations
generate_migrations() {
  echo "Checking for entity changes..."
  
  # Create migrations directory if it doesn't exist
  mkdir -p src/migrations

  # Generate timestamp for migration name
  TIMESTAMP=$(get_timestamp)
  MIGRATION_NAME="InitialMigration${TIMESTAMP}"
  
  echo "Generating new migration: ${MIGRATION_NAME}"
  
  # Remove existing migrations
  rm -rf src/migrations/*
  
  # Generate new migration
  npm run migration:generate src/migrations/${MIGRATION_NAME} || {
    echo "No schema changes detected or error in migration generation"
    return 0
  }
  
  # Build the project to compile new migrations
  echo "Building project with new migrations..."
  npm run build
}

# Main execution
echo "Starting deployment process..."

# Wait for PostgreSQL
wait_for_postgres

# Clean up existing tables
check_tables_exist

# Generate new migrations
generate_migrations

# Run migrations
echo "Running database migrations..."
NODE_ENV=development npm run migration:run

# Start the application
echo "Starting the application..."
if [ "$NODE_ENV" = "development" ]; then
  echo "Starting in development mode..."
  npm run start:dev
else
  echo "Starting in production mode..."
  npm run start:prod
fi