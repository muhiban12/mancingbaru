import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ResetPasswordSent() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}> 
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroIcon}> 
          <MaterialIcons name="mark-email-read" size={42} color="#2dd4bf" />
        </View>
        <Text style={styles.heroTitle}>Pancing.in</Text>
        <Text style={styles.heroSubtitle}>Email Terkirim</Text>
      </View> 

      {/* Content */} 
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <MaterialIcons name="check" size={48} color="#2dd4bf" />
        </View>
        <Text style={styles.heading}>Link Reset Password Telah Dikirim!</Text>
        <Text style={styles.subText}>
          Silakan cek email atau pesan Anda untuk instruksi lebih lanjut.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.9}
        onPress={() => router.push('/login')}
      >
        <MaterialIcons
          name="arrow-back"
          size={22}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.backText}>Kembali ke Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ff', padding: 24 },
  hero: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  heroIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0a3d61',
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2dd4bf',
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(45,212,191,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'rgba(45,212,191,0.2)',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a3d61',
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 14,
    color: '#637888',
    textAlign: 'center',
    maxWidth: 280,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0a3d61',
    marginTop: 40,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});