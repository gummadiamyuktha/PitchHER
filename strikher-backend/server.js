const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = 'b06d6980-2e1a-4d4f-b9c6-73393ae6a2b6';
const PLAYER_CACHE = new Map();

const PLAYERS = [
  'smriti-mandhana', 'harmanpreet-kaur', 'deepti-sharma', 'jemimah-rodrigues',
  'shafali-verma', 'richa-ghosh', 'renuka-singh-thakur', 'sneh-rana',
  'pooja-vastrakar', 'meghna-singh', 'asha-sobhana', 'rajeshwari-gayakwad',
  'poonam-yadav', 'dayalan-hemalatha', 'priya-punia', 'sajeevan-sajana',
  'shreyanka-patil', 'saima-thakor', 'priya-mishra', 'saika-ishaque',
  'radha-yadav', 'yastika-bhatia', 'harleen-deol', 'arundhati-reddy',
  'amanjot-kaur', 'uma-chetry', 'kashvee-gautam', 'sree-charani',
  'g-kamalini', 'vaishnavi-sharma', 'tejal-hasabnis', 'alyssa-healy',
  'mithali-raj', 'jhulan-goswami', 'diana-edulji', 'shantha-rangaswamy',
  'neetu-david', 'shubhangi-kulkarni', 'anjum-chopra', 'sandhya-agarwal',
  'sudha-shah', 'shweta-sehrawat', 'gongadi-trisha', 'phoebe-litchfield'
];

let cacheReady = false;
let lastCacheTime = null;

async function fetchPlayerStats(playerName) {
  try {
    const response = await axios.get(
      `https://cricketdata.org/api/players_search?apikey=${API_KEY}&name=${encodeURIComponent(playerName)}`,
      { timeout: 5000 }
    );
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const playerId = response.data.data[0].pid;
      const statsResponse = await axios.get(
        `https://cricketdata.org/api/player_info?apikey=${API_KEY}&pid=${playerId}`,
        { timeout: 5000 }
      );
      
      if (statsResponse.data && statsResponse.data.data) {
        return statsResponse.data.data;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function preloadPlayers() {
  console.log(`🔄 Preloading ${PLAYERS.length} players...`);
  let successCount = 0;
  
  for (const player of PLAYERS) {
    try {
      const stats = await fetchPlayerStats(player);
      if (stats) {
        PLAYER_CACHE.set(player, stats);
        successCount++;
        console.log(`✅ ${player}`);
      }
    } catch (error) {
      console.log(`❌ ${player}`);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  cacheReady = true;
  lastCacheTime = new Date();
  console.log(`\n✅ SUCCESS: ${successCount}/${PLAYERS.length} players cached!`);
}

app.get('/api/player/:name/stats', (req, res) => {
  const playerName = req.params.name.toLowerCase().replace(/_/g, '-');
  const stats = PLAYER_CACHE.get(playerName);
  
  if (stats) {
    res.json({ 
      status: 'success',
      data: stats,
      cachedAt: lastCacheTime
    });
  } else {
    res.status(404).json({ 
      status: 'error',
      error: 'Player not found'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    playersCached: PLAYER_CACHE.size,
    cacheReady
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  preloadPlayers();
});