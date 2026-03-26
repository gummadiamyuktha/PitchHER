import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const usePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'seniors'));
        const playersData = [];
        
        querySnapshot.forEach((doc) => {
          playersData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setPlayers(playersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { players, loading, error };
};

export const usePlayerDetail = (playerId) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'seniors', playerId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPlayer({
            id: docSnap.id,
            ...docSnap.data()
          });
          setError(null);
        } else {
          setError('Player not found');
        }
      } catch (err) {
        console.error('Error fetching player:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  return { player, loading, error };
};
