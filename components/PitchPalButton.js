import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PitchPalButton() {
  const router  = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function onPress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();
    router.push('/(tabs)/pitchpal');
  }

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}> 
      <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.icon}>🏏</Text>
      </TouchableOpacity>
      <Text style={styles.label}>PitchPal</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  btn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#C2185B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C2185B',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  icon:  { fontSize: 24 },
  label: { fontSize: 9, color: '#C2185B', fontWeight: '700', marginTop: 3 },
});
