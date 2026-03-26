// upload_vsteam.js
// Run: node upload_vsteam.js
// Place vs_batting.csv and vs_bowling.csv in same folder

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyBvNvCujd92uA7pCp88XB79vKMwOiZZ0Rc",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const BAT_CSV  = 'StrikHER Seniors Data - vs_team_batting.csv';
const BOWL_CSV = 'StrikHER Seniors Data - vs_team bollowing & fielding.csv';

function normalizeId(str) {
  return str.trim().toUpperCase().replace(/\s+/g, '_');
}

function normalizeTeam(str) {
  // Remove "vs " prefix and trim
  return str.replace(/^vs\s+/i, '').trim();
}

function numOrNull(v) {
  if (!v || v === '—' || v === '-' || v === '') return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function parseCSV(filePath) {
  const text  = fs.readFileSync(filePath, 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const parts = line.split(',');
    const obj   = {};
    headers.forEach((h, i) => { obj[h] = parts[i]?.trim() || ''; });
    return obj;
  }).filter(r => r['playerId'] && r['playerId'] !== 'playerId' && r['vs Team'] && r['format']);
}

async function main() {
  console.log('📖 Reading VS Team CSVs...');
  const batRows  = parseCSV(BAT_CSV);
  const bowlRows = parseCSV(BOWL_CSV);
  console.log(`✅ Batting: ${batRows.length} rows, Bowling: ${bowlRows.length} rows`);

  // Build: normalizedId → format → team → { batting, bowling }
  const dataMap = {};

  batRows.forEach(r => {
    const id     = normalizeId(r['playerId']);
    const fmt = r['format'].toLowerCase().trim();
    const format = fmt === 't20' || fmt === 't20i' ? 't20i' : fmt === 'test' ? 'test' : 'odi';
    const team   = normalizeTeam(r['vs Team']);
    if (!id || !format || !team) return;
    if (!dataMap[id]) dataMap[id] = {};
    if (!dataMap[id][format]) dataMap[id][format] = {};
    if (!dataMap[id][format][team]) dataMap[id][format][team] = {};
    dataMap[id][format][team].batting = {
      matches:  numOrNull(r['Mat']),
      innings:  numOrNull(r['Inns']),
      runs:     numOrNull(r['Runs']),
      hs:       r['HS'] || null,
      avg:      numOrNull(r['Avg']),
      sr:       numOrNull(r['SR']),
      hundreds: numOrNull(r['100s']),
      fifties:  numOrNull(r['50s']),
    };
  });

  bowlRows.forEach(r => {
    const id     = normalizeId(r['playerId']);
    const fmt = r['format'].toLowerCase().trim();
    const format = fmt === 't20' || fmt === 't20i' ? 't20i' : fmt === 'test' ? 'test' : 'odi';
    const team   = normalizeTeam(r['vs Team']);
    if (!id || !format || !team) return;
    if (!dataMap[id]) dataMap[id] = {};
    if (!dataMap[id][format]) dataMap[id][format] = {};
    if (!dataMap[id][format][team]) dataMap[id][format][team] = {};
    dataMap[id][format][team].bowling = {
      matches:  numOrNull(r['Mat']),
      wickets:  numOrNull(r['Wkts']),
      best:     r['BBI'] || null,
      economy:  numOrNull(r['Econ']),
      bowl_avg: numOrNull(r['Bowl Avg']),
      five_wkt: numOrNull(r['5w']),
    };
  });

  // Fetch Firebase
  console.log('\n🔥 Fetching Firebase...');
  const snapshot = await getDocs(collection(db, 'seniors'));
  const docs     = snapshot.docs.filter(d => /^S\d+$/i.test(d.id));
  console.log(`Found ${docs.length} documents\n`);

  let updated = 0, skipped = 0;

  for (const d of docs) {
    const data   = d.data();
    const normId = normalizeId(data.name || '');

    const lookupId =
      normId === 'ANJALI_SRAVANI' ? 'ANJALI_SARVANI' :
      normId === 'G_KAMALINI'     ? 'GUNALAN_KAMALINI' :
      normId;

    const found = dataMap[lookupId] || dataMap[normId];

    if (!found) { console.log(`⚠️  No data: ${data.name}`); skipped++; continue; }

    await updateDoc(doc(db, 'seniors', d.id), { vs_teams: found });
    const fmts       = Object.keys(found).join(', ');
    const teamCount  = Object.values(found).reduce((a, f) => a + Object.keys(f).length, 0);
    console.log(`✅ ${d.id} — ${data.name} [${fmts}] (${teamCount} team entries)`);
    updated++;
  }

  console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => { console.error('❌', err); process.exit(1); });