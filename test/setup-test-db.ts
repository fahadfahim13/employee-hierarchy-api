import { Client } from 'pg';
import { testConfig } from '../test/test-config';

async function setupTestDatabase() {
  const client = new Client({
    host: testConfig.database.host,
    port: testConfig.database.port,
    user: testConfig.database.username,
    password: testConfig.database.password,
    database: 'employee' // Connect to default database first
  });

  try {
    await client.connect();
    
    // Drop test database if exists
    await client.query(`
      DROP DATABASE IF EXISTS ${testConfig.database.database}
    `);
    
    // Create test database
    await client.query(`
      CREATE DATABASE ${testConfig.database.database}
    `);
    
    console.log('Test database setup completed');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

setupTestDatabase();