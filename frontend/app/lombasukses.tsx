import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TournamentPaymentSuccessScreen() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.replace('/mapAwal');
  };

  const handleViewTicket = () => {
    router.push('/tiketsaya'); 
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <MaterialIcons name="check-circle" size={80} color="#34D399" />
        </View>
        
        <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
        <Text style={styles.successMessage}>
          Pendaftaran turnamen Anda telah dikonfirmasi. Tiket akan dikirim ke WhatsApp Anda.
        </Text>
        
        <TouchableOpacity style={styles.ticketButton} onPress={handleViewTicket}>
          <Text style={styles.ticketButtonText}>Lihat Tiket</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  ticketButton: {
    backgroundColor: '#0A3D62',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  ticketButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  homeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});