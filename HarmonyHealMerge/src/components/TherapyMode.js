import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TherapyMode({ visible, onClose, onComplete }) {
  const [phase, setPhase] = useState('Ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  
  // 4-7-8 Breathing Technique
  const runBreathingCycle = () => {
    // Phase 1: Inhale (4 seconds)
    setPhase('Inhale...');
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 2.5,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Phase 2: Hold (7 seconds)
      setPhase('Hold...');
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch(e){}
      }
      setTimeout(() => {
        // Phase 3: Exhale (8 seconds)
        setPhase('Exhale...');
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e){}
        }
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 8000,
            useNativeDriver: true,
          })
        ]).start(() => {
          // Cycle Complete
          setPhase('Done');
          setTimeout(() => {
            onComplete();
            onClose();
          }, 1000);
        });
      }, 7000);
    });
  };

  useEffect(() => {
    if (visible) {
      setPhase('Ready');
      scaleAnim.setValue(1);
      opacityAnim.setValue(0.5);
      setTimeout(() => {
        runBreathingCycle();
      }, 1000);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Therapy Mode</Text>
        <Text style={styles.subtitle}>4-7-8 Breathing Technique</Text>
        
        <View style={styles.animationContainer}>
          <Animated.View 
            style={[
              styles.circle, 
              { 
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim
              }
            ]} 
          />
          <Text style={styles.phaseText}>{phase}</Text>
        </View>
        
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 43, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5bc0be',
    marginBottom: 10,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#a3cef1',
    marginBottom: 60,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5bc0be',
    position: 'absolute',
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    zIndex: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 40,
  },
  cancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
