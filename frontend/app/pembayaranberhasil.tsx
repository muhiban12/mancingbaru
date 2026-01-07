import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions, 
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    // Animation for success icon
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, { 
        toValue: 1,
        duration: 500,
        delay: 200, 
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoToHistory = () => {
    router.replace('/tiketsaya'); // Navigasi ke riwayat tiket
  };

  const handleBackToHome = () => {
    router.replace('/mapAwal'); // Navigasi ke halaman utama
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon with Animation */}
        <View style={styles.iconContainer}>
          <Animated.View 
            style={[
              styles.circle,
              {
                transform: [{ scale: scaleValue }],
              }
            ]}
          >
            <MaterialIcons name="check" size={70} color="#FFF" />
          </Animated.View>
        </View>

        {/* Success Message */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeValue,
            }
          ]}
        >
          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successSubtitle}>
            Tiket Anda telah berhasil dipesan. Silakan tunjukkan QR code saat check-in.
          </Text>
        </Animated.View>

        {/* Booking Details */}
        <Animated.View 
          style={[
            styles.detailsCard,
            {
              opacity: fadeValue,
            }
          ]}
        >
          <View style={styles.detailHeader}>
            <MaterialIcons name="confirmation-number" size={24} color="#0c4a6e" />
            <Text style={styles.detailHeaderText}>Detail Tiket</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kode Tiket</Text>
              <Text style={styles.detailValue}>MGC-7890-24</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>AKTIF</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tanggal</Text>
              <Text style={styles.detailValue}>24 Okt 2024</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Waktu</Text>
              <Text style={styles.detailValue}>08:00 - 12:00</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Lokasi</Text>
            <Text style={styles.locationText}>Telaga Berkah, Bogor</Text>
            <Text style={styles.locationSubtext}>Spot A - VIP Area</Text>
          </View>
          
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <MaterialIcons name="qr-code-scanner" size={50} color="#cbd5e1" />
              <Text style={styles.qrText}>QR Code akan muncul di Riwayat Tiket</Text>
            </View>
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View 
          style={[
            styles.instructions,
            {
              opacity: fadeValue,
            }
          ]}
        >
          <View style={styles.instructionItem}>
            <View style={styles.instructionIcon}>
              <MaterialIcons name="schedule" size={20} color="#f49d25" />
            </View>
            <Text style={styles.instructionText}>
              Datang 15 menit sebelum waktu booking
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionIcon}>
              <MaterialIcons name="qr-code-2" size={20} color="#0c4a6e" />
            </View>
            <Text style={styles.instructionText}>
              Tunjukkan QR code untuk check-in
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionIcon}>
              <MaterialIcons name="info" size={20} color="#10b981" />
            </View>
            <Text style={styles.instructionText}>
              Batas pembatalan: 24 jam sebelum booking
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Action Buttons */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: fadeValue,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={handleGoToHistory}
          activeOpacity={0.8}
        >
          <MaterialIcons name="history" size={22} color="#FFF" />
          <Text style={styles.historyButtonText}>Lihat Riwayat Tiket</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <MaterialIcons name="home" size={22} color="#0c4a6e" />
          <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  detailsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0c4a6e',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  locationText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 2,
  },
  locationSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  qrContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    width: '100%',
  },
  qrText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  instructions: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c4a6e',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: '#0c4a6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#0c4a6e',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 10,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c4a6e',
  },
});