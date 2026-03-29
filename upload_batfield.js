// upload_batfield.js
// Run: node upload_batfield.js
// Make sure bat_field.csv is in the same folder as this script!

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "**********************",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// File must be in same folder as this script
const CSV_PATH = 'bat_field.csv';

function normalizeId(str) {
  return str.trim().toUpperCase().replace(/\s+/g, '_');
}

function numOrNull(v) {
  if (!v || v === '—' || v === '-' || v === '') return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function parseCSV(filePath) {
  const text  = fs.readFileSync(filePath, 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const results = [];
  const headers = ['playerId','format','condition','span','Mat','Runs','HS','Bat Avg','100s','Wkts','BBI','Bowl Avg','5w','Ct','St','Avg Diff'];

  lines.forEach(line => {
    const parts = line.split(',');
    if (parts[0] === 'playerId' || !parts[0].trim()) return;
    const obj = {};
    headers.forEach((h, i) => { obj[h] = parts[i]?.trim() || ''; });
    if (obj['playerId'] && obj['format'] && obj['condition']) results.push(obj);
  });
  return results;
}

async function main() {
  console.log('📖 Reading bat/field CSV...');
  const rows = parseCSV(CSV_PATH);
  console.log(`✅ ${rows.length} rows loaded`);

  // Build: normalizedId → format → condition → stats
  const dataMap = {};
  rows.forEach(r => {
    const id        = normalizeId(r['playerId']);
    const format    = r['format'].toLowerCase().replace('t20', 't20i');
    const condition = r['condition'];
    if (!id || !format || !condition) return;
    if (!dataMap[id]) dataMap[id] = {};
    if (!dataMap[id][format]) dataMap[id][format] = {};
    dataMap[id][format][condition] = {
      matches:  numOrNull(r['Mat']),
      runs:     numOrNull(r['Runs']),
      hs:       r['HS'] || null,
      bat_avg:  numOrNull(r['Bat Avg']),
      hundreds: numOrNull(r['100s']),
      wickets:  numOrNull(r['Wkts']),
      best:     r['BBI'] || null,
      bowl_avg: numOrNull(r['Bowl Avg']),
      five_wkt: numOrNull(r['5w']),
      avg_diff: numOrNull(r['Avg Diff']),
    };
  });

  console.log(`\n🔥 Fetching Firebase...`);
  const snapshot = await getDocs(collection(db, 'seniors'));
  const docs     = snapshot.docs.filter(d => /^S\d+$/i.test(d.id));
  console.log(`Found ${docs.length} documents\n`);

  let updated = 0, skipped = 0;

  for (const d of docs) {
    const data   = d.data();
    const normId = normalizeId(data.name || '');

    // Handle name mismatches
    const lookupId = 
      normId === 'ANJALI_SRAVANI' ? 'ANJALI_SARVANI' :
      normId === 'G_KAMALINI'     ? 'GUNALAN_KAMALINI' :
      normId;

    const found = dataMap[lookupId] || dataMap[normId];

    if (!found) { console.log(`⚠️  No data: ${data.name}`); skipped++; continue; }

    await updateDoc(doc(db, 'seniors', d.id), { bat_field: found });
    const fmts = Object.keys(found).join(', ');
    console.log(`✅ ${d.id} — ${data.name} [${fmts}]`);
    updated++;
  }

  console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => { console.error('❌', err); process.exit(1); });
