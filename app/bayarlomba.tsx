import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image, 
  TextInput,
  Alert,
  StatusBar,
  Platform, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TournamentPaymentScreen() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('gopay');
  const [participantData, setParticipantData] = useState({
    fullName: 'Budi Santoso',
    phoneNumber: '',
  });

  const tournamentData = {
    title: 'Galatama Emas 2024',
    location: 'Telaga Berkah',
    date: 'Minggu, 12 Okt 2024',
    time: '08:00 - 16:00 WIB',
    spotRange: 'Lapak 12-40',
    status: 'OPEN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAlF4EWLpMpqAdRhqxEjIjcGF46IVXVmDTu6f7YmxNkjHCOKo-GTkvYp41q2-XWjn2P5s0pKop3qDKAs2nn197b2crGrB5xdPI_sZqBGhPzIvC2NOStiGusDkoDPsu88s-ohKElPvg9FvEHAFRgutiksOs7Qrtabq4FrLShjJyIlXksCKBWKS1Nv1vNTbb6VRuretaGdmwXOkk1KKG4cGICKGzVYO_neTvjSXAz7MnYG7O5WnUmz3G_FCNyi8qsATUkPA9fkrrkDxq',
  };

  const paymentData = {
    participationFee: 150000,
    serviceFee: 2000,
    uniqueCode: 123,
    totalPayment: 151877,
  };

  const handleBack = () => {
    router.back();
  };

  const handlePaymentConfirmation = () => {
    if (!participantData.phoneNumber.trim()) {
      Alert.alert('Peringatan', 'Silakan masukkan nomor WhatsApp Anda.');
      return;
    }

    Alert.alert(
      'Konfirmasi Pembayaran',
      `Total pembayaran: Rp ${paymentData.totalPayment.toLocaleString('id-ID')}\n\nLanjutkan pembayaran?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Bayar',
          onPress: () => {
            Alert.alert(
              'Pembayaran Berhasil',
              'Pendaftaran Anda berhasil! Tiket akan dikirim ke WhatsApp Anda.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/lombasukses');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const updateParticipantData = (field: string, value: string) => {
    setParticipantData({
      ...participantData,
      [field]: value,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Daftar Lomba</Text>
          <Text style={styles.headerSubtitle}>
            {tournamentData.title} - {tournamentData.location}
          </Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Steps */}
        <View style={styles.stepIndicatorContainer}>
          <View style={styles.stepLabels}>
            <Text style={styles.activeStepLabel}>Detail Peserta</Text>
            <Text style={styles.inactiveStepLabel}>Pembayaran</Text>
            <Text style={styles.inactiveStepLabel}>Selesai</Text>
          </View>
          <View style={styles.stepBar}>
            <View style={styles.stepProgress} />
          </View>
        </View>

        {/* Tournament Card */}
        <View style={styles.tournamentCard}>
          <View style={styles.tournamentCardContent}>
            <View style={styles.tournamentImageContainer}>
              <Image
                source={{ uri: tournamentData.image }}
                style={styles.tournamentImage}
              />
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{tournamentData.status}</Text>
              </View>
            </View>
            
            <View style={styles.tournamentInfo}>
              <Text style={styles.tournamentTitle}>{tournamentData.title}</Text>
              
              <View style={styles.tournamentDetails}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="calendar-today" size={16} color="#13a4ec" />
                  <Text style={styles.detailText}>{tournamentData.date}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialIcons name="schedule" size={16} color="#13a4ec" />
                  <Text style={styles.detailText}>{tournamentData.time}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialIcons name="location-on" size={16} color="#13a4ec" />
                  <Text style={styles.detailText}>{tournamentData.spotRange}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Participant Form */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Data Peserta</Text>
          </View>
          
          <View style={styles.formContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>NAMA LENGKAP</Text>
              <TextInput
                style={styles.textInput}
                value={participantData.fullName}
                onChangeText={(text) => updateParticipantData('fullName', text)}
                placeholder="Masukkan nama sesuai KTP"
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>NOMOR WHATSAPP</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+62</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.phoneInput]}
                  value={participantData.phoneNumber}
                  onChangeText={(text) => updateParticipantData('phoneNumber', text)}
                  placeholder="812-3456-7890"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
              <Text style={styles.phoneNote}>
                *Tiket akan dikirimkan melalui WhatsApp
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          </View>
          
          <View style={styles.paymentMethods}>
            {/* GoPay */}
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'gopay' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('gopay')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodContent}>
                <View style={styles.paymentIconContainer}>
                  <MaterialIcons name="account-balance-wallet" size={24} color="#2563eb" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>GoPay</Text>
                  <Text style={styles.paymentDetail}>
                    Saldo: <Text style={styles.paymentBalance}>Rp 450.000</Text>
                  </Text>
                </View>
              </View>
              
              <View style={styles.radioButton}>
                {paymentMethod === 'gopay' && <View style={styles.radioButtonSelected} />}
              </View>
            </TouchableOpacity>
            
            {/* Virtual Account */}
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'va' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('va')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodContent}>
                <View style={styles.paymentIconContainer}>
                  <MaterialIcons name="account-balance" size={24} color="#7c3aed" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Virtual Account</Text>
                  <Text style={styles.paymentDetail}>BCA, Mandiri, BRI, BNI</Text>
                </View>
              </View>
              
              <View style={styles.radioButton}>
                {paymentMethod === 'va' && <View style={styles.radioButtonSelected} />}
              </View>
            </TouchableOpacity>
            
            {/* Credit/Debit Card (Disabled) */}
            <TouchableOpacity
              style={[styles.paymentMethod, styles.disabledPaymentMethod]}
              activeOpacity={0.7}
              disabled
            >
              <View style={styles.paymentMethodContent}>
                <View style={[styles.paymentIconContainer, styles.disabledIcon]}>
                  <MaterialIcons name="credit-card" size={24} color="#6b7280" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentName, styles.disabledText]}>
                    Kartu Kredit / Debit
                  </Text>
                  <View style={styles.errorBadge}>
                    <Text style={styles.errorBadgeText}>Gangguan</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.paymentDetailsTitle}>Rincian Pembayaran</Text>
          
          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Biaya Partisipasi</Text>
              <Text style={styles.paymentValue}>
                Rp {paymentData.participationFee.toLocaleString('id-ID')}
              </Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Biaya Layanan</Text>
              <Text style={styles.paymentValue}>
                Rp {paymentData.serviceFee.toLocaleString('id-ID')}
              </Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Kode Unik</Text>
              <Text style={styles.uniqueCodeValue}>
                - Rp {paymentData.uniqueCode}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>
                Rp {paymentData.totalPayment.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handlePaymentConfirmation}
          activeOpacity={0.8}
        >
          <Text style={styles.paymentButtonText}>Konfirmasi & Bayar</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    paddingTop: -55,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A3D62',
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    lineHeight: 16,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  stepIndicatorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activeStepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A3D62',
  },
  inactiveStepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  stepBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  stepProgress: {
    height: '100%',
    width: '50%',
    backgroundColor: '#0A3D62',
    borderRadius: 3,
  },
  tournamentCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tournamentCardContent: {
    flexDirection: 'row',
    gap: 16,
  },
  tournamentImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  tournamentInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 20,
    marginBottom: 8,
  },
  tournamentDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0A3D62',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  formContent: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
    paddingRight: 12,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  phoneInput: {
    paddingLeft: 72,
  },
  phoneNote: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
    marginLeft: 4,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPaymentMethod: {
    borderColor: '#0A3D62',
    backgroundColor: 'rgba(10, 61, 98, 0.04)',
  },
  disabledPaymentMethod: {
    opacity: 0.6,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledIcon: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  paymentDetail: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  paymentBalance: {
    color: '#374151',
    fontWeight: '600',
  },
  disabledText: {
    color: '#9ca3af',
  },
  errorBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  errorBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#dc2626',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A3D62',
  },
  paymentDetailsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  paymentDetails: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  uniqueCodeValue: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0A3D62',
  },
  bottomSpacer: {
    height: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  paymentButton: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
});