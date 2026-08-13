import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

import boldFont from '@/assets/fonts/SchibstedGrotesk-Bold.ttf';
import mediumFont from '@/assets/fonts/SchibstedGrotesk-Medium.ttf';
import regularFont from '@/assets/fonts/SchibstedGrotesk-Regular.ttf';
import semiBoldFont from '@/assets/fonts/SchibstedGrotesk-SemiBold.ttf';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SchibstedGrotesk-Regular': regularFont,
    'SchibstedGrotesk-Medium': mediumFont,
    'SchibstedGrotesk-SemiBold': semiBoldFont,
    'SchibstedGrotesk-Bold': boldFont,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
