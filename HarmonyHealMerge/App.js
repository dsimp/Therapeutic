import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Meters from './src/components/Meters';
import TherapyMode from './src/components/TherapyMode';
import Avatar3D from './src/components/Avatar3D';
import ErrorBoundary from './src/components/ErrorBoundary';
import gameHTML from './src/game/gameHTML';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState({ circulation: 0, stress: 50 });
  const [therapyVisible, setTherapyVisible] = useState(false);
  const [coords3D, setCoords3D] = useState(null); // Bridge for 2D -> 3D Raycasting
  const [gender, setGender] = useState('female'); // Toggle for procedural anatomy scale

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
      } else if (data.type === 'DROP_3D') {
          // Received a 2D food drop! Forward the WebGL screen coordinates to the 3D Canvas
          setCoords3D({ x: data.x, y: data.y, remedyId: data.remedyId, timestamp: Date.now() });
      }
    } catch (e) {
      console.log('Error parsing message from game', e);
    }
  };

  // Listen for web iframe messages
  React.useEffect(() => {
    if (Platform.OS === 'web') {
        const handleWebMessage = (e) => {
            if (e.data && typeof e.data === 'string') {
                try {
                    const data = JSON.parse(e.data);
                    if (data.type === 'DROP_3D') {
                         setCoords3D({ x: data.x, y: data.y, remedyId: data.remedyId, timestamp: Date.now() });
                    } else if (data.type === 'UPDATE') {
                         setScore(data.score);
                         setHealth(data.health);
                    }
                } catch(err){}
            }
        };
        window.addEventListener('message', handleWebMessage);
        return () => window.removeEventListener('message', handleWebMessage);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#081017" />
      <Meters 
        score={score} 
        health={health} 
        onStartTherapy={() => setTherapyVisible(true)}
        gender={gender}
        onToggleGender={() => setGender(g => g === 'female' ? 'male' : 'female')}
      />
      
      <TherapyMode 
        visible={therapyVisible} 
        onClose={() => setTherapyVisible(false)} 
        onComplete={handleTherapyComplete} 
      />
      <ErrorBoundary>
        <View style={styles.gameContainer}>
          {/* Render the 3D Canvas completely behind the 2D Phaser UI tray. Pass the drop coordinates. */}
          <Avatar3D dropCoords={coords3D} gender={gender} onHealSuccess={() => {}} />
          
          {Platform.OS === 'web' ? (
             <iframe 
               srcDoc={gameHTML}
               style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', position: 'absolute' }}
               allowtransparency="true"
             />
          ) : (
            <WebView
              source={{ html: gameHTML }}
              onMessage={onMessage}
              style={styles.webview}
              scrollEnabled={false}
              bounces={false}
              containerStyle={{ backgroundColor: 'transparent' }}
            />
          )}
        </View>
      </ErrorBoundary>
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
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
