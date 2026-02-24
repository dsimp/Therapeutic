import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Meters({ score, health, onStartTherapy }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Harmony Heal Merge</Text>
        <TouchableOpacity style={styles.zenButton} onPress={onStartTherapy}>
          <Text style={styles.zenButtonText}>Therapy Mode</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Vitality Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Circulation</Text>
          <Text style={[styles.statValue, {color: '#5bc0be'}]}>{health.circulation}%</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Stress Level</Text>
          <Text style={[styles.statValue, {color: health.stress < 50 ? '#5bc0be' : '#e74c3c'}]}>
            {health.stress}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#0a1622',
    borderBottomWidth: 1,
    borderBottomColor: '#1c2541',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a3cef1',
  },
  zenButton: {
    backgroundColor: '#5bc0be',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,    
  },
  zenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#5bc0be',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e0f0ff',
    marginTop: 5,
  }
});
