// upload_shree_charani_complete.js
// Run: node upload_shree_charani_complete.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "****************************",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Bat Field (Coin Toss) ─────────────────────────────────────────────────────
const bat_field = {
  odi: {
    'Batting First': {
      matches: 15, runs: 11, bat_avg: 2.2, sr: null,
      wickets: 16, economy: 5.32, bowl_avg: 44.56, best_bowling: '3/41',
    },
    'Fielding First': {
      matches: 6, runs: 11, bat_avg: 11, sr: null,
      wickets: 11, economy: 4.83, bowl_avg: 28.9, best_bowling: '2/23',
    },
  },
  t20i: {
    'Batting First': {
      matches: 6, runs: null, bat_avg: null, sr: null,
      wickets: 11, economy: 7.84, bowl_avg: 16.72, best_bowling: '4/12',
    },
    'Fielding First': {
      matches: 7, runs: 0, bat_avg: 0, sr: 0,
      wickets: 9, economy: 7.4, bowl_avg: 19.88, best_bowling: '2/14',
    },
  },
};

// ── VS Teams ──────────────────────────────────────────────────────────────────
const vs_teams = {
  odi: {
    'AUS Women': {
      batting: { matches: 6, runs: 15, avg: 5, sr: 60, hs: '11', hundreds: 0, fifties: 0 },
      bowling: { matches: 6, wickets: 9, economy: 6.48, bowl_avg: 37, best: '3/41' },
    },
    'BAN Women': {
      batting: { matches: 1, runs: null, avg: null, sr: null, hs: null, hundreds: 0, fifties: 0 },
      bowling: { matches: 1, wickets: 2, economy: 3.83, bowl_avg: 11.5, best: '2/23' },
    },
    'ENG Women': {
      batting: { matches: 4, runs: null, avg: null, sr: null, hs: null, hundreds: 0, fifties: 0 },
      bowling: { matches: 4, wickets: 5, economy: 6.17, bowl_avg: 42, best: '2/68' },
    },
    'NZ Women': {
      batting: { matches: 1, runs: null, avg: null, sr: null, hs: null, hundreds: 0, fifties: 0 },
      bowling: { matches: 1, wickets: 1, economy: 6.44, bowl_avg: 58, best: '1/58' },
    },
    'PAK Women': {
      batting: { matches: 1, runs: 1, avg: 1, sr: 20, hs: '1', hundreds: 0, fifties: 0 },
      bowling: { matches: 1, wickets: 0, economy: 4.33, bowl_avg: null, best: '-' },
    },
  },
};

// ── Year Wise ─────────────────────────────────────────────────────────────────
const year_wise = {
  odi: {
    '2025': { runs: 9, wickets: 23, avg: 2.25, sr: 69.23, bowl_avg: 36.65, economy: 5.32 },
    '2026': { runs: 13, wickets: 4,  avg: 6.5,  sr: 61.9,  bowl_avg: 47,    economy: 8.11 },
  },
  t20i: {
    '2025': { runs: 0, wickets: 15, avg: 0, sr: 0, bowl_avg: 19.26, economy: 7.84 },
    '2026': { runs: 0, wickets: 5,  avg: 0, sr: 0, bowl_avg: 14.8,  economy: 7.4  },
  },
};

async function main() {
  console.log('🔥 Updating Shree Charani (S28) — bat_field, vs_teams, year_wise...');

  await updateDoc(doc(db, 'seniors', 'S28'), {
    bat_field,
    vs_teams,
    year_wise,
  });

  console.log('✅ Done! All three sections updated for Shree Charani.');
  process.exit(0);
}

main().catch(err => { console.error('❌', err); process.exit(1); });
