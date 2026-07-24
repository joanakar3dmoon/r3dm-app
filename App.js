import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { mobileAds } from 'react-native-google-mobile-ads';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MemberScreen from './src/screens/MemberScreen';
import TutorialesScreen from './src/screens/TutorialesScreen';
import DonarScreen from './src/screens/DonarScreen';

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

export default function App() {
  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={darkTheme}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
        <View style={styles.container}>
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
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
