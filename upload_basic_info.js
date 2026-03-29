// upload_basic_info.js
// Run: node upload_basic_info.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "*****************",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const CSV_PATH = 'players_basic_info.csv';

// Firebase name → CSV name (for mismatches)
const NAME_OVERRIDES = {
  'ANJALI_SRAVANI': 'ANJALI_SARVANI',  // Firebase spells it with W, CSV with V
};

function normalizeId(str) {
  return str.trim().toUpperCase().replace(/\s+/g, '_');
}

function parseCSV(filePath) {
  const text  = fs.readFileSync(filePath, 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let current = '', inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"')      inQuotes = !inQuotes;
      else if (line[c] === ',' && !inQuotes) { parts.push(current.trim()); current = ''; }
      else current += line[c];
    }
    parts.push(current.trim());

    const name = parts[0]?.trim() || '';
    if (name) results.push({
      name,
      role:          parts[1]?.trim() || '',
      dob:           parts[2]?.trim() || '',
      current_team:  parts[3]?.trim() || '',
      batting_style: parts[4]?.trim() || '',
      bowling_style: parts[5]?.trim() || '',
      home_city:     parts[6]?.trim() || '',
    });
  }
  return results;
}

async function main() {
  console.log('📖 Reading CSV...');
  const rows = parseCSV(CSV_PATH);
  console.log(`✅ ${rows.length} players loaded`);

  // Build lookup: normalizedName → row
  const dataMap = {};
  rows.forEach(r => { dataMap[normalizeId(r.name)] = r; });

  console.log('\n🔥 Fetching Firebase...');
  const snapshot = await getDocs(collection(db, 'seniors'));
  const docs     = snapshot.docs.filter(d => /^S\d+$/i.test(d.id));
  console.log(`Found ${docs.length} documents\n`);

  let updated = 0, skipped = 0;

  for (const d of docs) {
    const existing = d.data();
    const normId   = normalizeId(existing.name || '');

    // Apply override if exists, then look up
    const lookupId = NAME_OVERRIDES[normId] || normId;
    const found    = dataMap[lookupId] || dataMap[normId];

    if (!found) {
      console.log(`⚠️  No match: ${existing.name} (tried: ${lookupId})`);
      skipped++;
      continue;
    }

    await updateDoc(doc(db, 'seniors', d.id), {
      name:          found.name,
      role:          found.role,
      dob:           found.dob,
      current_team:  found.current_team,
      batting_style: found.batting_style,
      bowling_style: found.bowling_style,
      home_city:     found.home_city,
    });

    console.log(`✅ ${d.id} — ${existing.name} → ${found.name}`);
    updated++;
  }

  console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => { console.error('❌', err); process.exit(1); });
