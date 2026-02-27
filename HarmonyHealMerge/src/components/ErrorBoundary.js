import React from 'react';
import { View, Text, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#880000', padding: 40, paddingTop: 100 }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Something went wrong.</Text>
          <ScrollView style={{ marginTop: 20 }}>
             <Text style={{ color: 'white', fontFamily: 'monospace' }}>{this.state.error?.toString()}</Text>
             <Text style={{ color: '#ffaaaa', fontFamily: 'monospace', marginTop: 10 }}>{this.state.info?.componentStack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
