import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions, Image, ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { PLAYER_IMAGES } from "../data/playerImages";
import PLAYER_STORIES from './playerStories';

const firebaseConfig = {
  apiKey: "AIzaSyBvNvCujd92uA7pCp88XB79vKMwOiZZ0Rc",
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
const SCREEN_W    = Dimensions.get('window').width;
const GRAPH_W     = SCREEN_W - 48;
const GRAPH_H     = 160;
const PAD_LEFT    = 36;
const PAD_RIGHT   = 12;
const PAD_TOP     = 16;
const PAD_BOT     = 28;

function normalizeRole(role) {
  if (!role) return 'BATTER';
  const r = role.toUpperCase();
  if (r.includes('KEEP') || r.includes('WICKET')) return 'KEEPER';
  if (r.includes('ALL') || r.includes('ROUND'))   return 'ALLROUNDER';
  if (r.includes('BOWL'))                          return 'BOWLER';
  return 'BATTER';
}

function val(v) {
  if (v === null || v === undefined || v === '') return '—';
  return String(v);
}

// ── Animated Sliding Pill Toggle ─────────────────────────────────────────────
function SlidingToggle({ options, selected, onSelect, accent }) {
  const animVal = useRef(new Animated.Value(options.indexOf(selected) >= 0 ? options.indexOf(selected) : 0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const pillWidth = containerWidth / options.length;

  function handleSelect(opt, idx) {
    Animated.spring(animVal, { toValue: idx, useNativeDriver: true, tension: 120, friction: 8 }).start();
    onSelect(opt);
  }

  if (options.length < 2) return (
    <View style={[pillStyles.container, { backgroundColor: accent + '20' }]}>
      <View style={[pillStyles.pill, { width: '96%', backgroundColor: accent, position: 'relative', marginHorizontal: 2 }]} />
      <View style={[pillStyles.optionBtn, { position: 'absolute', width: '100%' }]}>
        <Text style={pillStyles.optionTextActive}>{options[0]}</Text>
      </View>
    </View>
  );

  return (
    <View style={[pillStyles.container, { backgroundColor: accent + '20' }]}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 && (
        <Animated.View style={[pillStyles.pill, {
          width: pillWidth - 4, backgroundColor: accent,
          transform: [{ translateX: animVal.interpolate({
            inputRange: options.map((_, i) => i),
            outputRange: options.map((_, i) => i * pillWidth + 2),
          }) }],
        }]} />
      )}
      {options.map((opt, idx) => (
        <TouchableOpacity key={opt} style={pillStyles.optionBtn} onPress={() => handleSelect(opt, idx)} activeOpacity={0.7}>
          <Text style={[pillStyles.optionText, selected === opt && pillStyles.optionTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Line Graph ────────────────────────────────────────────────────────────────
function LineGraph({ data, color }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!data || data.length === 0) return (
    <View style={graphStyles.empty}><Text style={graphStyles.emptyText}>No data available</Text></View>
  );

  const isSingle    = data.length === 1;
  const displayData = isSingle ? [data[0], data[0]] : data;
  const values = displayData.map(d => d.value);
  const maxV   = Math.max(...values);
  const minV   = Math.min(...values);
  const range  = maxV - minV || maxV || 1;
  const plotW  = GRAPH_W - PAD_LEFT - PAD_RIGHT;
  const plotH  = GRAPH_H - PAD_TOP - PAD_BOT;
  const toX = i => PAD_LEFT + (i / (displayData.length - 1)) * plotW;
  const toY = v => PAD_TOP + plotH - ((v - minV) / range) * plotH * 0.8 - plotH * 0.1;
  const linePath = displayData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d.value).toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L${toX(displayData.length - 1).toFixed(1)},${PAD_TOP + plotH} L${toX(0).toFixed(1)},${PAD_TOP + plotH} Z`;
  const yLabels  = [minV, Math.round((minV + maxV) / 2), maxV];

  function handleTouch(evt) {
    const touchX = evt.nativeEvent.locationX;
    let closest = 0, minDist = Infinity;
    data.forEach((d, i) => {
      const x = PAD_LEFT + (i / (isSingle ? 1 : data.length - 1)) * plotW;
      const dist = Math.abs(touchX - x);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIdx(closest);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  }

  const activePoint = activeIdx !== null ? data[activeIdx] : null;

  return (
    <View>
      <View style={graphStyles.tooltip}>
        {activePoint
          ? <><Text style={[graphStyles.tooltipValue, { color }]}>{activePoint.value}</Text><Text style={graphStyles.tooltipYear}>{activePoint.year}</Text></>
          : <Text style={graphStyles.tooltipHint}>Touch graph to see values</Text>}
      </View>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Svg width={GRAPH_W} height={GRAPH_H} onPress={handleTouch} onResponderMove={handleTouch}
          onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.35" />
              <Stop offset="1" stopColor={color} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          {yLabels.map((v, i) => {
            const y = toY(v);
            return (
              <React.Fragment key={i}>
                <Line x1={PAD_LEFT} y1={y} x2={GRAPH_W - PAD_RIGHT} y2={y} stroke="#E0E0E0" strokeWidth="1" strokeDasharray="4,4" />
                <SvgText x={PAD_LEFT - 4} y={y + 4} fontSize="9" fill="#AAA" textAnchor="end">{v}</SvgText>
              </React.Fragment>
            );
          })}
          <Path d={fillPath} fill="url(#grad)" />
          <Path d={linePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => {
            const x = PAD_LEFT + (i / (isSingle ? 1 : data.length - 1)) * plotW;
            const y = toY(d.value);
            const isActive  = activeIdx === i;
            const showLabel = data.length <= 8 || i % Math.ceil(data.length / 8) === 0 || i === data.length - 1;
            return (
              <React.Fragment key={i}>
                {isActive && (<>
                  <Line x1={x} y1={PAD_TOP} x2={x} y2={PAD_TOP + plotH} stroke={color} strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.5" />
                  <Circle cx={x} cy={y} r="10" fill={color} fillOpacity="0.15" />
                </>)}
                <Circle cx={x} cy={y} r={isActive ? 5 : 3.5} fill={color} />
                <Circle cx={x} cy={y} r={isActive ? 8 : 6} fill={color} fillOpacity={isActive ? 0.25 : 0.1} />
                {showLabel && <SvgText x={x} y={GRAPH_H - 6} fontSize="9" fill={isActive ? color : '#888'} fontWeight={isActive ? 'bold' : 'normal'} textAnchor="middle">{d.year}</SvgText>}
              </React.Fragment>
            );
          })}
        </Svg>
      </Animated.View>
    </View>
  );
}

// ── Stat Cell ─────────────────────────────────────────────────────────────────
function StatCell({ label, value, accent }) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statCellValue, accent && { color: accent }]}>{val(value)}</Text>
      <Text style={styles.statCellLabel}>{label}</Text>
    </View>
  );
}

// ── Stats Block ───────────────────────────────────────────────────────────────
function StatsBlock({ title, stats, accent }) {
  if (!stats) return null;
  const isBatting = title === 'Batting';
  return (
    <View style={styles.statsBlock}>
      <Text style={[styles.statsBlockTitle, { color: accent }]}>{isBatting ? '🏏 Batting' : '🏐 Bowling'}</Text>
      <View style={styles.statGrid}>
        {isBatting ? (
          <>
            <StatCell label="Innings" value={stats.bat_innings} />
            <StatCell label="Runs"    value={stats.runs}        accent={accent} />
            <StatCell label="HS"      value={stats.high_score}  />
            <StatCell label="Average" value={stats.bat_avg}     />
            <StatCell label="SR"      value={stats.sr}          />
            <StatCell label="100s"    value={stats.hundreds}    />
            <StatCell label="50s"     value={stats.fifties}     />
            <StatCell label="4s"      value={stats.fours}       />
            <StatCell label="6s"      value={stats.sixes}       />
          </>
        ) : (
          <>
            <StatCell label="Innings" value={stats.bowl_innings}  />
            <StatCell label="Wickets" value={stats.wickets}       accent={accent} />
            <StatCell label="Best"    value={stats.best_bowling}  />
            <StatCell label="Economy" value={stats.economy}       />
            <StatCell label="Average" value={stats.bowl_avg}      />
            <StatCell label="SR"      value={stats.bowl_sr}       />
            <StatCell label="4W"      value={stats.four_wkt}      />
            <StatCell label="5W"      value={stats.five_wkt}      />
            <StatCell label="Catches" value={stats.catches}       />
          </>
        )}
      </View>
    </View>
  );
}

// ── Format Section ────────────────────────────────────────────────────────────
function FormatSection({ format, stats, accent }) {
  if (!stats) return null;
  const hasBowling = stats.wickets !== null && stats.wickets !== undefined;
  const hasBatting = stats.runs    !== null && stats.runs    !== undefined;
  return (
    <View style={[styles.formatSection, { borderLeftColor: accent }]}>
      <View style={styles.formatHeader}>
        <Text style={[styles.formatTitle, { color: accent }]}>{format}</Text>
        <View style={[styles.matchesBadge, { backgroundColor: accent }]}>
          <Text style={styles.matchesBadgeText}>{val(stats.matches)} matches</Text>
        </View>
      </View>
      {hasBatting && <StatsBlock title="Batting" stats={stats} accent={accent} />}
      {hasBowling && <StatsBlock title="Bowling" stats={stats} accent={accent} />}
    </View>
  );
}

// ── Bio / Player Story ────────────────────────────────────────────────────────
function generateMilestones(player) {
  const odi  = player.formats?.odi;
  const t20  = player.formats?.t20i;
  const test = player.formats?.test;
  const m = [];
  if (odi?.matches >= 100)  m.push({ icon: '🌟', text: `${odi.matches} ODI Caps` });
  if (t20?.matches >= 100)  m.push({ icon: '⚡', text: `${t20.matches} T20I Caps` });
  if (odi?.runs >= 1000)    m.push({ icon: '🏏', text: `${odi.runs}+ ODI Runs` });
  if (odi?.wickets >= 100)  m.push({ icon: '🎯', text: `${odi.wickets}+ ODI Wickets` });
  if (t20?.wickets >= 50)   m.push({ icon: '🔥', text: `${t20.wickets}+ T20I Wickets` });
  if (odi?.hundreds >= 5)   m.push({ icon: '💯', text: `${odi.hundreds} ODI 100s` });
  if (test?.matches > 0)    m.push({ icon: '📋', text: 'Test Cricketer' });
  if (odi?.bat_avg > 40)    m.push({ icon: '📈', text: `ODI Avg ${odi.bat_avg}` });
  return m.slice(0, 4);
}

function BioSection({ player, accent }) {
  const story      = player.legendStory || PLAYER_STORIES[player.name];
  const milestones = generateMilestones(player);
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={bioStyles.container}>
      <Text style={styles.sectionHeader}>📖 Player Story</Text>
      {story ? (
        <View style={[bioStyles.storyCard, { borderLeftColor: accent }]}>
          <Text style={bioStyles.storyText} numberOfLines={expanded ? undefined : 6}>{story}</Text>
          <TouchableOpacity onPress={() => setExpanded(e => !e)} style={bioStyles.readMoreBtn}>
            <Text style={[bioStyles.readMoreText, { color: accent }]}>{expanded ? 'Show less ▲' : 'Read full story ▼'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[bioStyles.storyCard, { borderLeftColor: '#DDD' }]}>
          <Text style={bioStyles.comingSoon}>✍️ Story coming soon...</Text>
        </View>
      )}
      {milestones.length > 0 && (
        <View style={bioStyles.milestonesRow}>
          {milestones.map((m, i) => (
            <View key={i} style={[bioStyles.milestoneBadge, { borderColor: accent + '44' }]}>
              <Text style={bioStyles.milestoneIcon}>{m.icon}</Text>
              <Text style={[bioStyles.milestoneText, { color: accent }]}>{m.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const bioStyles = StyleSheet.create({
  container:      { marginHorizontal: 16, marginBottom: 16 },
  storyCard:      { backgroundColor: '#FFF', borderRadius: 12, borderLeftWidth: 4, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  storyText:      { fontSize: 14, color: '#444', lineHeight: 24 },
  readMoreBtn:    { marginTop: 10, alignSelf: 'flex-start' },
  readMoreText:   { fontSize: 13, fontWeight: '700' },
  comingSoon:     { fontSize: 14, color: '#AAA', fontStyle: 'italic' },
  milestonesRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  milestoneBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FFF' },
  milestoneIcon:  { fontSize: 14 },
  milestoneText:  { fontSize: 12, fontWeight: '700' },
});

// ── Year Wise Graph ───────────────────────────────────────────────────────────
function YearWiseSection({ yearWise, accent }) {
  const [activeFormat, setActiveFormat] = useState(null);
  const [activeMetric, setActiveMetric] = useState('🏏 Runs');
  if (!yearWise) return null;
  const formats = Object.keys(yearWise).sort().map(f => f.toUpperCase());
  if (formats.length === 0) return null;
  const currentFormat = activeFormat || formats[0];
  const formatData    = yearWise[currentFormat.toLowerCase()] || {};
  const years         = Object.keys(formatData).sort();
  const metricKey     = activeMetric === '🏏 Runs' ? 'runs' : 'wickets';
  const graphData     = years.map(year => ({ year, value: formatData[year]?.[metricKey] ?? 0 })).filter(d => d.value > 0);
  const hasWickets    = years.some(y => (formatData[y]?.wickets ?? 0) > 0);
  const metricOptions = hasWickets ? ['🏏 Runs', '🏐 Wickets'] : ['🏏 Runs'];
  return (
    <View style={styles.yearSection}>
      <Text style={styles.sectionHeader}>📈 Year by Year</Text>
      <SlidingToggle options={formats} selected={currentFormat} onSelect={f => setActiveFormat(f)} accent={accent} />
      {hasWickets && <SlidingToggle options={metricOptions} selected={activeMetric} onSelect={opt => setActiveMetric(opt)} accent={accent} />}
      <View style={styles.graphCard}><LineGraph data={graphData} color={accent} /></View>
    </View>
  );
}

// ── Home Away Section (with Neutral) ─────────────────────────────────────────
function AnimatedBar({ value, maxValue, color, reverse = false }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: false }).start();
  }, [value, maxValue]);
  const pct = maxValue > 0 ? Math.min((value || 0) / maxValue, 1) : 0;
  return (
    <View style={haStyles.barTrack}>
      <Animated.View style={[haStyles.barFill, reverse && { alignSelf: 'flex-end' }, {
        backgroundColor: color,
        width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${(pct * 100).toFixed(1)}%`] }),
      }]} />
    </View>
  );
}

function StatRow({ label, homeVal, neutralVal, awayVal, color }) {
  const h    = parseFloat(homeVal)    || 0;
  const n    = parseFloat(neutralVal) || 0;
  const a    = parseFloat(awayVal)    || 0;
  const max  = Math.max(h, n, a, 1);
  const best = Math.max(h, n, a);
  const homeWins    = h === best && h > 0;
  const neutralWins = n === best && n > 0 && n >= h && n >= a;
  const awayWins    = a === best && a > 0 && a >= h && a >= n;

  return (
    <View style={haStyles.statRow}>
      {/* Home bar (right-aligned) */}
      <View style={haStyles.barSide}>
        <Text style={[haStyles.barValue, homeWins && { color, fontWeight: '800' }]}>{homeVal ?? '—'}</Text>
        <AnimatedBar value={h} maxValue={max} color={homeWins ? color : color + '44'} reverse />
      </View>

      {/* Neutral bar (center) */}
      <View style={haStyles.barSideCenter}>
        <Text style={[haStyles.barValueSmall, neutralWins && { color: '#2E7D32', fontWeight: '800' }]}>{neutralVal ?? '—'}</Text>
        <AnimatedBar value={n} maxValue={max} color={neutralWins ? '#2E7D32' : '#2E7D3244'} />
      </View>

      {/* Label */}
      <View style={haStyles.labelBox}>
        <Text style={haStyles.statLabel}>{label}</Text>
      </View>

      {/* Away bar (left-aligned) */}
      <View style={haStyles.barSide}>
        <AnimatedBar value={a} maxValue={max} color={awayWins ? '#546E7A' : '#546E7A44'} />
        <Text style={[haStyles.barValue, awayWins && { color: '#546E7A', fontWeight: '800' }]}>{awayVal ?? '—'}</Text>
      </View>
    </View>
  );
}

function HomeAwaySection({ homeAway, accent }) {
  const [activeFormat, setActiveFormat] = useState(null);
  const [activeStat, setActiveStat]     = useState('🏏 Batting');
  if (!homeAway) return null;
  const formats = Object.keys(homeAway).sort().map(f => f.toUpperCase());
  if (formats.length === 0) return null;
  const currentFormat = activeFormat || formats[0];
  const formatData    = homeAway[currentFormat.toLowerCase()] || {};
  const home          = formatData['Home']    || {};
  const away          = formatData['Away']    || {};
  const neutral       = formatData['Neutral'] || {};

  const homeAvg    = parseFloat(home.avg)    || 0;
  const awayAvg    = parseFloat(away.avg)    || 0;
  const neutralAvg = parseFloat(neutral.avg) || 0;
  const bestAvg    = Math.max(homeAvg, awayAvg, neutralAvg);
  const verdict =
    bestAvg === 0
      ? { text: 'CONSISTENT EVERYWHERE 🌍', sub: 'Performs equally in all conditions', color: '#888' }
    : bestAvg === neutralAvg && neutralAvg > homeAvg && neutralAvg > awayAvg
      ? { text: 'NEUTRAL VENUE SPECIALIST 🌍', sub: `Avg ${neutralAvg} at neutral venues`, color: '#2E7D32' }
    : bestAvg === homeAvg && homeAvg > awayAvg
      ? { text: 'STRONGER AT HOME 🏠', sub: `Avg ${homeAvg} at home vs ${awayAvg} away`, color: accent }
    : bestAvg === awayAvg && awayAvg > homeAvg
      ? { text: 'AWAY WARRIOR ✈️', sub: `Avg ${awayAvg} away vs ${homeAvg} at home`, color: '#546E7A' }
      : { text: 'CONSISTENT EVERYWHERE 🌍', sub: 'Performs equally in all conditions', color: '#888' };

  const hasBowling = (home.wickets ?? away.wickets ?? neutral.wickets) !== null &&
                     (home.wickets ?? away.wickets ?? neutral.wickets) !== undefined;
  const statOptions = hasBowling ? ['🏏 Batting', '🏐 Bowling'] : ['🏏 Batting'];

  return (
    <View style={haStyles.container}>
      <Text style={styles.sectionHeader}>🏟️ Home vs Away</Text>
      <SlidingToggle options={formats} selected={currentFormat} onSelect={f => setActiveFormat(f)} accent={accent} />
      {hasBowling && <SlidingToggle options={statOptions} selected={activeStat} onSelect={s => setActiveStat(s)} accent={accent} />}

      {/* 3-column header */}
      <View style={haStyles.headerRow}>
        <View style={[haStyles.headerCol, { alignItems: 'flex-end' }]}>
          <Text style={[haStyles.headerLabel, { color: accent }]}>🏠 HOME</Text>
          <Text style={haStyles.headerMatches}>{home.matches ?? '—'} m</Text>
        </View>
        <View style={[haStyles.headerCol, { alignItems: 'center' }]}>
          <Text style={[haStyles.headerLabel, { color: '#2E7D32' }]}>🌍 NEUTRAL</Text>
          <Text style={haStyles.headerMatches}>{neutral.matches ?? '—'} m</Text>
        </View>
        <View style={haStyles.labelBox} />
        <View style={[haStyles.headerCol, { alignItems: 'flex-start' }]}>
          <Text style={[haStyles.headerLabel, { color: '#546E7A' }]}>✈️ AWAY</Text>
          <Text style={haStyles.headerMatches}>{away.matches ?? '—'} m</Text>
        </View>
      </View>

      <View style={haStyles.barsCard}>
        {activeStat === '🏏 Batting' ? (
          <>
            <StatRow label="Runs"  homeVal={home.runs}     neutralVal={neutral.runs}     awayVal={away.runs}     color={accent} />
            <StatRow label="Avg"   homeVal={home.avg}      neutralVal={neutral.avg}      awayVal={away.avg}      color={accent} />
            <StatRow label="SR"    homeVal={home.sr}       neutralVal={neutral.sr}       awayVal={away.sr}       color={accent} />
            <StatRow label="100s"  homeVal={home.hundreds} neutralVal={neutral.hundreds} awayVal={away.hundreds} color={accent} />
            <StatRow label="50s"   homeVal={home.fifties}  neutralVal={neutral.fifties}  awayVal={away.fifties}  color={accent} />
          </>
        ) : (
          <>
            <StatRow label="Wkts" homeVal={home.wickets}      neutralVal={neutral.wickets}      awayVal={away.wickets}      color={accent} />
            <StatRow label="Econ" homeVal={home.economy}      neutralVal={neutral.economy}      awayVal={away.economy}      color={accent} />
            <StatRow label="Avg"  homeVal={home.bowl_avg}     neutralVal={neutral.bowl_avg}     awayVal={away.bowl_avg}     color={accent} />
            <StatRow label="Best" homeVal={home.best_bowling} neutralVal={neutral.best_bowling} awayVal={away.best_bowling} color={accent} />
          </>
        )}
      </View>

      <View style={[haStyles.verdictCard, { borderColor: verdict.color + '44' }]}>
        <Text style={[haStyles.verdictTitle, { color: verdict.color }]}>{verdict.text}</Text>
        <Text style={haStyles.verdictSub}>{verdict.sub}</Text>
      </View>
    </View>
  );
}

const haStyles = StyleSheet.create({
  container:      { marginHorizontal: 16, marginBottom: 24 },
  headerRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerCol:      { flex: 1 },
  headerLabel:    { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  headerMatches:  { fontSize: 9, color: '#AAA', marginTop: 1 },
  barsCard:       { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2, gap: 14 },
  statRow:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  barSide:        { flex: 1.2, gap: 3 },
  barSideCenter:  { flex: 0.9, gap: 3, alignItems: 'center' },
  barValue:       { fontSize: 12, fontWeight: '600', color: '#555', textAlign: 'center' },
  barValueSmall:  { fontSize: 11, fontWeight: '600', color: '#555', textAlign: 'center' },
  labelBox:       { width: 32, alignItems: 'center' },
  statLabel:      { fontSize: 9, color: '#AAA', fontWeight: '600', textTransform: 'uppercase' },
  barTrack:       { height: 7, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  barFill:        { height: '100%', borderRadius: 4 },
  verdictCard:    { marginTop: 12, borderRadius: 12, borderWidth: 1.5, padding: 14, alignItems: 'center', backgroundColor: '#FAFAFA' },
  verdictTitle:   { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  verdictSub:     { fontSize: 12, color: '#888', marginTop: 4 },
});

// ── VS Team Section ───────────────────────────────────────────────────────────
const TEAM_FLAGS = {
  'AUS Women': '🇦🇺', 'ENG Women': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'NZ Women': '🇳🇿',
  'SA Women': '🇿🇦', 'WI Women': '🏝️', 'PAK Women': '🇵🇰',
  'SL Women': '🇱🇰', 'BAN Women': '🇧🇩', 'IRE Women': '🇮🇪',
  'UAE Women': '🇦🇪', 'MAS Women': '🇲🇾', 'THA Women': '🇹🇭',
  'Nepal Women': '🇳🇵', 'Barbados Women': '🏝️',
};

function VSTeamSection({ vsTeams, accent }) {
  const [activeFormat, setActiveFormat] = useState(null);
  const [activeTeam, setActiveTeam]     = useState(null);
  const [activeStat, setActiveStat]     = useState('🏏 Batting');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  if (!vsTeams) return null;
  const formats = Object.keys(vsTeams).sort().map(f => f.toUpperCase());
  if (formats.length === 0) return null;
  const currentFormat = activeFormat || formats[0];
  const formatData    = vsTeams[currentFormat.toLowerCase()] || {};
  const teams         = Object.keys(formatData).sort();
  const currentTeam   = activeTeam && teams.includes(activeTeam) ? activeTeam : teams[0];
  const teamData      = formatData[currentTeam] || {};
  const bat           = teamData.batting || {};
  const bowl          = teamData.bowling || {};
  const hasBowling    = bowl.wickets !== null && bowl.wickets !== undefined;
  const statOptions   = hasBowling ? ['🏏 Batting', '🏐 Bowling'] : ['🏏 Batting'];

  function selectTeam(team) {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    setActiveTeam(team);
  }

  return (
    <View style={vsStyles.wrapper}>
      <Text style={styles.sectionHeader}>🌍 VS Teams</Text>
      <SlidingToggle options={formats} selected={currentFormat} onSelect={f => { setActiveFormat(f); setActiveTeam(null); }} accent={accent} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={vsStyles.chipScroll} contentContainerStyle={vsStyles.chipRow}>
        {teams.map(team => {
          const isActive = team === currentTeam;
          return (
            <TouchableOpacity key={team} style={[vsStyles.chip, isActive && { backgroundColor: accent, borderColor: accent }]} onPress={() => selectTeam(team)} activeOpacity={0.75}>
              <Text style={vsStyles.chipFlag}>{TEAM_FLAGS[team] || '🏏'}</Text>
              <Text style={[vsStyles.chipText, isActive && { color: '#FFF' }]}>{team.replace(' Women', '')}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {hasBowling && <SlidingToggle options={statOptions} selected={activeStat} onSelect={s => setActiveStat(s)} accent={accent} />}
      <Animated.View style={[vsStyles.card, { borderColor: accent + '33', opacity: fadeAnim }]}>
        <View style={vsStyles.cardHeader}>
          <Text style={vsStyles.cardFlag}>{TEAM_FLAGS[currentTeam] || '🏏'}</Text>
          <View>
            <Text style={[vsStyles.cardTeam, { color: accent }]}>vs {currentTeam.replace(' Women', '')}</Text>
            <Text style={vsStyles.cardMatches}>{bat.matches ?? bowl.matches ?? '—'} matches</Text>
          </View>
        </View>
        {activeStat === '🏏 Batting' ? (
          <View style={vsStyles.statGrid}>
            {[['Runs', bat.runs], ['Average', bat.avg], ['SR', bat.sr], ['Best', bat.hs], ['100s', bat.hundreds], ['50s', bat.fifties]].map(([lbl, v]) => (
              <View key={lbl} style={[vsStyles.statCard, { borderColor: accent + '33' }]}>
                <Text style={[vsStyles.bigStat, { color: accent }]}>{val(v)}</Text>
                <Text style={vsStyles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={vsStyles.statGrid}>
            {[['Wickets', bowl.wickets], ['Economy', bowl.economy], ['Average', bowl.bowl_avg], ['Best', bowl.best], ['5W', bowl.five_wkt], ['Matches', bowl.matches]].map(([lbl, v]) => (
              <View key={lbl} style={[vsStyles.statCard, { borderColor: accent + '33' }]}>
                <Text style={[vsStyles.bigStat, { color: accent }]}>{val(v)}</Text>
                <Text style={vsStyles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const vsStyles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 24 },
  chipScroll: { marginBottom: 10 },
  chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#FFF' },
  chipFlag: { fontSize: 14 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#555' },
  card: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1.5, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardFlag: { fontSize: 36 },
  cardTeam: { fontSize: 20, fontWeight: '800' },
  cardMatches: { fontSize: 12, color: '#999', marginTop: 2 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { width: '30%', borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', backgroundColor: '#FAFAFA' },
  bigStat: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 10, color: '#999', marginTop: 3, textTransform: 'uppercase' },
});

// ── Coin Toss Card ────────────────────────────────────────────────────────────
function RingProgress({ value, maxValue, color, size = 64, strokeWidth = 7 }) {
  const anim   = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circum = 2 * Math.PI * radius;
  const pct    = maxValue > 0 ? Math.min((value || 0) / maxValue, 1) : 0;
  useEffect(() => {
    Animated.spring(anim, { toValue: pct, tension: 50, friction: 8, useNativeDriver: false }).start();
  }, [value, maxValue]);
  const strokeDash = anim.interpolate({ inputRange: [0, 1], outputRange: [`0 ${circum}`, `${circum} ${circum}`] });
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke={color + '22'} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={strokeDash} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </Svg>
    </View>
  );
}
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CoinTossCard({ batField, accent }) {
  const [activeFormat, setActiveFormat] = useState(null);
  if (!batField) return null;
  const formats = Object.keys(batField).sort().map(f => f.toUpperCase());
  if (formats.length === 0) return null;
  const currentFormat = activeFormat || formats[0];
  const formatData    = batField[currentFormat.toLowerCase()] || {};
  const bat           = formatData['Batting First']  || {};
  const field         = formatData['Fielding First'] || {};
  const batAvg        = parseFloat(bat.bat_avg)   || 0;
  const fieldAvg      = parseFloat(field.bat_avg) || 0;
  const verdict    = batAvg > fieldAvg + 3 ? '🚀 SET THE TARGET' : fieldAvg > batAvg + 3 ? '🎯 LOVES CHASING' : '⚡ DEADLY EITHER WAY';
  const verdictSub = batAvg > fieldAvg + 3 ? `Avg ${batAvg} batting first vs ${fieldAvg} chasing` : fieldAvg > batAvg + 3 ? `Avg ${fieldAvg} chasing vs ${batAvg} batting first` : 'Consistent in both conditions';
  const maxRuns = Math.max(parseFloat(bat.runs)||0, parseFloat(field.runs)||0, 1);
  const hasWkts = bat.wickets !== null || field.wickets !== null;
  const maxWkts = Math.max(parseFloat(bat.wickets)||0, parseFloat(field.wickets)||0, 1);

  return (
    <View style={ctStyles.wrapper}>
      <Text style={styles.sectionHeader}>🪙 Coin Toss Analysis</Text>
      <SlidingToggle options={formats} selected={currentFormat} onSelect={f => setActiveFormat(f)} accent="#C2185B" />
      <View style={ctStyles.card}>
        {[0.2, 0.4, 0.6, 0.8].map((p, i) => <View key={i} style={[ctStyles.pitchLine, { left: `${p * 100}%` }]} />)}
        <View style={ctStyles.headerRow}>
          <View style={ctStyles.colHeader}><Text style={ctStyles.batFirstLabel}>🏏 BAT FIRST</Text><Text style={ctStyles.matchCount}>{bat.matches ?? '—'} games</Text></View>
          <View style={ctStyles.dividerCol}><Text style={ctStyles.ballEmoji}>🏏</Text></View>
          <View style={[ctStyles.colHeader, { alignItems: 'flex-start' }]}><Text style={ctStyles.fieldFirstLabel}>🛡️ FIELD FIRST</Text><Text style={ctStyles.matchCount}>{field.matches ?? '—'} games</Text></View>
        </View>
        <View style={ctStyles.horizontalLine} />
        <View style={ctStyles.ringRow}>
          <View style={ctStyles.ringBlock}>
            <RingProgress value={parseFloat(bat.runs)||0} maxValue={maxRuns} color="#F59E0B" size={72} />
            <Text style={[ctStyles.ringValue, { color: '#F59E0B' }]}>{bat.runs ?? '—'}</Text>
            <Text style={ctStyles.ringLabel}>Runs</Text>
          </View>
          <View style={ctStyles.ringMidCol}>
            <Text style={ctStyles.vsText}>AVG</Text>
            <Text style={ctStyles.batAvgLeft}>{bat.bat_avg ?? '—'}</Text>
            <Text style={ctStyles.midDivider}>|</Text>
            <Text style={ctStyles.fieldAvgRight}>{field.bat_avg ?? '—'}</Text>
          </View>
          <View style={ctStyles.ringBlock}>
            <RingProgress value={parseFloat(field.runs)||0} maxValue={maxRuns} color="#0EA5E9" size={72} />
            <Text style={[ctStyles.ringValue, { color: '#0EA5E9' }]}>{field.runs ?? '—'}</Text>
            <Text style={ctStyles.ringLabel}>Runs</Text>
          </View>
        </View>
        {hasWkts && (<>
          <View style={ctStyles.horizontalLine} />
          <View style={ctStyles.ringRow}>
            <View style={ctStyles.ringBlock}>
              <RingProgress value={parseFloat(bat.wickets)||0} maxValue={maxWkts} color="#F59E0B" size={64} />
              <Text style={[ctStyles.ringValue, { color: '#F59E0B', fontSize: 16 }]}>{bat.wickets ?? '—'}</Text>
              <Text style={ctStyles.ringLabel}>Wickets</Text>
            </View>
            <View style={ctStyles.ringMidCol}>
              <Text style={ctStyles.vsText}>ECO</Text>
              <Text style={ctStyles.batAvgLeft}>{bat.bowl_avg ?? '—'}</Text>
              <Text style={ctStyles.midDivider}>|</Text>
              <Text style={ctStyles.fieldAvgRight}>{field.bowl_avg ?? '—'}</Text>
            </View>
            <View style={ctStyles.ringBlock}>
              <RingProgress value={parseFloat(field.wickets)||0} maxValue={maxWkts} color="#0EA5E9" size={64} />
              <Text style={[ctStyles.ringValue, { color: '#0EA5E9', fontSize: 16 }]}>{field.wickets ?? '—'}</Text>
              <Text style={ctStyles.ringLabel}>Wickets</Text>
            </View>
          </View>
        </>)}
      </View>
      <View style={ctStyles.verdictRow}>
        <Text style={ctStyles.verdictText}>{verdict}</Text>
        <Text style={ctStyles.verdictSub}>{verdictSub}</Text>
      </View>
    </View>
  );
}

const ctStyles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 24 },
  card: { backgroundColor: '#0F3D1F', borderRadius: 20, padding: 16, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  pitchLine: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#FFFFFF08' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  colHeader: { flex: 1, alignItems: 'flex-end' },
  dividerCol: { width: 48, alignItems: 'center' },
  batFirstLabel: { fontSize: 12, fontWeight: '800', color: '#F59E0B', letterSpacing: 0.5 },
  fieldFirstLabel: { fontSize: 12, fontWeight: '800', color: '#0EA5E9', letterSpacing: 0.5 },
  matchCount: { fontSize: 10, color: '#FFFFFF66', marginTop: 2 },
  ballEmoji: { fontSize: 22 },
  horizontalLine: { height: 1, backgroundColor: '#FFFFFF15', marginVertical: 12 },
  ringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ringBlock: { flex: 1, alignItems: 'center', gap: 4 },
  ringValue: { fontSize: 18, fontWeight: '800' },
  ringLabel: { fontSize: 10, color: '#FFFFFF88', textTransform: 'uppercase' },
  ringMidCol: { width: 56, alignItems: 'center', gap: 2 },
  vsText: { fontSize: 9, color: '#FFFFFF55', fontWeight: '700', letterSpacing: 1 },
  batAvgLeft: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  midDivider: { fontSize: 16, color: '#FFFFFF33' },
  fieldAvgRight: { fontSize: 13, fontWeight: '700', color: '#0EA5E9' },
  verdictRow: { marginTop: 12, alignItems: 'center', gap: 4 },
  verdictText: { fontSize: 16, fontWeight: '800', color: '#111' },
  verdictSub: { fontSize: 12, color: '#888' },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PlayerDetailScreen() {
  const { player: playerParam } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    async function fetchPlayer() {
      try {
        if (playerParam) {
          const playerData = typeof playerParam === 'string' ? JSON.parse(playerParam) : playerParam;
          setPlayer(playerData);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayer();
  }, [playerParam]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#C2185B" /></View>;
  if (!player) return <View style={styles.center}><Text style={styles.errorText}>Player not found.</Text></View>;

  const role        = normalizeRole(player.role);
  const accentColor = ROLE_ACCENT[role] || '#333';
  const bgColor     = ROLE_COLORS[role] || '#F5F5F5';
  const key         = player.name?.toLowerCase().replace(/\s/g, "_");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={[styles.heroCard, { backgroundColor: bgColor }]}>
        <TouchableOpacity onPress={() => {
          setShowAvatar(!showAvatar);
          if (!showAvatar) Speech.speak(`Hi, explore my stats!`, { language: 'en-IN' });
        }}>
          <Image source={showAvatar ? require("../assets/images/avatar.png.png") : PLAYER_IMAGES[key]} style={styles.playerImage} />
        </TouchableOpacity>
        <Text style={styles.heroName}>{player.name || player.docId}</Text>
        <View style={[styles.roleBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.roleText}>{role}</Text>
        </View>
        <View style={styles.infoGrid}>
          {player.dob && <View style={styles.infoRow}><Text style={styles.infoLabel}>🎂 Born</Text><Text style={styles.infoValue}>{player.dob}</Text></View>}
          {(player.current_team || player.current_teams) && <View style={styles.infoRow}><Text style={styles.infoLabel}>🏏 Teams</Text><Text style={styles.infoValue}>{player.current_team || player.current_teams}</Text></View>}
          {player.batting_style && <View style={styles.infoRow}><Text style={styles.infoLabel}>🏏 Batting</Text><Text style={styles.infoValue}>{player.batting_style}</Text></View>}
          {player.bowling_style && <View style={styles.infoRow}><Text style={styles.infoLabel}>🏐 Bowling</Text><Text style={styles.infoValue}>{player.bowling_style}</Text></View>}
          {player.home_city && <View style={styles.infoRow}><Text style={styles.infoLabel}>📍 City</Text><Text style={styles.infoValue}>{player.home_city}</Text></View>}
        </View>
      </View>

      <BioSection player={player} accent={accentColor} />
      <Text style={styles.sectionHeader}>Career Statistics</Text>
      <FormatSection format="ODI"  stats={player.formats?.odi}  accent={accentColor} />
      <FormatSection format="T20I" stats={player.formats?.t20i} accent={accentColor} />
      <FormatSection format="Test" stats={player.formats?.test} accent={accentColor} />
      <YearWiseSection yearWise={player.year_wise} accent={accentColor} />
      <HomeAwaySection homeAway={player.home_away} accent={accentColor} />
      <CoinTossCard batField={player.bat_field} accent={accentColor} />
      <VSTeamSection vsTeams={player.vs_teams} accent={accentColor} />
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const pillStyles = StyleSheet.create({
  container:        { flexDirection: 'row', borderRadius: 24, padding: 2, marginBottom: 10, position: 'relative' },
  pill:             { position: 'absolute', top: 2, height: '100%', borderRadius: 22, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  optionBtn:        { flex: 1, paddingVertical: 8, alignItems: 'center', zIndex: 1 },
  optionText:       { fontSize: 13, fontWeight: '600', color: '#888' },
  optionTextActive: { color: '#FFF' },
});

const graphStyles = StyleSheet.create({
  empty:        { height: 80, justifyContent: 'center', alignItems: 'center' },
  emptyText:    { color: '#AAA', fontSize: 13 },
  tooltip:      { height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  tooltipValue: { fontSize: 22, fontWeight: '800' },
  tooltipYear:  { fontSize: 12, color: '#888', marginTop: 1 },
  tooltipHint:  { fontSize: 12, color: '#CCC', fontStyle: 'italic' },
});

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#FAFAFA' },
  content:          { paddingBottom: 48 },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText:        { color: '#C62828', fontSize: 14 },
  backBtn:          { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  backText:         { fontSize: 15, color: '#C2185B', fontWeight: '600' },
  heroCard:         { margin: 16, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  playerImage:      { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff' },
  heroName:         { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 8 },
  roleBadge:        { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 16 },
  roleText:         { color: '#FFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  infoGrid:         { gap: 6 },
  infoRow:          { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoLabel:        { fontSize: 13, color: '#888', width: 72 },
  infoValue:        { fontSize: 13, color: '#222', fontWeight: '500', flex: 1 },
  sectionHeader:    { fontSize: 16, fontWeight: '700', color: '#444', paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  formatSection:    { marginHorizontal: 16, marginBottom: 16, borderLeftWidth: 4, borderRadius: 12, backgroundColor: '#FFF', padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  formatHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  formatTitle:      { fontSize: 18, fontWeight: '800' },
  matchesBadge:     { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  matchesBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  statsBlock:       { marginTop: 8 },
  statsBlockTitle:  { fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  statGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCell:         { width: '30%', backgroundColor: '#F7F7F7', borderRadius: 8, padding: 8, alignItems: 'center' },
  statCellValue:    { fontSize: 16, fontWeight: '700', color: '#222' },
  statCellLabel:    { fontSize: 10, color: '#999', marginTop: 2, textAlign: 'center' },
  yearSection:      { marginHorizontal: 16, marginTop: 4, marginBottom: 16 },
  graphCard:        { backgroundColor: '#FFF', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
});