// add_shree_charani.js
// Run: node add_shree_charani.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function main() {
  const player = {
    id: "S28",
    name: "Shree Charani",
    role: "Bowler",
    dob: "04-Aug-2004",
    current_team: "India, Delhi Capitals, Andhra",
    batting_style: "Left-Hand Bat",
    bowling_style: "Slow Left-Arm Orthodox",
    home_city: "Kadapa",
    formats: {
      odi: {
        matches: 21, bat_innings: 8, not_outs: 2, runs: 22,
        high_score: "11", bat_avg: 3.7, balls_faced: 34, sr: 64.7,
        hundreds: 0, fifties: 0, fours: 0, sixes: 2,
        bowl_innings: 21, balls_bowled: 1088, maidens: 3,
        runs_given: 1031, wickets: 27, best_bowling: "3/41",
        economy: 5.69, bowl_avg: 38.2, bowl_sr: 40.3,
        four_wkt: 0, five_wkt: 0, catches: 4, run_outs: 0, stumpings: 0,
      },
      t20i: {
        matches: 13, bat_innings: 1, not_outs: 0, runs: 0,
        high_score: "0", bat_avg: 0, balls_faced: 1, sr: 0,
        hundreds: 0, fifties: 0, fours: 0, sixes: 0,
        bowl_innings: 12, balls_bowled: 281, maidens: 0,
        runs_given: 363, wickets: 20, best_bowling: "4/12",
        economy: 7.75, bowl_avg: 18.1, bowl_sr: 14.1,
        four_wkt: 1, five_wkt: 0, catches: 5, run_outs: 4, stumpings: 0,
      },
    },
    insights: {},
  };

  await setDoc(doc(db, 'seniors', 'S28'), player);
  console.log('✅ Shree Charani added as S28!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
