
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './components/ThemeContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="playerDetail"
          options={{
            headerShown: true,
            title: 'PitchCard',
            headerStyle: { backgroundColor: '#C2185B' },
            headerTintColor: '#FFF',
            headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal', headerShown: true }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}