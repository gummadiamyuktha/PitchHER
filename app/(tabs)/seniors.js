import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { getApps, initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import PitchPalButton from '../../components/PitchPalButton';
import { PLAYER_IMAGES } from '../../data/playerImages';

const firebaseConfig = {
  apiKey: "AIzaSyBvNvCujd92uA7pCp88XB79vKMwOiZZ0Rc",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const { width: SW, height: SH } = Dimensions.get('window');

const PHONETIC_NAMES = {
  "Anjali Sarvani": "An-ja-li Sar-va-ni",
  "ANJALI SRAVANI": "An-ja-li Sar-va-ni",
  "Amanjot Kaur": "A-man-jot Kaur",
  "Smriti Mandhana": "Smri-ti Mand-ha-na",
  "Shafali Verma": "Sha-fa-li Ver-ma",
  "Harmanpreet Kaur": "Har-man-preet Kaur",
  "Jemimah Rodrigues": "Je-mi-ma Rod-ri-gez",
  "Richa Ghosh": "Ri-cha Ghosh",
  "Renuka Singh": "Re-nu-ka Singh",
  "Sneh Rana": "Sneh Ra-na",
  "Radha Yadav": "Ra-dha Ya-dav",
  "Yastika Bhatia": "Yas-ti-ka Bha-ti-a",
  "Pooja Vastrakar": "Poo-ja Vas-tra-kar",
  "Poonam Yadav": "Poo-nam Ya-dav",
  "Deepti Sharma": "Deep-ti Shar-ma",
  "Harleen Deol": "Har-leen De-ol",
  "Arundhati Reddy": "A-run-dha-ti Red-dy",
  "Saika Ishaque": "Sai-ka I-shaq",
  "Saima Thakor": "Sai-ma Tha-kor",
  "Shreyanka Patil": "Shre-yan-ka Pa-til",
  "Titas Sadhu": "Ti-tas Sa-dhu",
  "Vaishnavi Sharma": "Vai-sh-na-vi Shar-ma",
  "Uma Chetry": "U-ma Che-try",
  "Sajeevan Sajana": "Sa-jee-van Sa-ja-na",
  "Dayalan Hemalatha": "Da-ya-lan He-ma-la-tha",
  "Kashvee Gautam": "Kash-vee Gau-tam",
  "Kranti Gaud": "Kran-ti Gaud",
  "Meghna Singh": "Megh-na Singh",
  "Minnu Mani": "Min-nu Ma-ni",
  "Pratika Rawal": "Pra-ti-ka Ra-wal",
  "Priya Mishra": "Pri-ya Mish-ra",
  "Priya Punia": "Pri-ya Pu-ni-a",
  "Rajeshwari Gayakwad": "Ra-jesh-wa-ri Gay-ak-wad",
  "Sayali Satghare": "Sa-ya-li Sat-gha-re",
  "Shree Charani": "Shree Cha-ra-ni",
  "Tanuja Kanwar": "Ta-nu-ja Kan-war",
  "Tejal Hasabnis": "Te-jal Ha-sab-nis",
  "Bharti Fulmali": "Bhar-ti Ful-ma-li",
  "G Kamalini": "Ka-ma-li-ni",
};

const ROLE_COLORS = { BATTER: '#E8F5E9', BOWLER: '#E3F2FD', AR: '#FFF3E0', WK: '#F3E5F5' };
const ROLE_ACCENT = { BATTER: '#2E7D32', BOWLER: '#1565C0', AR: '#E65100', WK: '#6A1B9A' };
const ROLE_GRAD   = {
  BATTER: ['#2E7D32', '#66BB6A'],
  BOWLER: ['#1565C0', '#42A5F5'],
  AR:     ['#E65100', '#FFA726'],
  WK:     ['#6A1B9A', '#AB47BC'],
};

function normalizeRole(role) {
  if (!role) return 'BATTER';
  const r = role.toUpperCase();
  if (r.includes('KEEP') || r.includes('WICKET')) return 'WK';
  if (r.includes('ALL') || r.includes('ROUND'))   return 'AR';
  if (r.includes('BOWL'))                          return 'BOWLER';
  return 'BATTER';
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Auto-generate career highlights from stats
function generateHighlights(player) {
  const highlights = [];
  const odi  = player.formats?.odi;
  const t20  = player.formats?.t20i;
  const test = player.formats?.test;

  // Batting highlights
  if (odi?.runs > 1000)  highlights.push(`🏏 ${odi.runs} ODI runs`);
  if (t20?.runs > 500)   highlights.push(`⚡ ${t20.runs} T20I runs`);
  if (test?.runs > 200)  highlights.push(`📋 ${test.runs} Test runs`);
  if (odi?.hundreds > 0) highlights.push(`💯 ${odi.hundreds} ODI hundred${odi.hundreds > 1 ? 's' : ''}`);
  if (t20?.hundreds > 0) highlights.push(`💯 ${t20.hundreds} T20I hundred${t20.hundreds > 1 ? 's' : ''}`);

  // Bowling highlights
  if (odi?.wickets > 50)  highlights.push(`🎯 ${odi.wickets} ODI wickets`);
  if (t20?.wickets > 30)  highlights.push(`🎯 ${t20.wickets} T20I wickets`);
  if (test?.wickets > 10) highlights.push(`🎯 ${test.wickets} Test wickets`);

  // Special milestones
  if (odi?.matches > 100) highlights.push(`🌟 ${odi.matches} ODI caps`);
  if (t20?.matches > 100) highlights.push(`🌟 ${t20.matches} T20I caps`);
  if (odi?.bat_avg > 40)  highlights.push(`📈 Avg ${odi.bat_avg} in ODIs`);

  // Debut year from year_wise
  const allYears = [];
  if (player.year_wise) {
    Object.values(player.year_wise).forEach(fmt => {
      Object.keys(fmt).forEach(y => allYears.push(parseInt(y)));
    });
  }
  if (allYears.length > 0) {
    const debut = Math.min(...allYears);
    highlights.push(`📅 International debut: ${debut}`);
  }

  if (highlights.length === 0) highlights.push('🏏 Rising star for India Women');
  return highlights.slice(0, 4);
}

// ── Story Modal (Legends style) ───────────────────────────────────────────────
function StoryModal({ players, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const player  = players[idx];
  const role    = normalizeRole(player?.role);
  const accent  = ROLE_ACCENT[role] || '#C2185B';
  const imgKey  = player?.name?.toLowerCase().replace(/\s/g, '_');
  const imgSrc  = PLAYER_IMAGES[imgKey];
  const story   = player ? generateHighlights(player) : [];

  const goNext = () => { if (idx < players.length - 1) setIdx(idx + 1); else onClose(); };
  const goPrev = () => { if (idx > 0) setIdx(idx - 1); };

  if (!player) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000000EE' }}>

        {/* Progress bars */}
        <View style={{ flexDirection: 'row', paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 52, paddingHorizontal: 12, gap: 4, marginBottom: 12 }}>
          {players.map((_, i) => (
            <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < idx ? '#FFF' : i === idx ? accent : '#FFFFFF44' }} />
          ))}
        </View>

        {/* Close */}
        <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 52, right: 16, zIndex: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '700' }}>✕</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
          {/* Player image + name */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: accent, overflow: 'hidden', marginBottom: 10 }}>
              {imgSrc
                ? <Image source={imgSrc} style={{ width: 90, height: 90 }} />
                : <View style={{ flex: 1, backgroundColor: accent + '33', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: accent }}>{getInitials(player.name)}</Text>
                  </View>
              }
            </View>
            <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800' }}>{player.name}</Text>
            <View style={{ backgroundColor: accent, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginTop: 6 }}>
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>{role}</Text>
            </View>
          </View>

          {/* Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
            {player.home_city && <Text style={{ color: '#FFFFFF88', fontSize: 13 }}>📍 {player.home_city}</Text>}
            {player.dob && <Text style={{ color: '#FFFFFF88', fontSize: 13 }}>🎂 {player.dob}</Text>}
          </View>

          {/* Career Highlights */}
          <View style={{ backgroundColor: '#FFFFFF15', borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <Text style={{ color: accent, fontSize: 13, fontWeight: '800', marginBottom: 8, letterSpacing: 1 }}>⭐ CAREER HIGHLIGHTS</Text>
            {story.map((h, i) => (
              <Text key={i} style={{ color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 6 }}>{h}</Text>
            ))}
          </View>

          {/* Teams */}
          {(player.current_team || player.current_teams) && (
            <Text style={{ color: '#FFFFFF66', fontSize: 12, textAlign: 'center' }}>
              🏏 {player.current_team || player.current_teams}
            </Text>
          )}
        </ScrollView>

        {/* Tap zones */}
        <View style={{ position: 'absolute', top: 80, bottom: 100, left: 0, right: 0, flexDirection: 'row' }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={goPrev} activeOpacity={1} />
          <TouchableOpacity style={{ flex: 1 }} onPress={goNext} activeOpacity={1} />
        </View>


      </View>
    </Modal>
  );
}

// ── Story Circle ──────────────────────────────────────────────────────────────
function StoryCircle({ player, onPress }) {
  const role   = normalizeRole(player.role);
  const accent = ROLE_ACCENT[role];
  const name   = player.name || player.docId;
  const short  = name.split(' ')[0];

  return (
    <TouchableOpacity style={storyStyles.circle} onPress={onPress} activeOpacity={0.8}>
      <View style={[storyStyles.circleRing, { borderColor: accent }]}>
        <View style={[storyStyles.circleInner, { backgroundColor: accent + '22' }]}>
          {PLAYER_IMAGES[player.name?.toLowerCase().replace(/\s/g, '_')] ? (
            <Image source={PLAYER_IMAGES[player.name?.toLowerCase().replace(/\s/g, '_')]} style={storyStyles.circleImage} />
          ) : (
            <Text style={[storyStyles.circleInitials, { color: accent }]}>
              {getInitials(name)}
            </Text>
          )}
        </View>
      </View>
      <Text style={storyStyles.circleName} numberOfLines={1}>{short}</Text>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SeniorsScreen() {

  const [players, setPlayers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [storyIdx, setStoryIdx]     = useState(null);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [favs, setFavs] = useState([]);
  const router = useRouter();

  // Load favs from storage
  useEffect(() => {
    AsyncStorage.getItem('herpitch_favs').then(val => {
      if (val) setFavs(JSON.parse(val));
    });
  }, []);

  function toggleFav(docId) {
    setFavs(prev => {
      const next = prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId];
      AsyncStorage.setItem('herpitch_favs', JSON.stringify(next));
      return next;
    });
  }

  // Reset modal when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => setStoryIdx(null);
    }, [])
  );

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const snapshot = await getDocs(collection(db, 'seniors'));
        const all = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
        const seen = new Map();
        all.forEach(p => {
          if (/^S\d+$/i.test(p.docId))
            seen.set((p.name || p.docId).toLowerCase().trim(), p);
        });
        all.forEach(p => {
          if (!/^S\d+$/i.test(p.docId)) {
            const key = (p.name || p.docId).toLowerCase().trim();
            if (!seen.has(key)) seen.set(key, p);
          }
        });
        setPlayers(
          Array.from(seen.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        );
      } catch (err) {
        setError('Could not load players.');
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  const filtered = players.filter(p => {
    const matchSearch = search.trim() === '' ? true :
      (p.name || '').toLowerCase().includes(search.toLowerCase());
    const role = normalizeRole(p.role);
    const matchRole = selectedRole === 'ALL' || role === selectedRole;
    return matchSearch && matchRole;
  });

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C2185B" />
        <Text style={styles.loadingText}>Loading players...</Text>
      </View>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    </SafeAreaView>
  );

  const renderPlayer = ({ item }) => {
    const role        = normalizeRole(item.role);
    const bgColor     = ROLE_COLORS[role] || '#F5F5F5';
    const accentColor = ROLE_ACCENT[role] || '#333';
    const odiMatches  = item.formats?.odi?.matches  ?? '—';
    const t20Matches  = item.formats?.t20i?.matches ?? '—';
    const testMatches = item.formats?.test?.matches ?? '—';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bgColor }]}
        onPress={() => {
          Keyboard.dismiss();
          Speech.stop();
          Speech.speak(`Let's dive into my stats!`, { language: 'en-IN', rate: 0.85, pitch: 1.1 });
          router.push({ pathname: '/playerDetail', params: { player: JSON.stringify(item) } });
        }}
        activeOpacity={0.75}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.playerName} numberOfLines={1}>{item.name || item.docId}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              onPress={e => { e.stopPropagation(); toggleFav(item.docId); }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Text style={{ fontSize: 16 }}>{favs.includes(item.docId) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <View style={[styles.roleBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#333' }]}>{odiMatches}</Text>
            <Text style={[styles.statLabel, { color: '#888' }]}>ODI</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: '#E0E0E0' }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#333' }]}>{t20Matches}</Text>
            <Text style={[styles.statLabel, { color: '#888' }]}>T20I</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: '#E0E0E0' }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, testMatches !== '—' && { color: accentColor }]}>
              {testMatches}
            </Text>
            <Text style={[styles.statLabel, { color: '#888' }]}>Test</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <Text style={styles.header}>They Own the Pitch 🔥</Text>

      {/* Favourites */}
      {favs.length > 0 && (
        <View style={{ marginTop: 8, marginBottom: 4 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#C2185B', paddingHorizontal: 16, marginBottom: 6, letterSpacing: 0.5 }}>❤️ FAVOURITES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, flexDirection: 'row' }}>
            {players.filter(p => favs.includes(p.docId)).map(p => {
              const role2   = normalizeRole(p.role);
              const accent2 = ROLE_ACCENT[role2];
              const imgKey2 = p.name?.toLowerCase().replace(/\s/g, '_');
              return (
                <TouchableOpacity
                  key={p.docId}
                  onPress={() => router.push({ pathname: '/playerDetail', params: { player: JSON.stringify(p) } })}
                  style={{ alignItems: 'center', width: 64 }}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2.5, borderColor: accent2, overflow: 'hidden', marginBottom: 4 }}>
                    {PLAYER_IMAGES[imgKey2]
                      ? <Image source={PLAYER_IMAGES[imgKey2]} style={{ width: 52, height: 52 }} />
                      : <View style={{ flex: 1, backgroundColor: accent2 + '33', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: accent2, fontWeight: '800', fontSize: 14 }}>{p.name?.split(' ').map(w => w[0]).join('').slice(0,2)}</Text>
                        </View>
                    }
                  </View>
                  <Text style={{ fontSize: 10, color: '#444', fontWeight: '600', textAlign: 'center' }} numberOfLines={1}>{p.name?.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Story circles */}
      {players.length > 0 && (
        <View style={{ height: 100, backgroundColor: '#FAFAFA', marginBottom: 4 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesRow}
            style={{ flex: 1 }}
          >
            {players.map((p, i) => (
              <StoryCircle key={p.docId} player={p} onPress={() => {
                Speech.stop();
                Speech.speak(`Hi! Let's dive into my stats!`, { language: 'en-IN', rate: 0.85, pitch: 1.1 });
                setTimeout(() => setStoryIdx(i), 100);
              }} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: '#333' }]}
          placeholder="Search players..."
          placeholderTextColor="#BBB"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Role Filter */}
      <View style={{ height: 42, marginBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, flexDirection: 'row', alignItems: 'center' }}
          style={{ flex: 1 }}
        >
          {[
            { key: 'ALL',    label: 'ALL' },
            { key: 'BATTER', label: 'BATTER' },
            { key: 'BOWLER', label: 'BOWLER' },
            { key: 'AR',     label: 'ALL-ROUNDER' },
            { key: 'WK',     label: 'KEEPER' },
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedRole(key)}
              style={{
                backgroundColor: selectedRole === key ? '#F7B801' : '#F0F0F0',
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              }}
            >
              <Text style={{ color: '#111', fontWeight: '700', fontSize: 12 }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Player list */}
      {filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 40 }}>🏏</Text>
          <Text style={styles.emptyText}>No players found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.docId}
          renderItem={renderPlayer}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Story modal */}
      {storyIdx !== null && (
        <StoryModal
          players={players}
          startIdx={storyIdx}
          onClose={() => setStoryIdx(null)}
        />
      )}

      <PitchPalButton />
    </SafeAreaView>
  );
}

// ── Story Styles ──────────────────────────────────────────────────────────────
const storyStyles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0A0A0A' },
  progressContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44 },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingTop: 8 },
  progressTrack: { flex: 1, height: 3, backgroundColor: '#FFFFFF33', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 2 },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, backgroundColor: '#1A1A1A',
  },
  avatarText:   { fontSize: 36, fontWeight: '800' },
  playerName:   { fontSize: 28, fontWeight: '800', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  rolePill:     { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5, marginBottom: 16 },
  rolePillText: { color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  infoRow:      { flexDirection: 'row', gap: 16, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' },
  infoText:     { color: '#FFFFFF88', fontSize: 13 },

  highlightsBox: {
    backgroundColor: '#FFFFFF11', borderRadius: 16,
    padding: 16, width: '100%', marginBottom: 16, gap: 8,
  },
  highlightsTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  highlight:       { color: '#FFF', fontSize: 15, fontWeight: '600' },
  teams:           { color: '#FFFFFF66', fontSize: 12, textAlign: 'center' },

  touchRow:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  touchLeft:   { flex: 1 },
  touchRight:  { flex: 1 },
  closeBtn:    { position: 'absolute', top: 56, right: 16, zIndex: 20, padding: 8 },
  closeText:   { color: '#FFF', fontSize: 18, fontWeight: '700' },

  // Story circles
  circle:        { alignItems: 'center', width: 70, marginRight: 4 },
  circleRing: {
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 2.5, padding: 2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  circleInner: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  circleInitials: { fontSize: 18, fontWeight: '800' },
  circleImage: { width: 48, height: 48, borderRadius: 24 },
  circleName:     { fontSize: 10, color: '#444', fontWeight: '600', textAlign: 'center', width: 64, marginTop: 2 },
});

// ── Main Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:  { marginTop: 12, color: '#888', fontSize: 14 },
  errorText:    { color: '#C62828', fontSize: 14 },
  emptyText:    { fontSize: 16, color: '#AAA', marginTop: 8 },

  header: {
    fontSize: 20, fontWeight: '800', color: '#C2185B',
    textAlign: 'center', paddingVertical: 10,
  },

  storiesScroll: { marginTop: 4, marginBottom: 12 },
  storiesRow:    { paddingHorizontal: 12, paddingVertical: 6, alignItems: 'flex-start' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10, marginTop: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    borderWidth: 0,
    paddingHorizontal: 14,
  },
  searchIcon:   { fontSize: 14, marginRight: 8, color: '#AAA' },
  searchInput:  { flex: 1, fontSize: 14, paddingVertical: 11 },
  clearText:    { fontSize: 13, color: '#AAA', fontWeight: '700', paddingLeft: 8 },

  list:        { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    borderRadius: 12, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  playerName:  { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  roleBadge:   { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  roleText:    { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  statsRow:    { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBox:     { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: '#E0E0E0' },
  statValue:   { fontSize: 18, fontWeight: '700' },
  statLabel:   { fontSize: 11, marginTop: 2 },
});