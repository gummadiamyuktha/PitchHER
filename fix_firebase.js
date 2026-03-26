// fix_firebase_v2.js
// Run: node fix_firebase_v2.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyBvNvCujd92uA7pCp88XB79vKMwOiZZ0Rc",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CSV_DIR = 'C:\\Users\\amyuk\\Desktop\\StrikHER';
const ODI_CSV  = path.join(CSV_DIR, 'StrikHER Seniors Data - OVERALL_ODI_stats.csv');
const T20_CSV  = path.join(CSV_DIR, 'StrikHER Seniors Data - Overall_t20_stats.csv');
const TEST_CSV = path.join(CSV_DIR, 'StrikHER Seniors Data - overall_test_stats.csv');

// ── Manual name fixes: Firebase name → CSV ID ─────────────────────────────
// Add any mismatches here
const NAME_OVERRIDES = {
  'ANJALI_SRAVANI': 'ANJALI_SARVANI',   // Firebase has W, CSV has V
  'SHREE_CHARANI':  'SREE_CHARANI',     // Firebase has Sh, CSV has S
};

// Documents to DELETE from Firebase (fake/wrong players)
const DOCS_TO_DELETE = [
  'S28', // Sakshi Malhar — does not exist
];

// ── Helpers ────────────────────────────────────────────────────────────────
function parseCSV(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  });
}

function normalizeId(str) {
  return str.trim().toUpperCase().replace(/\s+/g, '_');
}

function numOrNull(val) {
  if (!val || val === '—' || val === '-' || val === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
}

function rowToStats(row) {
  return {
    matches:      numOrNull(row['Matches']),
    bat_innings:  numOrNull(row['Bat Inns']),
    not_outs:     numOrNull(row['NO']),
    runs:         numOrNull(row['Runs']),
    high_score:   row['HS'] || null,
    bat_avg:      numOrNull(row['Bat Avg']),
    balls_faced:  numOrNull(row['Balls Faced']),
    sr:           numOrNull(row['SR']),
    hundreds:     numOrNull(row['100s']),
    fifties:      numOrNull(row['50s']),
    fours:        numOrNull(row['4s']),
    sixes:        numOrNull(row['6s']),
    bowl_innings: numOrNull(row['Bowl Inns']),
    balls_bowled: numOrNull(row['Balls Bowled']),
    maidens:      numOrNull(row['Maidens']),
    runs_given:   numOrNull(row['Runs Given']),
    wickets:      numOrNull(row['Wkts']),
    best_bowling: row['Best'] || null,
    economy:      numOrNull(row['Econ']),
    bowl_avg:     numOrNull(row['Bowl Avg']),
    bowl_sr:      numOrNull(row['Bowl SR']),
    four_wkt:     numOrNull(row['4W']),
    five_wkt:     numOrNull(row['5W']),
    catches:      numOrNull(row['Catches']),
    run_outs:     numOrNull(row['Run Outs']),
    stumpings:    numOrNull(row['Stumpings']),
  };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('📖 Reading CSVs...');
  const odiRows  = parseCSV(ODI_CSV);
  const t20Rows  = parseCSV(T20_CSV);
  const testRows = parseCSV(TEST_CSV);

  const odiMap  = {};
  const t20Map  = {};
  const testMap = {};

  odiRows.forEach(r  => { odiMap[normalizeId(r['Player ID'])]  = rowToStats(r); });
  t20Rows.forEach(r  => { t20Map[normalizeId(r['Player ID'])]  = rowToStats(r); });
  testRows.forEach(r => { testMap[normalizeId(r['Player ID'])] = rowToStats(r); });

  console.log(`✅ ODI: ${Object.keys(odiMap).length}, T20I: ${Object.keys(t20Map).length}, Test: ${Object.keys(testMap).length}`);

  // Delete fake documents first
  console.log('\n🗑️  Deleting fake documents...');
  for (const docId of DOCS_TO_DELETE) {
    await deleteDoc(doc(db, 'seniors', docId));
    console.log(`🗑️  Deleted ${docId}`);
  }

  // Fetch remaining S-code documents
  console.log('\n🔥 Fetching Firebase documents...');
  const snapshot = await getDocs(collection(db, 'seniors'));
  const docs = snapshot.docs.filter(d => /^S\d+$/i.test(d.id));
  console.log(`Found ${docs.length} S-code documents\n`);

  let updated = 0;
  let skipped = 0;

  for (const d of docs) {
    const data = d.data();
    const playerName = data.name || '';
    let normalizedName = normalizeId(playerName);

    // Apply name override if exists
    const csvName = NAME_OVERRIDES[normalizedName] || normalizedName;

    const odiStats  = odiMap[csvName]  || null;
    const t20Stats  = t20Map[csvName]  || null;
    const testStats = testMap[csvName] || null;

    if (!odiStats && !t20Stats && !testStats) {
      console.log(`⚠️  No CSV match for: ${playerName} (tried: ${csvName})`);
      skipped++;
      continue;
    }

    const formats = {};
    if (odiStats)  formats.odi  = odiStats;
    if (t20Stats)  formats.t20i = t20Stats;
    if (testStats) formats.test = testStats;

    await updateDoc(doc(db, 'seniors', d.id), { formats });
    const formatList = Object.keys(formats).join(', ');
    console.log(`✅ ${d.id} — ${playerName} [${formatList}]`);
    updated++;
  }

  console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});