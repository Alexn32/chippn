import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://ilhihpjechjzgqcukbuz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaGlocGplY2hqemdxY3VrYnV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA4MDU5MCwiZXhwIjoyMDg3NjU2NTkwfQ.o9jnLHTScqkuMr7EeyBEyeYX_ptw4oFaof3oCL12u-Y';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function runMigrations() {
  console.log('🚀 Running Supabase migrations...\n');

  try {
    // Read migrations
    const schemaSql = fs.readFileSync('./migrations/001_initial_schema.sql', 'utf8');
    const rlsSql = fs.readFileSync('./migrations/002_rls_policies.sql', 'utf8');

    // Split into individual statements (handle GO or semicolons)
    const schemaStatements = schemaSql.split(';').filter(s => s.trim());
    const rlsStatements = rlsSql.split(';').filter(s => s.trim());

    // Run schema migrations
    console.log('📝 Running schema migrations...');
    for (let i = 0; i < schemaStatements.length; i++) {
      const stmt = schemaStatements[i].trim();
      if (stmt) {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt });
        if (error) {
          console.warn(`  ⚠️ Statement ${i + 1}: ${error.message}`);
        } else {
          console.log(`  ✓ Statement ${i + 1}`);
        }
      }
    }

    // Run RLS migrations
    console.log('\n📝 Running RLS migrations...');
    for (let i = 0; i < rlsStatements.length; i++) {
      const stmt = rlsStatements[i].trim();
      if (stmt) {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt });
        if (error) {
          console.warn(`  ⚠️ Statement ${i + 1}: ${error.message}`);
        } else {
          console.log(`  ✓ Statement ${i + 1}`);
        }
      }
    }

    console.log('\n✅ Migrations completed!');
    console.log('\nNow run:');
    console.log('  npx supabase projects init');
    console.log('  npx supabase link');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runMigrations();
