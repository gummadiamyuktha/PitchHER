import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { usePlayers } from '../hooks/usePlayers';

export default function SeniorsScreen({ navigation }) {
  const { players, loading, error } = usePlayers();
  const [selectedRole, setSelectedRole] = useState('ALL');

  const roles = ['ALL', 'BATTER', 'BOWLER', 'ALLROUNDER', 'KEEPER'];

  const filteredPlayers = selectedRole === 'ALL' 
    ? players 
    : players.filter(p => p.role === selectedRole);

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetail', { 
      playerId: player.id,
      playerName: player.name 
    });
  };

  const renderPlayerCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.playerCard}
      onPress={() => handlePlayerPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerRole}>{item.role}</Text>
        </View>
        <View style={styles.impactScore}>
          <Text style={styles.impactText}>
            {item.insights?.impact_score?.toFixed(1) || '—'}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>ODI</Text>
          <Text style={styles.statValue}>{item.formats?.odi?.matches || 0}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>T20I</Text>
          <Text style={styles.statValue}>{item.formats?.t20i?.matches || 0}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>TEST</Text>
          <Text style={styles.statValue}>{item.formats?.test?.matches || 0}</Text>
        </View>
      </View>

      <Text style={styles.bestFormat}>
        Best: {item.insights?.best_format || '—'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading seniors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Role Filter */}
      <FlatList
        horizontal
        data={roles}
        keyExtractor={(item) => item}
        style={styles.roleFilter}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === item && styles.roleButtonActive,
            ]}
            onPress={() => setSelectedRole(item)}
          >
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === item && styles.roleButtonTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Players List */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayerCard}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      {filteredPlayers.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No players found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  roleFilter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  roleButtonActive: {
    backgroundColor: '#FF6B35',
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 12,
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  playerRole: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginTop: 4,
  },
  impactScore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  bestFormat: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
