// SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';


export default function SplashScreen() {
  const router = useRouter();
  const bobAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-100)).current;

  // Bobbing effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 4, duration: 1500, useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start(); 
  }, []);  

  // Shimmer effect
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 300,
        duration: 1500,
        useNativeDriver: true, 
      })
    ).start();
  }, []);

  useEffect(() => { 
    const timer = setTimeout(() => {
      router.replace('/onboarding1'); // ke app/index.tsx
    }, 2500); // splash tampil 2.5 detik

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo dengan bobbing */}
      <Animated.View style={[styles.logoBox, { transform: [{ translateY: bobAnim }] }]}>
      <MaterialIcons name="phishing" size={72} color="#fff" />
        <View style={styles.orangeDot} />
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>
        Pancing<Text style={styles.highlight}>.in</Text>
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Master the Waters</Text>

      {/* Progress Bar dengan shimmer */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill}>
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                transform: [{ translateX: shimmerAnim }],
              }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
        <View style={styles.progressText}>
          <Text style={styles.progressLabel}>Casting Line...</Text>
          <Text style={styles.progressPercent}>100%</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Pancing.in v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#052e4a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  orangeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FB923C',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  highlight: {
    color: '#6EE7B7',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#38bdf8',
  },
  progressContainer: {
    marginTop: 40,
    width: 280,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6EE7B7',
    overflow: 'hidden',
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6EE7B7',
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
});