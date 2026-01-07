import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

const { width } = Dimensions.get('window');

interface Ticket {
  id: number;
  title: string; 
  location: string;
  status: string;
  statusColor: string;
  seat: string | null;
  ticketId: string;
  date: string;
  time: string;
  weather?: {
    icon: string;
    title: string; 
    description: string;
    color: string;
  };
  qrCode: string;
  actionButton?: {
    text: string;
    color: string;
    icon: string;
  };
  showCancelButton?: boolean;
}

interface HistoryTicket {
  id: number;
  title: string;
  location: string;
  status: string;
  statusColor: string;
  date: string;
  time: string;
}

export default function BookingHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('aktif');
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const tickets = {
    aktif: [
      {
        id: 1,
        title: 'Telaga Berkah',
        location: 'Bogor, Jawa Barat',
        status: 'Siap Digunakan',
        statusColor: '#22c55e',
        seat: 'A1 (VIP)',
        ticketId: '#MCG-8821',
        date: '26 Des 2025',
        time: '08:00 - 11:00',
        weather: {
          icon: 'wb-sunny',
          title: 'Prediksi Cuaca: Cerah',
          description: 'Langit bersih, jangan lupa bawa topi mancingmu!',
          color: '#fbbf24',
        },
        qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyDavEru6gkAfBb89n_3o9r5Zq7Pb5ibFpqdbiaOo7E5EtEnaYtdDNYpRGDOH5r7RTidOrx8fDS1gTOVcrPujZiWeo4o0AeABomo5EKzPeBNmx_BwyOrc1o-7tU4MWo4NH23ZYB3MV-x00uCpZ9zyHbWwaqwiyWguoD-5C4p0toqA4UF2z4Sr1O7rmM_C9-sODqmEsIjFMMlnfhaMlxOTHcogkhAjngw-4hkXz2oHEZ03rdHzdI8zdng-RKAzMA4mNgJZn3_A-gAuP',
        actionButton: {
          text: 'Arahkan ke Lokasi',
          color: '#f97316',
          icon: 'near-me',
        },
      },
      {
        id: 2,
        title: 'Turnamen Galatama Emas',
        location: 'Pemancingan Telaga Warna, JKT',
        status: 'Akan Datang',
        statusColor: '#3b82f6',
        seat: null,
        ticketId: '#EVT-9920-GLTM',
        date: '02 Jan 2026',
        time: '07:00 - 15:00',
        weather: {
          icon: 'cloud-queue',
          title: 'Prediksi: Berawan',
          description: 'Cuaca sejuk, cocok untuk mancing seharian.',
          color: '#94a3b8',
        },
        qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyDavEru6gkAfBb89n_3o9r5Zq7Pb5ibFpqdbiaOo7E5EtEnaYtdDNYpRGDOH5r7RTidOrx8fDS1gTOVcrPujZiWeo4o0AeABomo5EKzPeBNmx_BwyOrc1o-7tU4MWo4NH23ZYB3MV-x00uCpZ9zyHbWwaqwiyWguoD-5C4p0toqA4UF2z4Sr1O7rmM_C9-sODqmEsIjFMMlnfhaMlxOTHcogkhAjngw-4hkXz2oHEZ03rdHzdI8zdng-RKAzMA4mNgJZn3_A-gAuP',
        actionButton: {
          text: 'Arahkan ke Lokasi',
          color: '#0a3d61',
          icon: 'near-me',
        },
        showCancelButton: true,
      },
    ],
    riwayat: [
      {
        id: 3,
        title: 'Pemancingan Galatama',
        location: '12 Nov 2025 • 09:00',
        status: 'Selesai',
        statusColor: '#6b7280',
        date: '12 Nov 2025',
        time: '09:00 - 12:00',
      },
    ],
  };

  const handleBack = () => router.back();

  const handleNavigateToLocation = (ticketId: number | string) => {
    let locationName = '';
    if (ticketId === 1) locationName = 'Telaga+Berkah+Bogor+Jawa+Barat';
    else if (ticketId === 2) locationName = 'Pemancingan+Telaga+Warna+Jakarta';
    else locationName = 'Pemancingan+Indonesia';
    
    const mapsUrl = Platform.select({
      ios: `http://maps.apple.com/?q=${locationName}`,
      android: `https://www.google.com/maps/search/?api=1&query=${locationName}`,
      default: `https://www.google.com/maps/search/?api=1&query=${locationName}`,
    });
    
    Linking.openURL(mapsUrl).catch(() => {
      Alert.alert(
        'Tidak Dapat Membuka Peta',
        'Pastikan Anda memiliki Google Maps atau Apple Maps terinstall di perangkat Anda.',
        [{ text: 'OK' }]
      );
    });
  };

  const handleCancelParticipation = (ticketId: number) => {
    Alert.alert(
      'Batalkan Keikutsertaan',
      'Apakah Anda yakin ingin membatalkan keikutsertaan pada event ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Berhasil Dibatalkan', 'Keikutsertaan Anda telah berhasil dibatalkan.');
          },
        },
      ]
    );
  };

  const renderTicketCard = (ticket: Ticket) => (
    <View key={ticket.id} style={styles.ticketCard}>
      <View style={styles.ticketTop}>
        {/* Nama Spot */}
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={18} color="#6b7280" />
            <Text style={styles.locationText}>{ticket.location}</Text>
          </View>
        </View>
        
        {/* Status di bawah nama spot */}
        <View style={[styles.statusBadge, { backgroundColor: `${ticket.statusColor}20` }]}>
          <Text style={[styles.statusText, { color: ticket.statusColor }]}>
            {ticket.status}
          </Text>
        </View>

        <View style={styles.ticketDetails}>
          {ticket.seat && (
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Kursi</Text>
              <Text style={styles.detailValue}>{ticket.seat}</Text>
            </View>
          )}
          
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>ID Tiket</Text>
            <Text style={styles.detailValue}>{ticket.ticketId}</Text>
          </View>

          <View style={styles.detailRowFull}>
            <Text style={styles.detailLabel}>Jadwal Mancing</Text>
            <View style={styles.scheduleRow}>
              <MaterialIcons name="calendar-month" size={20} color="#0a3d61" />
              <Text style={styles.scheduleText}>{ticket.date}</Text>
              <Text style={styles.separator}>|</Text>
              <MaterialIcons name="schedule" size={20} color="#0a3d61" />
              <Text style={styles.scheduleText}>{ticket.time}</Text>
            </View>
          </View>
        </View>

        {ticket.weather && (
          <View style={styles.weatherCard}>
            <View style={[styles.weatherIcon, { backgroundColor: '#FFF' }]}>
              <MaterialIcons name={ticket.weather.icon as any} size={20} color={ticket.weather.color} />
            </View>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTitle}>{ticket.weather.title}</Text>
              <Text style={styles.weatherDescription}>{ticket.weather.description}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.dashedLineContainer}>
        <View style={styles.dashedLineCircleLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.dashedLineCircleRight} />
      </View>

      <View style={styles.ticketBottom}>
        <Text style={styles.qrLabel}>Scan QR Code di Lokasi</Text>
        
        <View style={styles.qrContainer}>
          <ImageBackground
            source={{ uri: ticket.qrCode }}
            style={styles.qrCode}
            imageStyle={styles.qrImageStyle}
          >
            {activeTab === 'riwayat' && (
              <View style={styles.qrOverlay}>
                <MaterialIcons name="check-circle" size={40} color="#22c55e" />
              </View>
            )}
          </ImageBackground>
        </View>

        {ticket.actionButton && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: ticket.actionButton.color }]}
            onPress={() => handleNavigateToLocation(ticket.id)}
            activeOpacity={0.8}
          >
            <MaterialIcons name={ticket.actionButton.icon as any} size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>{ticket.actionButton.text}</Text>
          </TouchableOpacity>
        )}

        {ticket.showCancelButton && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => handleCancelParticipation(ticket.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Batalkan Keikutsertaan</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderHistoryItem = (ticket: HistoryTicket) => (
    <TouchableOpacity key={ticket.id} style={styles.historyCard} activeOpacity={0.7}>
      <View style={styles.historyContent}>
        <View style={styles.historyIcon}>
          <MaterialIcons name="confirmation-number" size={20} color="#9ca3af" />
        </View>
        <View style={styles.historyInfo}>
          <Text style={styles.historyTitle}>{ticket.title}</Text>
          <View style={styles.historyBottomRow}>
            <Text style={styles.historySubtitle}>{ticket.location}</Text>
            <View style={[styles.historyStatus, { backgroundColor: `${ticket.statusColor}20` }]}>
              <Text style={[styles.historyStatusText, { color: ticket.statusColor }]}>
                {ticket.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#0a3d61" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiket Saya</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowMoreOptions(!showMoreOptions)}
        >
          <MaterialIcons name="more-vert" size={24} color="#0a3d61" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'aktif' && styles.activeTabButton]}
          onPress={() => setActiveTab('aktif')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'aktif' && styles.activeTabText]}>Aktif</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'riwayat' && styles.activeTabButton]}
          onPress={() => setActiveTab('riwayat')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'riwayat' && styles.activeTabText]}>Riwayat</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'aktif' ? (
          <>
            {tickets.aktif.map(renderTicketCard)}
            <View style={styles.historySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Riwayat Terakhir</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>Lihat Semua</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.historyList}>
                {tickets.riwayat.map(renderHistoryItem)}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.historyListFull}>
            {tickets.riwayat.map(renderHistoryItem)}
            <View style={styles.emptyHistory}>
              <MaterialIcons name="history" size={60} color="#d1d5db" />
              <Text style={styles.emptyHistoryText}>
                {activeTab === 'riwayat' ? 'Tidak ada riwayat tiket' : 'Tidak ada tiket aktif'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/mapAwal' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="map" size={24} color="rgba(255,255,255,0.6)" style={styles.navTabIcon} />
          <Text style={styles.navTabText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} activeOpacity={0.7}>
          <View style={styles.activeTabIndicator}>
            <View style={styles.activeTabCircle}>
              <MaterialIcons name="confirmation-number" size={30} color="#fff" />
              <View style={styles.tabHighlight} />
            </View>
          </View>
          <Text style={styles.navTabTextActive}>Tiket Saya</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/turnamen' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="emoji-events" size={24} color="rgba(255,255,255,0.6)" style={styles.navTabIcon} />
          <Text style={styles.navTabText}>Turnamen</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/ranking' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="leaderboard" size={24} color="rgba(255,255,255,0.6)" style={styles.navTabIcon} />
          <Text style={styles.navTabText}>Rank</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/feed' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="feed" size={24} color="rgba(255,255,255,0.6)" style={styles.navTabIcon} />
          <Text style={styles.navTabText}>Feed</Text>
        </TouchableOpacity>
      </View>

      {showMoreOptions && (
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowMoreOptions(false)}
          activeOpacity={1}
        >
          <View style={styles.optionsModal}>
            <TouchableOpacity style={styles.optionItem}>
              <MaterialIcons name="share" size={20} color="#0a3d61" />
              <Text style={styles.optionText}>Bagikan Tiket</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <MaterialIcons name="download" size={20} color="#0a3d61" />
              <Text style={styles.optionText}>Simpan PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <MaterialIcons name="support-agent" size={20} color="#0a3d61" />
              <Text style={styles.optionText}>Bantuan</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#f6f7f8', paddingHorizontal: 16, paddingVertical: 12,
  },
  headerButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0a3d61' },
  tabContainer: {
    flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginVertical: 8,
    borderRadius: 16, padding: 4, borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  tabButton: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  activeTabButton: { backgroundColor: '#0a3d61' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  activeTabText: { color: '#FFF', fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 150 },
  ticketCard: {
    marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  ticketTop: {
    backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 20,
  },
  ticketHeader: { marginBottom: 8 },
  ticketTitle: { fontSize: 24, fontWeight: '800', color: '#0a3d61', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  statusBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)', alignSelf: 'flex-start', marginBottom: 20,
  },
  statusText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  ticketDetails: { marginBottom: 20 },
  detailColumn: { marginBottom: 16 },
  detailLabel: {
    fontSize: 11, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 4,
  },
  detailValue: { fontSize: 18, fontWeight: '800', color: '#1f2937' },
  detailRowFull: { marginTop: 8 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  scheduleText: { fontSize: 16, fontWeight: '800', color: '#1f2937' },
  separator: { color: '#d1d5db', marginHorizontal: 4 },
  weatherCard: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f0f9ff',
    padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#dbeafe', gap: 12,
  },
  weatherIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  weatherInfo: { flex: 1 },
  weatherTitle: { fontSize: 14, fontWeight: '800', color: '#0a3d61' },
  weatherDescription: { fontSize: 12, color: '#4b5563', marginTop: 2 },
  dashedLineContainer: {
    height: 32, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', position: 'relative',
  },
  dashedLineCircleLeft: {
    position: 'absolute', left: -16, width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f6f7f8',
    shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  dashedLineCircleRight: {
    position: 'absolute', right: -16, width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f6f7f8',
    shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  dashedLine: {
    flex: 1, height: 2, borderWidth: 1, borderColor: '#d1d5db',
    borderStyle: 'dashed', marginHorizontal: 20, opacity: 0.5,
  },
  ticketBottom: {
    backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    padding: 24, paddingTop: 8, alignItems: 'center',
  },
  qrLabel: {
    fontSize: 12, fontWeight: '500', color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16,
  },
  qrContainer: {
    padding: 12, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#dcfce7',
    borderRadius: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  qrCode: { width: 160, height: 160, borderRadius: 12, backgroundColor: '#f9fafb', overflow: 'hidden' },
  qrImageStyle: { resizeMode: 'contain' },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16, gap: 8,
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  actionButtonText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  cancelButton: { marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  cancelButtonText: { fontSize: 12, fontWeight: '600', color: '#ef4444' },
  historySection: { marginTop: 8 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  seeAllText: { fontSize: 12, fontWeight: '500', color: '#0a3d61' },
  historyList: { gap: 12 },
  historyListFull: { gap: 12, marginTop: 8 },
  historyCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  historyContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '800', color: '#0a3d61' },
  historyBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  historySubtitle: { fontSize: 11, color: '#6b7280', flex: 1 },
  historyStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  historyStatusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  emptyHistory: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyHistoryText: { fontSize: 16, color: '#9ca3af', marginTop: 12, textAlign: 'center' },
  bottomNav: {
    position: 'absolute', bottom: 32, left: 16, right: 16, backgroundColor: '#0A3D62',
    height: 80, borderRadius: 40, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: 8 },
  activeTabIndicator: { position: 'absolute', top: -48, alignItems: 'center' },
  activeTabCircle: {
    width: 64, height: 64, backgroundColor: '#13a4ec', borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#13a4ec', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
    borderWidth: 6, borderColor: '#0A3D62',
  },
  tabHighlight: {
    position: 'absolute', top: 8, right: 8, width: 8, height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, transform: [{ rotate: '45deg' }],
  },
  navTabIcon: { marginBottom: 4 },
  navTabText: {
    fontSize: 9, fontWeight: '500', color: 'rgba(255,255,255,0.6)',
    textAlign: 'center', lineHeight: 12,
  },
  navTabTextActive: {
    color: '#fff', fontWeight: '700', fontSize: 9, textAlign: 'center', lineHeight: 12, marginTop: 36,
  },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', alignItems: 'flex-end',
    paddingTop: 80, paddingRight: 16,
  },
  optionsModal: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 8, minWidth: 180,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  optionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  optionText: { fontSize: 14, color: '#0a3d61', fontWeight: '500' },
});