
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function U19Screen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#FF006E', marginBottom: 12, textAlign: 'center' }}>
          🏏 WPL Scorecard
        </Text>
        <Text style={{ fontSize: 16, color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
          WPL is hitting the Pitch soon… don’t blink 👀🔥
        </Text>
      </View>
    </SafeAreaView>
  );
}