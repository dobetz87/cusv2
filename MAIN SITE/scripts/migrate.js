const fs = require('fs');
const path = require('path');
const https = require('https');

// Supabase project ref = ambil dari URL
const SUPABASE_URL = 'https://ioxquhhljxiyvmkjqgii.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_2fVA51CfXshit627svQJxQ_NYWLdzpk';
const PROJECT_REF = 'ioxquhhljxiyvmkjqgii';

// Read SQL file
const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '001_init.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Split SQL into individual statements (split on ';' + newline)
function splitStatements(sql) {
  // Remove comments and split
  return sql
    .replace(/--.*$/gm, '')       // remove line comments
    .split(/;\s*\n/)               // split on semicolon+newline
    .map(s => s.trim())
    .filter(s => s.length > 10);  // skip empty/tiny
}

async function runQuery(statement) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: statement + ';' });
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    // Use the SQL API endpoint
    const options = {
      hostname: url.hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          // Non-fatal if already exists
          const parsed = JSON.parse(data || '{}');
          resolve({ ok: false, status: res.statusCode, msg: parsed.message || data });
        } else {
          resolve({ ok: true });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('📋 Cus MVP — Database Migration\n');
  console.log('ℹ️  Direct DB connection tidak tersedia dari localhost.');
  console.log('📌 Jalankan SQL ini MANUAL di Supabase SQL Editor:\n');
  console.log('   https://supabase.com/dashboard/project/ioxquhhljxiyvmkjqgii/sql/new\n');
  console.log('='.repeat(60));
  console.log('File SQL sudah siap di:');
  console.log(`   ${sqlFile}`);
  console.log('='.repeat(60));

  // Print a shorter version of what needs to run
  const statements = splitStatements(sql);
  console.log(`\n✅ Total ${statements.length} SQL statements siap dijalankan.`);
  console.log('\n📋 Copy isi file berikut ke SQL Editor Supabase:\n');
  console.log(`   ${sqlFile}\n`);

  // Test connectivity via REST
  console.log('🔌 Testing Supabase REST connection...');
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ioxquhhljxiyvmkjqgii.supabase.co',
      path: '/rest/v1/profiles?limit=1',
      method: 'GET',
      headers: {
        'apikey': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log('✅ REST API accessible! Status:', res.statusCode);
          console.log('✅ Key valid — Supabase project connected.');
        } else {
          console.log('⚠️  REST Status:', res.statusCode, data.slice(0, 200));
        }
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log('❌ Connection error:', e.message);
      resolve();
    });
    req.end();
  });
}

main();
