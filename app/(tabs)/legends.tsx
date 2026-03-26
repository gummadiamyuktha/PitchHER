import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Speech from 'expo-speech';
import PitchPalButton from '../../components/PitchPalButton';
import { PLAYER_IMAGES } from '../../data/playerImages';
import femaleCricketLegends from '../../data/players';

const PHONETIC_NAMES: Record<string, string> = {
  "Mithali Raj": "Mi-tha-li Raj",
  "Jhulan Goswami": "Jhu-lan Gos-wa-mi",
  "Diana Edulji": "Di-a-na E-dul-ji",
  "Shantha Rangaswamy": "Shan-tha Ran-ga-swa-my",
  "Neetu David": "Nee-tu Da-vid",
  "Shubhangi Kulkarni": "Shub-han-gi Kul-kar-ni",
  "Anjum Chopra": "An-jum Chop-ra",
  "Sandhya Agarwal": "Sand-hya A-gar-wal",
  "Sudha Shah": "Su-dha Shah",
};

const ROLE_COLORS: Record<string, string> = {
  BATTER:     '#E8F5E9',
  BOWLER:     '#E3F2FD',
  ALLROUNDER: '#FFF3E0',
  KEEPER:     '#F3E5F5',
};

const ROLE_ACCENT: Record<string, string> = {
  BATTER:     '#2E7D32',
  BOWLER:     '#1565C0',
  ALLROUNDER: '#E65100',
  KEEPER:     '#6A1B9A',
};

function normalizeRole(role: string): string {
  if (!role) return 'BATTER';
  const r = role.toUpperCase();
  if (r.includes('KEEP') || r.includes('WICKET')) return 'KEEPER';
  if (r.includes('ALL') || r.includes('ROUND'))   return 'ALLROUNDER';
  if (r.includes('BOWL'))                          return 'BOWLER';
  return 'BATTER';
}

function getInitials(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getImageKey(name: string) {
  return name?.toLowerCase().replace(/\s/g, '_');
}

// ── Story Circle ──────────────────────────────────────────────────────────────
function StoryCircle({ player, onPress }: { player: any; onPress: () => void }) {
  const accent = ROLE_ACCENT[player.role] || '#F7B801';
  const imgKey = getImageKey(player.name);
  const imgSrc = (PLAYER_IMAGES as any)[imgKey];
  const short  = player.name.split(' ')[0];
  return (
    <TouchableOpacity style={{ alignItems: 'center', width: 68, marginRight: 4 }} onPress={onPress} activeOpacity={0.8}>
      <View style={{ width: 58, height: 58, borderRadius: 29, borderWidth: 2.5, borderColor: accent, padding: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', backgroundColor: accent + '22', alignItems: 'center', justifyContent: 'center' }}>
          {imgSrc
            ? <Image source={imgSrc} style={{ width: 48, height: 48, borderRadius: 24 }} />
            : <Text style={{ fontSize: 18, fontWeight: '800', color: accent }}>{getInitials(player.name)}</Text>
          }
        </View>
      </View>
      <Text style={{ fontSize: 10, color: '#555', fontWeight: '600', textAlign: 'center', width: 64 }} numberOfLines={1}>{short}</Text>
    </TouchableOpacity>
  );
}

// ── Story Modal ───────────────────────────────────────────────────────────────
function StoryModal({ players, startIdx, onClose }: { players: any[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const player  = players[idx];
  const accent  = ROLE_ACCENT[player?.role] || '#F7B801';
  const imgKey  = getImageKey(player?.name);
  const imgSrc  = (PLAYER_IMAGES as any)[imgKey];

  const highlights = [
    player?.story?.headline,
    player?.story?.narrative?.slice(0, 150) + '...',
    (player?.stats?.odi?.runs ?? 0) > 0    ? `🏏 ODI Runs: ${player.stats.odi.runs} at avg ${player.stats.odi.avg}` : null,
    (player?.stats?.odi?.wickets ?? 0) > 0 ? `🎯 ODI Wickets: ${player.stats.odi.wickets} (Best: ${player.stats.odi.bbm})` : null,
    (player?.stats?.test?.matches ?? 0) > 0 ? `📋 Tests: ${player.stats.test.matches} matches` : null,
    player?.careerSpan ? `📅 Career: ${player.careerSpan}` : null,
  ].filter(Boolean) as string[];

  function goNext() {
    if (idx < players.length - 1) setIdx(i => i + 1);
    else onClose();
  }
  function goPrev() {
    if (idx > 0) setIdx(i => i - 1);
  }

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000000EE' }}>
        {/* Progress bars */}
        <View style={{
          flexDirection: 'row', gap: 4, paddingHorizontal: 12,
          paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44) + 8,
          marginBottom: 12,
        }}>
          {players.map((_, i) => (
            <View key={i} style={{ flex: 1, height: 3, backgroundColor: '#FFFFFF33', borderRadius: 2 }}>
              <View style={{ height: '100%', borderRadius: 2, backgroundColor: i <= idx ? accent : 'transparent', width: '100%' }} />
            </View>
          ))}
        </View>

        {/* Close button */}
        <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44) + 32, right: 16, zIndex: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '700' }}>✕</Text>
        </TouchableOpacity>

        {/* Card */}
        <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: '#1A1A1A', borderRadius: 20, padding: 20 }}>
          {/* Player header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 2.5, borderColor: accent, overflow: 'hidden', backgroundColor: accent + '33' }}>
              {imgSrc
                ? <Image source={imgSrc} style={{ width: 56, height: 56 }} />
                : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: accent, fontWeight: '800', fontSize: 20 }}>{getInitials(player?.name)}</Text></View>
              }
            </View>
            <View>
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 17 }}>{(player?.name || '').replace(/_/g, ' ').toUpperCase()}</Text>
              <Text style={{ color: accent, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                {player?.nickname} • {player?.careerSpan}
              </Text>
            </View>
          </View>

          {/* Highlights */}
          {highlights.map((h, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
              <Text style={{ color: accent, fontSize: 14 }}>👑</Text>
              <Text style={{ color: '#EEE', fontSize: 13, lineHeight: 20, flex: 1 }}>{h}</Text>
            </View>
          ))}
        </View>

        {/* Tap areas prev/next */}
        <View style={{ flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={goPrev} activeOpacity={1} />
          <TouchableOpacity style={{ flex: 1 }} onPress={goNext} activeOpacity={1} />
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LegendsScreen() {
  const router = useRouter();
  const [search, setSearch]             = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [storyIdx, setStoryIdx]         = useState<number | null>(null);


  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('herpitch_legends_favs').then(val => {
      if (val) setFavs(JSON.parse(val));
    });
  }, []);

  function toggleFav(id: string) {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      AsyncStorage.setItem('herpitch_legends_favs', JSON.stringify(next));
      return next;
    });
  }

  const roles      = ['ALL', 'BATTER', 'BOWLER', 'ALLROUNDER'];
  const allPlayers = (femaleCricketLegends as any).players || femaleCricketLegends || [];

  // Reset modal when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => setStoryIdx(null);
    }, [])
  );

  const filteredPlayers = allPlayers.filter((player: any) => {
    const matchSearch = player.name.toLowerCase().includes(search.toLowerCase());
    const matchRole   = selectedRole === 'ALL' || player.role === selectedRole;
    return matchSearch && matchRole;
  });

  const handlePlayerPress = (player: any) => {
    const speakName = PHONETIC_NAMES[player.name] || player.name;
    Speech.stop();
    Speech.speak(`${speakName}`, { language: 'en-IN', rate: 0.85, pitch: 1.1 });

    const converted = {
      docId:         player.id,
      name:          player.name,
      role:          player.role,
      dob:           player.dateOfBirth,
      home_city:     player.placeOfBirth,
      current_team:  `Career: ${player.careerSpan}`,
      batting_style: player.nickname || '',
      bowling_style: '',
      isLegend:      true,
      legendStory:   player.story?.narrative || '',
      formats: {
        odi: player.stats?.odi ? {
          matches: player.stats.odi.matches, runs: player.stats.odi.runs,
          bat_avg: player.stats.odi.avg, sr: player.stats.odi.sr,
          high_score: String(player.stats.odi.highestScore),
          hundreds: player.stats.odi.centuries, fifties: player.stats.odi.halfCenturies,
          bat_innings: player.stats.odi.innings, wickets: player.stats.odi.wickets,
          economy: player.stats.odi.econ, best_bowling: player.stats.odi.bbm,
          bowl_avg: player.stats.odi.avg,
        } : null,
        t20i: (player.stats?.t20i?.matches ?? 0) > 0 ? {
          matches: player.stats.t20i.matches, runs: player.stats.t20i.runs,
          bat_avg: player.stats.t20i.avg, sr: player.stats.t20i.sr,
          high_score: String(player.stats.t20i.highestScore),
          hundreds: player.stats.t20i.centuries, fifties: player.stats.t20i.halfCenturies,
          bat_innings: player.stats.t20i.innings, wickets: player.stats.t20i.wickets,
          economy: player.stats.t20i.econ, best_bowling: player.stats.t20i.bbm,
        } : null,
        test: (player.stats?.test?.matches ?? 0) > 0 ? {
          matches: player.stats.test.matches, runs: player.stats.test.runs,
          bat_avg: player.stats.test.avg, sr: player.stats.test.sr,
          high_score: String(player.stats.test.highestScore),
          hundreds: player.stats.test.centuries, fifties: player.stats.test.halfCenturies,
          bat_innings: player.stats.test.innings, wickets: player.stats.test.wickets,
          economy: player.stats.test.econ, best_bowling: player.stats.test.bbm,
        } : null,
      },
    };

    router.push({ pathname: '/playerDetail', params: { player: JSON.stringify(converted) } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>

      {/* Favourites */}
      {favs.length > 0 && (
        <View style={{ marginTop: 8, marginBottom: 4 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#C2185B', paddingHorizontal: 16, marginBottom: 6, letterSpacing: 0.5 }}>❤️ FAVOURITES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, flexDirection: 'row' }}>
            {allPlayers.filter((p: any) => favs.includes(p.id)).map((p: any) => {
              const role2   = normalizeRole(p.role);
              const accent2 = ROLE_ACCENT[role2];
              const imgSrc2 = (PLAYER_IMAGES as any)[getImageKey(p.name)];
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => router.push({ pathname: '/playerDetail', params: { player: JSON.stringify(p) } })}
                  style={{ alignItems: 'center', width: 64 }}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2.5, borderColor: accent2, overflow: 'hidden', marginBottom: 4 }}>
                    {imgSrc2
                      ? <Image source={imgSrc2} style={{ width: 52, height: 52 }} />
                      : <View style={{ flex: 1, backgroundColor: accent2 + '33', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: accent2, fontWeight: '800', fontSize: 14 }}>{getInitials(p.name)}</Text>
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

      {/* Header + Circles in one seamless block */}
      <View style={{ backgroundColor: '#FFF' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 6 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111', textAlign: 'center' }}>Queens of the Pitch 👑🔥</Text>

        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8, gap: 4 }}>
          {allPlayers.map((p: any, i: number) => (
            <StoryCircle
              key={p.id}
              player={p}
              onPress={() => {
                const speakName = PHONETIC_NAMES[p.name] || p.name;
                Speech.stop();
                Speech.speak(
                  `Hi! Let's dive into my story!`,
                  { language: 'en-IN', rate: 0.85, pitch: 1.1 }
                );
                setStoryIdx(i);
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Search */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 8, marginBottom: 8, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0E0E0', paddingHorizontal: 12 }}>
        <Text style={{ fontSize: 15, color: '#BBB', marginRight: 6 }}>🔍</Text>
        <TextInput
          style={{ flex: 1, fontSize: 14, color: '#111', paddingVertical: 10 }}
          placeholder="Search legends..."
          placeholderTextColor="#BBB"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ fontSize: 16, color: '#AAA', marginLeft: 4 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Role filter */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 10, gap: 8 }}>
        {roles.map((role) => (
          <TouchableOpacity key={role} onPress={() => setSelectedRole(role)}
            style={{ backgroundColor: selectedRole === role ? '#F7B801' : '#F0F0F0', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 }}>
            <Text style={{ color: '#111', fontWeight: '700', fontSize: 12 }}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Player list */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        style={{ backgroundColor: '#FAFAFA' }}
        renderItem={({ item }) => {
          const bgColor     = ROLE_COLORS[item.role]  || '#F5F5F5';
          const accentColor = ROLE_ACCENT[item.role] || '#333';
          const imgSrc      = (PLAYER_IMAGES as any)[getImageKey(item.name)];
          return (
            <TouchableOpacity onPress={() => handlePlayerPress(item)}
              style={{ backgroundColor: bgColor, marginBottom: 12, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: accentColor, overflow: 'hidden', backgroundColor: accentColor + '22' }}>
                  {imgSrc
                    ? <Image source={imgSrc} style={{ width: 52, height: 52 }} />
                    : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: accentColor, fontWeight: '800', fontSize: 18 }}>{getInitials(item.name)}</Text></View>
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '800', color: '#111', fontSize: 16, flex: 1 }} numberOfLines={1}>{(item.name || '').replace(/_/g, ' ').toUpperCase()}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TouchableOpacity
                        onPress={(e) => { e.stopPropagation(); toggleFav(item.id); }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={{ fontSize: 18 }}>{favs.includes(item.id) ? '❤️' : '🤍'}</Text>
                      </TouchableOpacity>
                      <View style={{ backgroundColor: accentColor, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>{item.role}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={{ color: accentColor, fontSize: 11, fontWeight: '600', marginTop: 2 }}>"{item.nickname}" • {item.careerSpan}</Text>
                </View>
              </View>

              <Text style={{ fontWeight: '700', color: '#111', fontSize: 13, marginBottom: 4 }}>{item.story.headline}</Text>
              <Text style={{ color: '#555', fontSize: 12, lineHeight: 18 }}>{item.story.narrative.slice(0, 100)}...</Text>

              <View style={{ flexDirection: 'row', marginTop: 10, gap: 16 }}>
                {(item.stats?.odi?.matches ?? 0) > 0 && <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 15, fontWeight: '800', color: accentColor }}>{item.stats?.odi?.matches}</Text><Text style={{ fontSize: 10, color: '#888' }}>ODI Caps</Text></View>}
                {(item.stats?.odi?.runs ?? 0) > 0 && <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 15, fontWeight: '800', color: accentColor }}>{item.stats?.odi?.runs}</Text><Text style={{ fontSize: 10, color: '#888' }}>ODI Runs</Text></View>}
                {(item.stats?.odi?.wickets ?? 0) > 0 && <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 15, fontWeight: '800', color: accentColor }}>{item.stats?.odi?.wickets}</Text><Text style={{ fontSize: 10, color: '#888' }}>ODI Wkts</Text></View>}
                {(item.stats?.test?.matches ?? 0) > 0 && <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 15, fontWeight: '800', color: accentColor }}>{item.stats?.test?.matches}</Text><Text style={{ fontSize: 10, color: '#888' }}>Tests</Text></View>}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Story Modal */}
      {storyIdx !== null && (
        <StoryModal players={allPlayers} startIdx={storyIdx} onClose={() => setStoryIdx(null)} />
      )}

      <PitchPalButton />
    </SafeAreaView>
  );
}