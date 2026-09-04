import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

import boldFont from '@/assets/fonts/SchibstedGrotesk-Bold.ttf';
import mediumFont from '@/assets/fonts/SchibstedGrotesk-Medium.ttf';
import regularFont from '@/assets/fonts/SchibstedGrotesk-Regular.ttf';
import semiBoldFont from '@/assets/fonts/SchibstedGrotesk-SemiBold.ttf';

import { QueryProvider } from '@/providers/QueryProvider';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SchibstedGrotesk-Regular': regularFont,
    'SchibstedGrotesk-Medium': mediumFont,
    'SchibstedGrotesk-SemiBold': semiBoldFont,
    'SchibstedGrotesk-Bold': boldFont,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </QueryProvider>
  );
}
