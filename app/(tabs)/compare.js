import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Modal, FlatList, TextInput, Image,
  SafeAreaView, StatusBar, Platform, ActivityIndicator,
} from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { PLAYER_IMAGES } from '../../data/playerImages';

const firebaseConfig = {
  apiKey: "****************",
  authDomain: "strikher-2b7ae.firebaseapp.com",
  projectId: "strikher-2b7ae",
  storageBucket: "strikher-2b7ae.firebasestorage.app",
  messagingSenderId: "277261784387",
  appId: "1:277261784387:web:75d1fb4aec7c7ec4054bf6",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getFirestore(app);

const ROLE_COLORS = { BATTER: '#E8F5E9', BOWLER: '#E3F2FD', ALLROUNDER: '#FFF3E0', KEEPER: '#F3E5F5' };
const ROLE_ACCENT = { BATTER: '#2E7D32', BOWLER: '#1565C0', ALLROUNDER: '#E65100', KEEPER: '#6A1B9A' };

function normalizeRole(role) {
  if (!role) return 'BATTER';
  const r = role.toUpperCase();
  if (r.includes('KEEP') || r.includes('WICKET')) return 'KEEPER';
  if (r.includes('ALL') || r.includes('ROUND'))   return 'ALLROUNDER';
  if (r.includes('BOWL'))                          return 'BOWLER';
  return 'BATTER';
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function val(v) {
  if (v === null || v === undefined || v === '') return '—';
  return String(v);
}

// ── Animated Comparison Bar ───────────────────────────────────────────────────
function CompareBar({ val1, val2, color1, color2 }) {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  const n1 = parseFloat(val1) || 0;
  const n2 = parseFloat(val2) || 0;
  const max = Math.max(n1, n2, 1);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(anim1, { toValue: n1 / max, tension: 60, friction: 8, useNativeDriver: false }),
      Animated.spring(anim2, { toValue: n2 / max, tension: 60, friction: 8, useNativeDriver: false }),
    ]).start();
  }, [n1, n2]);

  return (
    <View style={barStyles.row}>
      <Animated.View style={[barStyles.bar, {
        backgroundColor: n1 >= n2 ? color1 : color1 + '55',
        width: anim1.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        alignSelf: 'flex-end',
      }]} />
      <Animated.View style={[barStyles.bar, {
        backgroundColor: n2 >= n1 ? color2 : color2 + '55',
        width: anim2.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
      }]} />
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, height: 8, marginTop: 4 },
  bar: { flex: 1, borderRadius: 4, height: '100%' },
});

// ── Stat Compare Row ──────────────────────────────────────────────────────────
function StatCompareRow({ label, val1, val2, color1, color2, higherIsBetter = true }) {
  const n1 = parseFloat(val1) || 0;
  const n2 = parseFloat(val2) || 0;
  const p1Wins = higherIsBetter ? n1 > n2 : (n1 > 0 && n1 < n2);
  const p2Wins = higherIsBetter ? n2 > n1 : (n2 > 0 && n2 < n1);

  return (
    <View style={styles.statRow}>
      <Text style={[styles.statVal, p1Wins && { color: color1, fontWeight: '800' }]}>
        {val(val1)}
      </Text>
      <View style={styles.statMid}>
        <Text style={styles.statLabel}>{label}</Text>
        <CompareBar val1={val1} val2={val2} color1={color1} color2={color2} />
      </View>
      <Text style={[styles.statVal, styles.statValRight, p2Wins && { color: color2, fontWeight: '800' }]}>
        {val(val2)}
      </Text>
    </View>
  );
}

// ── Player Picker Modal ───────────────────────────────────────────────────────
function PlayerPickerModal({ players, onSelect, onClose, excludeId }) {
  const [search, setSearch] = useState('');
  const filtered = players.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) &&
    p.docId !== excludeId
  );

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Player</Text>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeBtn}>
              <Text style={pickerStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={pickerStyles.search}
            placeholder="Search player..."
            placeholderTextColor="#AAA"
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.docId}
            renderItem={({ item }) => {
              const role    = normalizeRole(item.role);
              const accent  = ROLE_ACCENT[role];
              const bgColor = ROLE_COLORS[role];
              const imgKey  = item.name?.toLowerCase().replace(/\s/g, '_');
              const imgSrc  = PLAYER_IMAGES[imgKey];
              return (
                <TouchableOpacity
                  style={[pickerStyles.playerRow, { backgroundColor: bgColor }]}
                  onPress={() => { onSelect(item); onClose(); }}
                  activeOpacity={0.75}
                >
                  <View style={[pickerStyles.avatar, { backgroundColor: accent }]}>
                    {imgSrc
                      ? <Image source={imgSrc} style={pickerStyles.avatarImg} />
                      : <Text style={pickerStyles.avatarText}>{getInitials(item.name)}</Text>
                    }
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={pickerStyles.playerName}>{item.name}</Text>
                    <Text style={[pickerStyles.playerRole, { color: accent }]}>{role}</Text>
                  </View>
                  <View style={[pickerStyles.roleBadge, { backgroundColor: accent }]}>
                    <Text style={pickerStyles.roleBadgeText}>{role}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const pickerStyles = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: '#FFF', borderRadius: 24, maxHeight: '80%', paddingTop: 8 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  title:      { fontSize: 18, fontWeight: '800', color: '#111' },
  closeBtn:   { padding: 8 },
  closeText:  { fontSize: 18, color: '#888' },
  search:     { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, fontSize: 14, color: '#111' },
  playerRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 12 },
  avatar:     { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarImg:  { width: 44, height: 44 },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  playerName: { fontSize: 14, fontWeight: '700', color: '#111' },
  playerRole: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  roleBadge:  { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
});

// ── Main Comparison Screen ────────────────────────────────────────────────────
export default function CompareScreen() {
  const [players, setPlayers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [player1, setPlayer1]     = useState(null);
  const [player2, setPlayer2]     = useState(null);
  const [format, setFormat]       = useState('odi');
  const [statType, setStatType]   = useState('batting');
  const [picker, setPicker]       = useState(null); // 1 or 2

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'seniors'));
        const all  = snap.docs
          .filter(d => /^S\d+$/i.test(d.id))
          .map(d => ({ docId: d.id, ...d.data() }))
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setPlayers(all);
        setPlayer1(all[26]); // Smriti
        setPlayer2(all[3]);  // Deepti
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#C2185B" />
    </View>
  );

  const role1   = normalizeRole(player1?.role);
  const role2   = normalizeRole(player2?.role);
  const color1  = ROLE_ACCENT[role1] || '#C2185B';
  const color2  = ROLE_ACCENT[role2] || '#1565C0';
  const bg1     = ROLE_COLORS[role1] || '#F5F5F5';
  const bg2     = ROLE_COLORS[role2] || '#F5F5F5';

  const fmt1  = player1?.formats?.[format] || {};
  const fmt2  = player2?.formats?.[format] || {};

  const imgKey1 = player1?.name?.toLowerCase().replace(/\s/g, '_');
  const imgKey2 = player2?.name?.toLowerCase().replace(/\s/g, '_');

  // Verdict
  function getVerdict() {
    if (!player1 || !player2) return null;
    const runs1 = parseFloat(fmt1.runs) || 0;
    const runs2 = parseFloat(fmt2.runs) || 0;
    const avg1  = parseFloat(fmt1.bat_avg) || 0;
    const avg2  = parseFloat(fmt2.bat_avg) || 0;
    const wkts1 = parseFloat(fmt1.wickets) || 0;
    const wkts2 = parseFloat(fmt2.wickets) || 0;

    let score1 = 0, score2 = 0;
    if (runs1 > runs2) score1++; else score2++;
    if (avg1  > avg2)  score1++; else score2++;
    if (wkts1 > wkts2) score1++; else score2++;

    if (score1 > score2) return { winner: player1.name, loser: player2.name, color: color1 };
    if (score2 > score1) return { winner: player2.name, loser: player1.name, color: color2 };
    return { winner: null, color: '#888' };
  }

  const verdict = getVerdict();

  const FORMATS  = ['odi', 't20i', 'test'];
  const STATTYPES = ['batting', 'bowling'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C2185B" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compare Players ⚡</Text>
        <Text style={styles.headerSub}>Head-to-head stats</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Player selectors */}
        <View style={styles.playersRow}>
          {/* Player 1 */}
          <TouchableOpacity style={[styles.playerCard, { backgroundColor: bg1 }]} onPress={() => setPicker(1)} activeOpacity={0.8}>
            <View style={[styles.playerAvatar, { backgroundColor: color1 }]}>
              {PLAYER_IMAGES[imgKey1]
                ? <Image source={PLAYER_IMAGES[imgKey1]} style={styles.playerAvatarImg} />
                : <Text style={styles.playerAvatarText}>{getInitials(player1?.name)}</Text>
              }
            </View>
            <Text style={[styles.playerCardName, { color: color1 }]} numberOfLines={1}>
              {player1?.name || 'Select Player'}
            </Text>
            <Text style={styles.playerCardRole}>{role1}</Text>
            <View style={[styles.changeBtn, { borderColor: color1 }]}>
              <Text style={[styles.changeBtnText, { color: color1 }]}>Change ▼</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.vsBox}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Player 2 */}
          <TouchableOpacity style={[styles.playerCard, { backgroundColor: bg2 }]} onPress={() => setPicker(2)} activeOpacity={0.8}>
            <View style={[styles.playerAvatar, { backgroundColor: color2 }]}>
              {PLAYER_IMAGES[imgKey2]
                ? <Image source={PLAYER_IMAGES[imgKey2]} style={styles.playerAvatarImg} />
                : <Text style={styles.playerAvatarText}>{getInitials(player2?.name)}</Text>
              }
            </View>
            <Text style={[styles.playerCardName, { color: color2 }]} numberOfLines={1}>
              {player2?.name || 'Select Player'}
            </Text>
            <Text style={styles.playerCardRole}>{role2}</Text>
            <View style={[styles.changeBtn, { borderColor: color2 }]}>
              <Text style={[styles.changeBtnText, { color: color2 }]}>Change ▼</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Format toggle */}
        <View style={styles.toggleRow}>
          {FORMATS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFormat(f)}
              style={[styles.toggleBtn, format === f && { backgroundColor: '#C2185B' }]}
            >
              <Text style={[styles.toggleText, format === f && { color: '#FFF' }]}>
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stat type toggle */}
        <View style={styles.toggleRow}>
          {STATTYPES.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStatType(s)}
              style={[styles.toggleBtn, statType === s && { backgroundColor: '#C2185B' }]}
            >
              <Text style={[styles.toggleText, statType === s && { color: '#FFF' }]}>
                {s === 'batting' ? '🏏 Batting' : '🏐 Bowling'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats comparison */}
        <View style={styles.statsCard}>
          {/* Header row */}
          <View style={styles.statsHeaderRow}>
            <Text style={[styles.statsHeaderName, { color: color1 }]} numberOfLines={1}>
              {player1?.name?.split(' ')[0]}
            </Text>
            <Text style={styles.statsHeaderFormat}>{format.toUpperCase()}</Text>
            <Text style={[styles.statsHeaderName, { color: color2, textAlign: 'right' }]} numberOfLines={1}>
              {player2?.name?.split(' ')[0]}
            </Text>
          </View>

          <View style={styles.divider} />

          {statType === 'batting' ? (
            <>
              <StatCompareRow label="Matches"  val1={fmt1.matches}    val2={fmt2.matches}    color1={color1} color2={color2} />
              <StatCompareRow label="Runs"     val1={fmt1.runs}       val2={fmt2.runs}       color1={color1} color2={color2} />
              <StatCompareRow label="Average"  val1={fmt1.bat_avg}    val2={fmt2.bat_avg}    color1={color1} color2={color2} />
              <StatCompareRow label="SR"       val1={fmt1.sr}         val2={fmt2.sr}         color1={color1} color2={color2} />
              <StatCompareRow label="100s"     val1={fmt1.hundreds}   val2={fmt2.hundreds}   color1={color1} color2={color2} />
              <StatCompareRow label="50s"      val1={fmt1.fifties}    val2={fmt2.fifties}    color1={color1} color2={color2} />
              <StatCompareRow label="HS"       val1={fmt1.high_score} val2={fmt2.high_score} color1={color1} color2={color2} />
            </>
          ) : (
            <>
              <StatCompareRow label="Wickets"  val1={fmt1.wickets}      val2={fmt2.wickets}      color1={color1} color2={color2} />
              <StatCompareRow label="Best"     val1={fmt1.best_bowling} val2={fmt2.best_bowling} color1={color1} color2={color2} />
              <StatCompareRow label="Economy"  val1={fmt1.economy}      val2={fmt2.economy}      color1={color1} color2={color2} higherIsBetter={false} />
              <StatCompareRow label="Bowl Avg" val1={fmt1.bowl_avg}     val2={fmt2.bowl_avg}     color1={color1} color2={color2} higherIsBetter={false} />
            </>
          )}
        </View>

        {/* Verdict */}
        {verdict && (
          <View style={[styles.verdictCard, { borderColor: verdict.color + '44' }]}>
            {verdict.winner ? (
              <>
                <Text style={[styles.verdictWinner, { color: verdict.color }]}>
                  🏆 {verdict.winner}
                </Text>
                <Text style={styles.verdictSub}>leads in this format</Text>
              </>
            ) : (
              <>
                <Text style={[styles.verdictWinner, { color: '#888' }]}>⚡ Too Close to Call!</Text>
                <Text style={styles.verdictSub}>Both players are evenly matched</Text>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Player picker modal */}
      {picker !== null && (
        <PlayerPickerModal
          players={players}
          excludeId={picker === 1 ? player2?.docId : player1?.docId}
          onSelect={p => picker === 1 ? setPlayer1(p) : setPlayer2(p)}
          onClose={() => setPicker(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#C2185B', paddingHorizontal: 16, paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSub:   { fontSize: 12, color: '#FFFFFF99', marginTop: 2 },

  playersRow: { flexDirection: 'row', gap: 8, padding: 16, alignItems: 'center' },
  playerCard: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  playerAvatar:    { width: 64, height: 64, borderRadius: 32, overflow: 'hidden', marginBottom: 8, alignItems: 'center', justifyContent: 'center' },
  playerAvatarImg: { width: 64, height: 64 },
  playerAvatarText:{ color: '#FFF', fontSize: 22, fontWeight: '800' },
  playerCardName:  { fontSize: 13, fontWeight: '800', textAlign: 'center', marginBottom: 2 },
  playerCardRole:  { fontSize: 11, color: '#888', marginBottom: 8 },
  changeBtn:       { borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
  changeBtnText:   { fontSize: 11, fontWeight: '700' },

  vsBox:   { width: 36, alignItems: 'center' },
  vsText:  { fontSize: 16, fontWeight: '800', color: '#CCC' },

  toggleRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, gap: 8 },
  toggleBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F0F0F0', alignItems: 'center',
  },
  toggleText: { fontSize: 12, fontWeight: '700', color: '#555' },

  statsCard: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFF',
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statsHeaderRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statsHeaderName:  { flex: 1, fontSize: 15, fontWeight: '800' },
  statsHeaderFormat:{ fontSize: 13, fontWeight: '700', color: '#AAA', textAlign: 'center' },
  divider:          { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },

  statRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  statVal:      { width: 44, fontSize: 14, fontWeight: '600', color: '#666', textAlign: 'center' },
  statValRight: { textAlign: 'center' },
  statMid:      { flex: 1 },
  statLabel:    { fontSize: 11, color: '#AAA', fontWeight: '600', textAlign: 'center', textTransform: 'uppercase' },

  verdictCard: {
    marginHorizontal: 16, borderRadius: 16, borderWidth: 1.5,
    padding: 16, alignItems: 'center', backgroundColor: '#FFF',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  verdictWinner: { fontSize: 18, fontWeight: '800' },
  verdictSub:    { fontSize: 13, color: '#888', marginTop: 4 },
});
