import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity, 
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Onboarding3() {
  const router = useRouter();

  // Animasi float
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,  
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start(); 
  }, []);

  return (
    <View style={styles.container}>
      {/* Background wave */}
      <View style={styles.waveBg} />

      {/* Floating blobs */}
      <Animated.View style={[styles.floatIcon, { transform: [{ translateY: floatAnim }] }]}>
        <View style={styles.iconBox}>
          <MaterialIcons name="emoji-events" size={20} color="#fff" />
          <Text style={styles.rankText}>#1 Master</Text>
        </View>
      </Animated.View>

      {/* Illustration */}
      <View style={styles.illustrationWrapper}>
        <ImageBackground
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQI5KuKZbxOuADUHryUqfoa10cHpjrwkXuppkV3pSchBgVfAHCGyMs50J3hO3LflYPTkvarVScIOzBdp0Bi1ntbFfxMIbsojOwx04ir6bbgpFeGpzxmnNhLMhhm9olfIKb0ny_7JEJxb0n4XE7_3mKgDfR19rp_x7SMVnjUnkZ5drZJcwHKz9Rqgg095XPoSsaHTvwOMYcIqF_Aico2P4gieIwf_woJZGGQzAha8p9Uy3_ATat5Pa3w1Z5kiK08wN4XTsf28fT-OMW',
          }}
          style={styles.illustration}
          imageStyle={{ resizeMode: 'contain' }}
        />
      </View>

      {/* Title + subtitle */}
      <View style={styles.textSection}>
        <Text style={styles.title}>
          Flex Your{"\n"}
          <Text style={styles.gradientText}>Best Catch</Text>
        </Text>
        <Text style={styles.subtitle}>
          Basically, ini tempat lo buat <Text style={{ fontStyle: 'italic' }}>show off</Text> hasil tangkapan. Climb the leaderboard & be the <Text style={styles.highlight}>real champion</Text>.
        </Text>
      </View>

      {/* Bagian bawah (dots + button) → Tahap 2 */}
            {/* Dots + Button */}
            <View style={styles.bottomSection}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dotActive} />
        </View>

        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.9}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.startText}>START FISHING</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already joined the club?{' '}
          <Text
            style={styles.loginLink}
            
            onPress={() => {
              console.log('Navigating to /login from Login link');
              router.push('/login');
            }}
          >
            Login here
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 40,
    },
    waveBg: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#F8FAFC',
    },
    floatIcon: {
      position: 'absolute',
      top: 100,
      right: 40,
      zIndex: 20,
    },
    iconBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    rankText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '700',
      color: '#0a3d61',
      fontStyle: 'italic',
    },
    illustrationWrapper: {
      width: 280,
      height: 280,
      marginTop: 40,
      marginBottom: 20,
    },
    illustration: {
      flex: 1,
    },
    textSection: {
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      textAlign: 'center',
      color: '#0a3d61',
      lineHeight: 38,
    },
    gradientText: {
      color: '#26c6da',
      fontStyle: 'italic',
    },
    subtitle: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: '500',
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 320,
    },
    highlight: {
      color: '#0a3d61',
      fontWeight: '700',
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginTop: 20,
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#e5e7eb',
    },
    dotActive: {
      width: 32,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#26c6da',
    },
    startButton: {
      width: '100%',
      backgroundColor: '#0a3d61',
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#0a3d61',
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 3,
      marginBottom: 12,
    },
    startText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    loginText: {
      fontSize: 13,
      color: '#6b7280',
      textAlign: 'center',
    },
    loginLink: {
      color: '#0a3d61',
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
  });