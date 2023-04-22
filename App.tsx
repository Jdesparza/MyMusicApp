/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Platform
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import MusicScreen from './src/screens/Music';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        // backgroundColor={backgroundStyle.backgroundColor}
        translucent={Platform.OS === 'android' ? true : false}
        backgroundColor={Platform.OS === 'android' ? 'transparent' : backgroundStyle.backgroundColor}
      />
      <MusicScreen />
    </SafeAreaView>
  );
}

export default App;
