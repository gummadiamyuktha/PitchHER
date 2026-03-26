// upload_homeaway_fixed.js
// Run: node upload_homeaway_fixed.js

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

const CSV_PATH = 'C:\\Users\\amyuk\\Desktop\\StrikHER\\StrikHER Seniors Data - home_away.csv';

const NAME_TO_CSV = {
  'AMANJOT_KAUR':        'Amanjot Kaur',
  'ARUNDHATI_REDDY':     'Arundhati Reddy',
  'DAYALAN_HEMALATHA':   'Dayalan Hemalatha',
  'DEEPTI_SHARMA':       'Deepti Sharma',
  'HARLEEN_DEOL':        'Harleen Deol',
  'HARMANPREET_KAUR':    'Harmanpreet Kaur',
  'JEMIMAH_RODRIGUES':   'Jemimah Rodrigues',
  'KASHVEE_GAUTAM':      'Kashvee Gautam',
  'KRANTI_GAUD':         'Kranti Gaud',
  'MEGHNA_SINGH':        'Meghna Singh',
  'MINNU_MANI':          'Minnu Mani',
  'POOJA_VASTRAKAR':     'Pooja Vastrakar',
  'POONAM_YADAV':        'Poonam Yadav',
  'PRIYA_MISHRA':        'Priya Mishra',
  'PRIYA_PUNIA':         'Priya Punia',
  'PRATIKA_RAWAL':       'Pratika Rawal',
  'RADHA_YADAV':         'Radha Yadav',
  'RAJESHWARI_GAYAKWAD': 'Rajeshwari Gayakwad',
  'RENUKA_SINGH':        'Renuka Singh',
  'RICHA_GHOSH':         'Richa Ghosh',
  'SAIKA_ISHAQUE':       'Saika Ishaque',
  'SAIMA_THAKOR':        'Saima Thakor',
  'SAYALI_SATGHARE':     'Sayali Satghare',
  'SNEH_RANA':           'Sneh Rana',
  'SHAFALI_VERMA':       'Shafali Verma',
  'SHREYANKA_PATIL':     'Shreyanka Patil',
  'SMRITI_MANDHANA':     'Smriti Mandhana',
  'SHREE_CHARANI':       'Shree Charani',
  'TANUJA_KANWAR':       'Tanuja Kanwar',
  'TEJAL_HASABNIS':      'Tejal Hasabnis',
  'TITAS_SADHU':         'Titas Sadhu',
  'VAISHNAVI_SHARMA':    'Vaishnavi Sharma',
  'YASTIKA_BHATIA':      'Yastika Bhatia',
  'ANJALI_SRAVANI':      'Anjali Sarvani',
  'BHARTI_FULMALI':      'Bharti Fulmali',
  'G_KAMALINI':          'Gunalan Kamalini',
  'UMA_CHETRY':          'Uma Chetry',
  'SAJEEVAN_SAJANA':     'Sajeevan Sajana',
};

function normalizeId(str) {
  return str.trim().toUpperCase().replace(/\s+/g, '_');
}

function numOrNull(v) {
  if (!v || v === '—' || v === '-' || v === '' || v === '--') return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function isSpan(val) {
  // Span looks like "2014-2026" or "2023-2025"
  return /^\d{4}-\d{4}$/.test(val.trim());
}

function parseRow(parts) {
  // Headers: playerId, format, category, opponent, Span, Mat, Inns, NO, Runs, HS, Avg, BF, SR, 100s, 50s, 0s, 4s, 6s, Overs, Mdns, Runs Conceded, Wkts, BBI, BBM, Bowl Avg, Econ, SR Bowling, 5w, 10w...
  // Some rows are missing the Span column — detect and adjust offset

  const playerId  = parts[0]?.trim();
  const format    = parts[1]?.trim();
  const category  = parts[2]?.trim(); // Home / Away / Neutral
  // parts[3] = opponent (always "All")
  // parts[4] = either Span (if present) or Mat (if Span missing)

  let offset = 5; // normal: Span is at [4], Mat starts at [5]
  if (!isSpan(parts[4] || '')) {
    offset = 4; // Span missing, Mat starts at [4]
  }

  const get = (i) => parts[offset + i]?.trim() || '';

  return {
    playerId,
    format:   format?.toLowerCase().replace('t20', 't20i'),
    category,
    matches:  numOrNull(get(0)),   // Mat
    innings:  numOrNull(get(1)),   // Inns
    not_outs: numOrNull(get(2)),   // NO
    runs:     numOrNull(get(3)),   // Runs
    hs:       get(4) || null,      // HS
    avg:      numOrNull(get(5)),   // Avg
    bf:       numOrNull(get(6)),   // BF
    sr:       numOrNull(get(7)),   // SR
    hundreds: numOrNull(get(8)),   // 100s
    fifties:  numOrNull(get(9)),   // 50s
    // bowling
    wickets:  numOrNull(get(16)),  // Wkts (after 4s, 6s, Overs, Mdns, Runs Conceded)
    best:     get(17) || null,     // BBI
    bowl_avg: numOrNull(get(19)),  // Bowl Avg
    economy:  numOrNull(get(20)),  // Econ
  };
}

function parseCSV(filePath) {
  const text  = fs.readFileSync(filePath, 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (!parts[0]?.trim() || parts[0].trim() === 'playerId') continue;
    const row = parseRow(parts);
    if (row.playerId && row.format && row.category) results.push(row);
  }
  return results;
}

async function main() {
  console.log('📖 Reading home/away CSV...');
  const rows = parseCSV(CSV_PATH);
  console.log(`✅ ${rows.length} rows loaded`);

  // Build: csvName → format → category → stats
  const dataMap = {};
  rows.forEach(r => {
    const name = r.playerId.trim();
    if (!dataMap[name]) dataMap[name] = {};
    if (!dataMap[name][r.format]) dataMap[name][r.format] = {};
    dataMap[name][r.format][r.category] = {
      matches:  r.matches,
      runs:     r.runs,
      avg:      r.avg,
      sr:       r.sr,
      high_score: r.hs,
      hundreds: r.hundreds,
      fifties:  r.fifties,
      wickets:  r.wickets,
      economy:  r.economy,
      best_bowling: r.best,
      bowl_avg: r.bowl_avg,
    };
  });

  // Sample check
  console.log('Sample Amanjot T20I Away:', JSON.stringify(dataMap['Amanjot Kaur']?.['t20i']?.['Away'] || 'NOT FOUND'));

  console.log('\n🔥 Fetching Firebase...');
  const snapshot = await getDocs(collection(db, 'seniors'));
  const docs     = snapshot.docs.filter(d => /^S\d+$/i.test(d.id));

  let updated = 0, skipped = 0;

  for (const d of docs) {
    const data    = d.data();
    const normId  = normalizeId(data.name || '');
    const csvName = NAME_TO_CSV[normId];

    if (!csvName) { console.log(`⚠️  No mapping: ${data.name}`); skipped++; continue; }

    const playerData = dataMap[csvName];
    if (!playerData) { console.log(`⚠️  No data: ${data.name}`); skipped++; continue; }

    await updateDoc(doc(db, 'seniors', d.id), { home_away: playerData });
    const fmts = Object.keys(playerData).join(', ');
    console.log(`✅ ${d.id} — ${data.name} [${fmts}]`);
    updated++;
  }

  console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => { console.error('❌', err); process.exit(1); });