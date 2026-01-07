import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet, 
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TournamentDetailScreen() {
    
  const router = useRouter();
  const [showRules, setShowRules] = useState(false);
  
  const tournamentData = {
    id: 'tournament_001',
    name: 'Galatama Lele Akbar', 
    status: 'Pendaftaran Buka',
    location: {
      name: 'Telaga Berkah Fishing Spot',
      address: 'Jl. Mancing No. 88, Jakarta Selatan',
    },
    date: '12 Nov, 08:00',
    maxParticipants: '50 Lapak',
    fee: 'Rp 150.000',
    totalPrize: 'Rp 5.000.000',
    registrationDeadline: '11 Nov 2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAlF4EWLpMpqAdRhqxEjIjcGF46IVXVmDTu6f7YmxNkjHCOKo-GTkvYp41q2-XWjn2P5s0pKop3qDKAs2nn197b2crGrB5xdPI_sZqBGhPzIvC2NOStiGusDkoDPsu88s-ohKElPvg9FvEHAFRgutiksOs7Qrtabq4FrLShjJyIlXksCKBWKS1Nv1vNTbb6VRuretaGdmwXOkk1KKG4cGICKGzVYO_neTvjSXAz7MnYG7O5WnUmz3G_FCNyi8qsATUkPA9fkrrkDxq',
    description: [
      'Ikuti keseruan turnamen Galatama Lele Akbar di Telaga Berkah! Turnamen ini terbuka untuk umum baik pemula maupun profesional. Rebut total hadiah jutaan rupiah dan jadilah juara pemancing lele terbaik bulan ini.',
      'Ikan lele master seberat 8kg telah dilepaskan ke kolam. Siapkan umpan terbaikmu dan strategi jitu untuk memenangkan kategori ikan terberat (induk).',
    ],
    rules: [
      'Peserta harus mendaftar sebelum batas waktu pendaftaran',
      'Biaya pendaftaran tidak dapat dikembalikan',
      'Peserta harus membawa peralatan memancing sendiri',
      'Waktu turnamen: 08:00 - 12:00 WIB',
      'Penilaian berdasarkan berat total ikan yang didapat',
      'Ikan yang mati tidak akan dinilai',
      'Pemenang akan diumumkan pada hari yang sama',
    ],
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    Alert.alert('Info', 'Fitur berbagi akan segera hadir!');
  };

  const handleRegister = () => {
    // Navigasi ke halaman pendaftaran
    Alert.alert(
      'Daftar Turnamen',
      'Apakah Anda yakin ingin mendaftar turnamen ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Daftar',
          onPress: () => {
            // Navigasi ke halaman pendaftaran atau pembayaran
            router.push('/bayarlomba');
          },
        },
      ]
    );
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detail Turnamen</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" size={24} color="#4b5563" style={{ opacity: 0.7 }} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: tournamentData.image }}
            style={styles.heroImage}
          />
          <View style={styles.imageOverlay} />
          
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{tournamentData.status}</Text>
          </View>
        </View>

        {/* Main Info Card */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.tournamentName}>{tournamentData.name}</Text>
          
          {/* Location */}
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={20} color="#0A3D62" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationName}>{tournamentData.location.name}</Text>
              <Text style={styles.locationAddress}>{tournamentData.location.address}</Text>
            </View>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            {/* Time */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Waktu</Text>
              <View style={styles.infoContent}>
                <MaterialIcons name="calendar-month" size={18} color="#6b7280" style={{ opacity: 0.7 }} />
                <Text style={styles.infoValue}>{tournamentData.date}</Text>
              </View>
            </View>

            {/* Max Participants */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Max Peserta</Text>
              <View style={styles.infoContent}>
                <MaterialIcons name="groups" size={18} color="#6b7280" style={{ opacity: 0.7 }} />
                <Text style={styles.infoValue}>{tournamentData.maxParticipants}</Text>
              </View>
            </View>

            {/* Fee */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Biaya</Text>
              <View style={styles.infoContent}>
                <MaterialIcons name="payments" size={18} color="#6b7280" style={{ opacity: 0.7 }} />
                <Text style={styles.infoValue}>{tournamentData.fee}</Text>
              </View>
            </View>

            {/* Total Prize */}
            <View style={[styles.infoCard, styles.prizeCard]}>
              <Text style={[styles.infoLabel, styles.prizeLabel]}>Total Hadiah</Text>
              <View style={styles.infoContent}>
                <MaterialIcons name="emoji-events" size={18} color="#FF6B00" />
                <Text style={[styles.infoValue, styles.prizeValue]}>{tournamentData.totalPrize}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi Lomba</Text>
          {tournamentData.description.map((paragraph, index) => (
            <Text key={index} style={styles.descriptionText}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Rules & Regulations */}
        <TouchableOpacity 
          style={styles.rulesCard}
          onPress={toggleRules}
          activeOpacity={0.7}
        >
          <View style={styles.rulesHeader}>
            <View style={styles.rulesTitleContainer}>
              <MaterialIcons name="gavel" size={20} color="#0A3D62" />
              <Text style={styles.rulesTitle}>Aturan & Regulasi</Text>
            </View>
            <MaterialIcons 
              name={showRules ? "expand-less" : "expand-more"} 
              size={20} 
              color="#9ca3af" 
            />
          </View>
          
          {showRules && (
            <View style={styles.rulesContent}>
              {tournamentData.rules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <Text style={styles.ruleBullet}>•</Text>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Spacer untuk tombol fixed di bawah */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Register Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.deadlineText}>
          Pendaftaran ditutup {tournamentData.registrationDeadline}
        </Text>
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
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A3D62',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroContainer: {
    height: 256,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#34D399',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tournamentName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: 32,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 20,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    color: '#9ca3af',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  prizeCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  prizeLabel: {
    color: '#fb923c',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  prizeValue: {
    color: '#FF6B00',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  rulesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  rulesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  rulesContent: {
    padding: 16,
    paddingTop: 0,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  ruleBullet: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  ruleText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  registerButton: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 8,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  deadlineText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});