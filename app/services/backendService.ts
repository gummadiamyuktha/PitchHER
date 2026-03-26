// Backend API Service
const BACKEND_URL = 'http://192.168.1.164:3001'; // Change IP to your computer IP

export interface PlayerStats {
  odi?: {
    matches: number;
    runs: number;
    avg: number;
    sr: number;
    wickets?: number;
    econ?: number;
    centuries?: number;
    halfCenturies?: number;
  };
  t20i?: {
    matches: number;
    runs: number;
    avg: number;
    sr: number;
    wickets?: number;
    econ?: number;
  };
  test?: {
    matches: number;
    runs: number;
    avg: number;
    wickets?: number;
    centuries?: number;
    halfCenturies?: number;
  };
}

const parseStats = (playerData: any): PlayerStats => {
  const stats: PlayerStats = {
    odi: { matches: 0, runs: 0, avg: 0, sr: 0 },
    t20i: { matches: 0, runs: 0, avg: 0, sr: 0 },
    test: { matches: 0, runs: 0, avg: 0 },
  };

  try {
    // Parse ODI stats
    if (playerData.ODI) {
      const odiData = playerData.ODI;
      stats.odi = {
        matches: parseInt(odiData.Matches) || 0,
        runs: parseInt(odiData.Runs) || 0,
        avg: parseFloat(odiData.Avg) || 0,
        sr: parseFloat(odiData.SR) || 0,
        centuries: parseInt(odiData.Centuries) || 0,
        halfCenturies: parseInt(odiData.HalfCenturies) || 0,
        wickets: parseInt(odiData.Wickets) || 0,
        econ: parseFloat(odiData.Econ) || 0,
      };
    }

    // Parse T20I stats
    if (playerData.T20I) {
      const t20iData = playerData.T20I;
      stats.t20i = {
        matches: parseInt(t20iData.Matches) || 0,
        runs: parseInt(t20iData.Runs) || 0,
        avg: parseFloat(t20iData.Avg) || 0,
        sr: parseFloat(t20iData.SR) || 0,
        wickets: parseInt(t20iData.Wickets) || 0,
        econ: parseFloat(t20iData.Econ) || 0,
      };
    }

    // Parse Test stats
    if (playerData.Test) {
      const testData = playerData.Test;
      stats.test = {
        matches: parseInt(testData.Matches) || 0,
        runs: parseInt(testData.Runs) || 0,
        avg: parseFloat(testData.Avg) || 0,
        centuries: parseInt(testData.Centuries) || 0,
        halfCenturies: parseInt(testData.HalfCenturies) || 0,
        wickets: parseInt(testData.Wickets) || 0,
      };
    }
  } catch (error) {
    console.error('Error parsing stats:', error);
  }

  return stats;
};

const getDefaultStats = (): PlayerStats => {
  return {
    odi: { matches: 0, runs: 0, avg: 0, sr: 0 },
    t20i: { matches: 0, runs: 0, avg: 0, sr: 0 },
    test: { matches: 0, runs: 0, avg: 0 },
  };
};

export const getPlayerStats = async (playerName: string): Promise<PlayerStats> => {
  try {
    console.log(`Fetching stats for: ${playerName}`);
    
    // Convert player name to backend format (e.g., "Smriti Mandhana" -> "smriti-mandhana")
    const formattedName = playerName
      .toLowerCase()
      .split(' ')
      .join('-');
    
    const response = await fetch(
      `${BACKEND_URL}/api/player/${formattedName}/stats`
    );
    
    const data = await response.json() as any;
    console.log('Backend response:', data);
    
    if (data.status === 'success' && data.data) {
      return parseStats(data.data);
    } else {
      console.log('Player not found in backend cache');
      return getDefaultStats();
    }
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return getDefaultStats();
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    console.log('Backend health:', data);
    return data;
  } catch (error) {
    console.error('Backend is not responding:', error);
    return { status: 'error', message: 'Backend not available' };
  }
};