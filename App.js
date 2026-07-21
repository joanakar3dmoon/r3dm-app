import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MemberScreen from './src/screens/MemberScreen';
import TutorialesScreen from './src/screens/TutorialesScreen';
import DonarScreen from './src/screens/DonarScreen';

// AdMob Banner (cargado dinámicamente para evitar crash en Expo Go)
let BannerAd, BannerAdSize, TestIds;
try {
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch (e) {
  BannerAd = null;
}

const Tab = createBottomTabNavigator();

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0a0a1a',
    card: '#0d0d20',
    text: '#ffffff',
    border: 'rgba(139,92,246,0.15)',
    primary: '#7c3aed',
    notification: '#7c3aed',
  },
};

const ICONS = { Inicio: '🏠', Membresía: '🎵', Tutoriales: '🤖', Donar: '💜' };

const ADMOB_BANNER = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111'   // test
  : 'ca-app-pub-4903263409458961/6771307929';   // producción (r3dm/guia)

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={darkTheme}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
        <View style={styles.container}>
          {/* AdMob Banner superior */}
          {BannerAd && (
            <View style={styles.adContainer}>
              <BannerAd
                unitId={ADMOB_BANNER}
                size={BannerAdSize.BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: false }}
                onAdFailedToLoad={(err) => console.warn('Ad error:', err.code)}
              />
            </View>
          )}

          <View style={styles.navContainer}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => (
                  <Text style={{ fontSize: focused ? 22 : 18 }}>{ICONS[route.name]}</Text>
                ),
                tabBarActiveTintColor: '#a78bfa',
                tabBarInactiveTintColor: '#374151',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
                headerShown: false,
              })}
            >
              <Tab.Screen name="Inicio" component={HomeScreen} />
              <Tab.Screen name="Membresía" component={MemberScreen} />
              <Tab.Screen name="Tutoriales" component={TutorialesScreen} />
              <Tab.Screen name="Donar" component={DonarScreen} />
            </Tab.Navigator>
          </View>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  adContainer: {
    alignItems: 'center',
    backgroundColor: '#0d0d20',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139,92,246,0.1)',
  },
  navContainer: { flex: 1 },
  tabBar: {
    backgroundColor: '#0d0d20',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139,92,246,0.2)',
    paddingBottom: 6,
    paddingTop: 6,
    height: 64,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
