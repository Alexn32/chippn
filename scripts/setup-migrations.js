const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://ilhihpjechjzgqcukbuz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGlocGplY2hqemdxY3VrYnV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA4MDU5MCwiZXhwIjoyMDg3NjU2NTkwfQ.o9jnLHTScqkuMr7EeyBEyeYX_ptw4oFaof3oCL12u-Y';

// Read migration files
const schema = fs.readFileSync('./migrations/001_initial_schema.sql', 'utf8');
const rls = fs.readFileSync('./migrations/002_rls_policies.sql', 'utf8');

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

async function runMigrations() {
  console.log('🚀 Running Supabase migrations...\n');

  try {
    console.log('📝 Migration 1: Creating tables...');
    await executeSQL(schema);
    console.log('✅ Tables created\n');

    console.log('📝 Migration 2: Applying RLS policies...');
    await executeSQL(rls);
    console.log('✅ RLS policies applied\n');

    console.log('✨ All migrations completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Go to Supabase Storage bucket and create "chore-photos" bucket');
    console.log('2. Run: npm install');
    console.log('3. Run: npm start');
    console.log('4. Test in Expo Go');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
