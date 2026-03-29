// upload_yearwise_v2.js
// Run: node upload_yearwise_v2.js

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

const CSV_PATH = 'C:\\Users\\amyuk\\Desktop\\StrikHER\\StrikHER Seniors Data - year_wise.csv';

const NAME_TO_CSV = {
  'AMANJOT_KAUR':        'AMANJOT_KAUR',
  'ARUNDHATI_REDDY':     'ARUNDHATI_REDDY',
  'DAYALAN_HEMALATHA':   'DAYALAN_HEMALATHA',
  'DEEPTI_SHARMA':       'DEEPTI_SHARMA',
  'HARLEEN_DEOL':        'HARLEEN_DEOL',
  'HARMANPREET_KAUR':    'HARMANPREET_KAUR',
  'JEMIMAH_RODRIGUES':   'JEMIMAH_RODRIGUES',
  'KASHVEE_GAUTAM':      'KASHVEE_GAUTAM',
  'KRANTI_GAUD':         'KRANTI_GAUD',
  'MEGHNA_SINGH':        'MEGHNA_SINGH',
  'MINNU_MANI':          'MINNU_MANI',
  'POOJA_VASTRAKAR':     'POOJA_VASTRAKAR',
  'POONAM_YADAV':        'POONAM_YADAV',
  'PRIYA_MISHRA':        'PRIYA_MISHRA',
  'PRIYA_PUNIA':         'PRIYA_PUNIA',
  'PRATIKA_RAWAL':       'PRATIKA_RAWAL',
  'RADHA_YADAV':         'RADHA_YADAV',
  'RAJESHWARI_GAYAKWAD': 'RAJESHWARI_GAYAKWAD',
  'RENUKA_SINGH':        'RENUKA_SINGH',
  'RICHA_GHOSH':         'RICHA_GHOSH',
  'SAIKA_ISHAQUE':       'SAIKA_ISHAQUE',
  'SAIMA_THAKOR':        'SAIMA_THAKOR',
  'SAYALI_SATGHARE':     'SAYALI_SATGHARE',
  'SNEH_RANA':           'SNEH_RANA',
  'SHAFALI_VERMA':       'SHAFALI_VERMA',
  'SHREYANKA_PATIL':     'SHREYANKA_PATIL',
  'SMRITI_MANDHANA':     'SMRITI_MANDHANA',
  'SHREE_CHARANI':       'SHREE_CHARANI',
  'TANUJA_KANWAR':       'TANUJA_KANWAR',
  'TEJAL_HASABNIS':      'TEJAL_HASABNIS',
  'TITAS_SADHU':         'TITAS_SADHU',
  'VAISHNAVI_SHARMA':    'VAISHNAVI_SHARMA',
  'YASTIKA_BHATIA':      'YASTIKA_BHATIA',
  'ANJALI_SRAVANI':      'ANJALI_SARVANI',
  'BHARTI_FULMALI':      'BHARTI_FULMALI',
  'G_KAMALINI':          'GUNALAN_KAMALINI',
  'UMA_CHETRY':          'UMA_CHETRY',
  'SAJEEVAN_SAJANA':     'SAJEEVAN_SAJANA',
};

function normalizeId(str) {
  return str.trim().toUpperCase().replace(/\s+/g, '_');
}

function numOrNull(v) {
  if (!v || v === '—' || v === '-' || v === '') return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function isYear(str) {
  return /^\d{4}$/.test(str.trim());
}

function parseCSV(filePath) {
  const text  = fs.readFileSync(filePath, 'utf8');
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());

  // Find header line
  let headerIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    const low = lines[i].toLowerCase();
    if (low.includes('playerid') || low.includes('playerid')) { headerIdx = i; break; }
    if (low.startsWith('playerid') || low.startsWith('harmanpreet')) { headerIdx = i; break; }
  }
  // Header is always line 0 for this CSV
  const headers = lines[0].split(',').map(h => h.trim());
  // headers: playerId, format, category, Mat, Inns, NO, Runs, HS, Avg, BF, SR, 100s, 50s, 0s, 4s, 6s, Overs, Mdns, Runs Conceded, Wkts, BBI...

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    const playerId = parts[0]?.trim();
    const format   = parts[1]?.trim();
    const category = parts[2]?.trim(); // either a year (2014) or "all" / "All"

    if (!playerId || !format) continue;
    if (playerId.toLowerCase() === 'playerid' || playerId.toLowerCase() === 'playerid') continue;

    let year, dataOffset;

    if (isYear(category)) {
      // Structure 1: playerId, format, YEAR, Mat, Inns...
      year       = category;
      dataOffset = 3; // Mat starts at index 3
    } else {
      // Structure 2: playerId, format, "all", YEAR, Mat, Inns...
      year       = parts[3]?.trim();
      dataOffset = 4; // Mat starts at index 4
    }

    if (!year || !isYear(year)) continue;

    const get = (offset) => parts[dataOffset + offset]?.trim() || '';

    results.push({
      playerId: normalizeId(playerId),
      format:   format.toLowerCase().replace('t20i', 't20i').replace('t20', 't20i').replace('odi', 'odi').replace('test', 'test'),
      year,
      runs:     numOrNull(get(3)),  // Runs
      wickets:  numOrNull(get(16)), // Wkts
      avg:      numOrNull(get(5)),  // Avg
      sr:       numOrNull(get(7)),  // SR
      hundreds: numOrNull(get(8)),  // 100s
      fifties:  numOrNull(get(9)),  // 50s
      matches:  numOrNull(get(0)),  // Mat
      economy:  numOrNull(get(20)), // Econ
      best:     get(17) || null,    // BBI
    });
  }
  return results;
}

async function main() {
  console.log('📖 Reading year-wise CSV...');
  const rows = parseCSV(CSV_PATH);
  console.log(`✅ ${rows.length} rows parsed`);

  // Build: normalizedCsvId → format → year → stats
  const yearMap = {};
  rows.forEach(r => {
    if (!yearMap[r.playerId]) yearMap[r.playerId] = {};
    if (!yearMap[r.playerId][r.format]) yearMap[r.playerId][r.format] = {};
    yearMap[r.playerId][r.format][r.year] = {
      matches:  r.matches,
      runs:     r.runs,
      avg:      r.avg,
      sr:       r.sr,
      hundreds: r.hundreds,
      fifties:  r.fifties,
      wickets:  r.wickets,
      economy:  r.economy,
      best:     r.best,
    };
  });

  // Sample check
  console.log('Sample — Smriti T20I years:', Object.keys(yearMap['SMRITI_MANDHANA']?.['t20i'] || {}).length);
  console.log('Sample — Harmanpreet ODI years:', Object.keys(yearMap['HARMANPREET_KAUR']?.['odi'] || {}).length);

  // Fetch Firebase
  console.log('\n🔥 Fetching Firebase...');
  const snapshot = await getDocs(collection(db, 'seniors'));
  const docs     = snapshot.docs.filter(d => /^S\d+$/i.test(d.id));

  let updated = 0, skipped = 0;

  for (const d of docs) {
    const data           = d.data();
    const normalizedName = normalizeId(data.name || '');
    const csvId          = NAME_TO_CSV[normalizedName];

    if (!csvId) { console.log(`⚠️  No mapping: ${data.name}`); skipped++; continue; }

    const csvIdNorm = normalizeId(csvId);
    const yearData  = yearMap[csvIdNorm];

    if (!yearData || Object.keys(yearData).length === 0) {
      console.log(`⚠️  No year data: ${data.name} (${csvIdNorm})`);
      skipped++;
      continue;
    }

    await updateDoc(doc(db, 'seniors', d.id), { year_wise: yearData });

    const totalYears = Object.values(yearData).reduce((acc, fmt) => acc + Object.keys(fmt).length, 0);
    const fmts       = Object.keys(yearData).join(', ');
    console.log(`✅ ${d.id} — ${data.name} [${fmts}] (${totalYears} year entries)`);
    updated++;
  }

  console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => { console.error('❌', err); process.exit(1); });
