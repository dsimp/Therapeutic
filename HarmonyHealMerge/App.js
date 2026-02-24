import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Meters from './src/components/Meters';
import TherapyMode from './src/components/TherapyMode';
import gameHTML from './src/game/gameHTML';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState({ circulation: 0, stress: 50 });
  const [therapyVisible, setTherapyVisible] = useState(false);

  const handleTherapyComplete = () => {
    // Massive bonus for mindful breathing
    setScore(s => s + 500);
    setHealth(h => ({ ...h, stress: 0 }));
  };

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'UPDATE') {
        setScore(data.score);
        setHealth(data.health);
        
        // Therapeutic Haptic Feedback!
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (e) {
      console.log('Error parsing message from game', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#081017" />
      <Meters 
        score={score} 
        health={health} 
        onStartTherapy={() => setTherapyVisible(true)} 
      />
      
      <TherapyMode 
        visible={therapyVisible} 
        onClose={() => setTherapyVisible(false)} 
        onComplete={handleTherapyComplete} 
      />
      <View style={styles.gameContainer}>
        {Platform.OS === 'web' ? (
           <iframe 
             srcDoc={gameHTML}
             style={{ width: '100%', height: '100%', border: 'none' }}
           />
        ) : (
          <WebView
            source={{ html: gameHTML }}
            onMessage={onMessage}
            style={styles.webview}
            scrollEnabled={false}
            bounces={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081017',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#081017',
  },
  webview: {
    flex: 1,
    backgroundColor: '#081017',
  },
});
