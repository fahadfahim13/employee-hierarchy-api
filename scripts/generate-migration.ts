import { exec } from 'child_process';
import * as path from 'path';

const migrationName = process.argv[2] || 'AutoGenerated';

exec(`npm run migration:generate src/migrations/${migrationName}Migration`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating migration: ${error}`);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.error(stderr);
  }
});