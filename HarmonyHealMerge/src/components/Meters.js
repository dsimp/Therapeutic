import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Meters({ score, health, onStartTherapy, gender, onToggleGender }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
          {/* Top Left Stats & Logo */}
          <View style={styles.topLeft}>
            <Text style={styles.title}>Harmony Heal</Text>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Vitality</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Circulation</Text>
              <Text style={[styles.statValue, {color: '#5bc0be'}]}>{health.circulation}%</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Stress</Text>
              <Text style={[styles.statValue, {color: health.stress < 50 ? '#5bc0be' : '#e74c3c'}]}>
                {health.stress}%
              </Text>
            </View>
          </View>

          {/* Top Right Controls */}
          <View style={styles.topRight}>
            <TouchableOpacity style={styles.genderButton} onPress={onToggleGender}>
                <Text style={styles.genderButtonText}>{gender === 'female' ? '♀ Female' : '♂ Male'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.zenButton} onPress={onStartTherapy}>
                <Text style={styles.zenButtonText}>Therapy Mode</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: 'box-none', // Let clicks pass through empty space
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  topLeft: {
    alignItems: 'flex-start',
    gap: 15, // Space out the vertical stats
    pointerEvents: 'box-none',
  },
  topRight: {
    alignItems: 'flex-end',
    gap: 15, // Space out the buttons
    pointerEvents: 'box-none',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a3cef1',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  genderButton: {
    backgroundColor: 'rgba(28, 37, 65, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3a506b',
  },
  genderButtonText: {
    color: '#a3cef1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  zenButton: {
    backgroundColor: 'rgba(91, 192, 190, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,    
  },
  zenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statBox: {
    alignItems: 'flex-start',
    pointerEvents: 'none',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  statLabel: {
    fontSize: 10,
    color: '#5bc0be',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e0f0ff',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
});
