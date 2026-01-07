import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Tournament {
  id: number;
  title: string;
  location: string;
  status: 'open' | 'soon' | 'full';
  statusText: string;
  statusColor: string; 
  statusBgColor: string;
  thumbnail: string;
  date: string;
  time: string;
  prize: string; 
}

export default function TournamentScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('terdekat');

  const tournaments: Tournament[] = [
    {
      id: 1,
      title: 'Galatama Lele Akbar',
      location: 'Telaga Berkah',
      status: 'open',
      statusText: 'Buka',
      statusColor: '#34D399',
      statusBgColor: 'rgba(52, 211, 153, 0.1)',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAlF4EWLpMpqAdRhqxEjIjcGF46IVXVmDTu6f7YmxNkjHCOKo-GTkvYp41q2-XWjn2P5s0pKop3qDKAs2nn197b2crGrB5xdPI_sZqBGhPzIvC2NOStiGusDkoDPsu88s-ohKElPvg9FvEHAFRgutiksOs7Qrtabq4FrLShjJyIlXksCKBWKS1Nv1vNTbb6VRuretaGdmwXOkk1KKG4cGICKGzVYO_neTvjSXAz7MnYG7O5WnUmz3G_FCNyi8qsATUkPA9fkrrkDxq',
      date: '12 Nov',
      time: '08:00',
      prize: 'Rp 5.000.000',
    },
    {
      id: 2,
      title: 'Mancing Mania Harian',
      location: 'Kolam Bahagia',
      status: 'soon',
      statusText: 'Segera',
      statusColor: '#FF6B00',
      statusBgColor: 'rgba(255, 107, 0, 0.1)',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLg_dRj9618Sk4TW9hMxvyfbipl-AL3JFDoEwo-Rb_3xQqH0RPHP-3gq9NLfE619newy3wqHYYnH2aTHX5fYrPW9QFSjAHthCRytfdTptKoyWomwRIRc728ilS8LKUwp1CBmv8cOlYgA-ZZ1dBx2i8V0Z_fxCd547l0upTaRp_as71gMQzp4IJv90PxgOU6kFjE2HQorOFvdPIb2eJOWk2ta7nmddTH0sRmEnfWYIozDvqgrw1SRx5SaOBieUBhiR1P0-G5DvNrDaj',
      date: '18 Nov',
      time: '09:00',
      prize: 'Rp 2.500.000',
    },
    {
      id: 3,
      title: 'Executive Strike',
      location: 'Danau Sunter Indah',
      status: 'full',
      statusText: 'Penuh',
      statusColor: '#6B7280',
      statusBgColor: 'rgba(107, 114, 128, 0.1)',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiuouK7r81RBpiZYTCKLM7vf7aaS17ByJRa8p1VlxVt0Pb34QHhztS8NDgK9k6RJXV7wMqNZ4J-Yp6-AMe8gtOOyGEbEsNMtCMOT3jxr4TxQoH_DeHFlYWm5b-d3Ts7I4ynQ6yUdqAk8iDGpgQwW7lkZbsB6RbvpeT9jT-17eTFOz5Vq3aMYjEky_srO3mlTpBz-RleBJAEM91tjTZ14vNztHBvrG1SBCyYblH9oR7wV7tIT7CN5qXLfV9zXDmgVmLOyZ4yx_CpmOd',
      date: '26 Nov',
      time: '07:00',
      prize: 'Rp 10 Juta',
    },
  ];

  const filters = [
    { id: 'terdekat', label: 'Terdekat', icon: 'near-me' },
    { id: 'minggu-ini', label: 'Minggu Ini', icon: '' },
    { id: 'hadiah-terbesar', label: 'Hadiah Terbesar', icon: '' },
    { id: 'galatama', label: 'Galatama', icon: '' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleViewDetail = (tournamentId: number) => {
    console.log('View detail for tournament:', tournamentId);
    // Navigate to tournament detail screen
    // router.push(`/tournament-detail/${tournamentId}`);
    Alert.alert(
      'Detail Turnamen',
      `Membuka detail untuk: ${tournaments.find(t => t.id === tournamentId)?.title}`,
      [{ text: 'OK' }]
    );
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const renderTournamentCard = (tournament: Tournament) => (
    <TouchableOpacity 
      key={tournament.id}
      style={[
        styles.tournamentCard,
        tournament.status === 'full' && styles.disabledCard
      ]}
      onPress={() => tournament.status !== 'full' && handleViewDetail(tournament.id)}
      activeOpacity={tournament.status === 'full' ? 1 : 0.7}
      disabled={tournament.status === 'full'}
    >
      <View style={[
        styles.statusBadge,
        { backgroundColor: tournament.statusBgColor, borderColor: `${tournament.statusColor}20` }
      ]}>
        <Text style={[styles.statusText, { color: tournament.statusColor }]}>
          {tournament.statusText}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <ImageBackground
          source={{ uri: tournament.thumbnail }}
          style={styles.thumbnail}
          imageStyle={styles.thumbnailImage}
        />
        
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentTitle}>{tournament.title}</Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={14} color="#0A3D62" />
            <Text style={styles.locationText}>{tournament.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Waktu</Text>
          <View style={styles.detailValueRow}>
            <MaterialIcons name="calendar-month" size={16} color="#6B7280" />
            <Text style={styles.detailValue}>{tournament.date}, {tournament.time}</Text>
          </View>
        </View>
        
        <View style={[styles.detailItem, styles.prizeItem]}>
          <Text style={[styles.detailLabel, { color: '#FF6B00' }]}>Total Hadiah</Text>
          <View style={styles.detailValueRow}>
            <MaterialIcons name="emoji-events" size={16} color="#FF6B00" />
            <Text style={[styles.detailValue, { color: '#FF6B00' }]}>{tournament.prize}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.detailButton,
          tournament.status === 'open' && styles.detailButtonPrimary,
          tournament.status === 'soon' && styles.detailButtonOutline,
          tournament.status === 'full' && styles.detailButtonDisabled
        ]}
        onPress={() => handleViewDetail(tournament.id)}
        disabled={tournament.status === 'full'}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.detailButtonText,
          tournament.status === 'open' && styles.detailButtonTextPrimary,
          tournament.status === 'soon' && styles.detailButtonTextOutline,
          tournament.status === 'full' && styles.detailButtonTextDisabled
        ]}>
          {tournament.status === 'full' ? 'Pendaftaran Tutup' : 'Lihat Detail'}
        </Text>
        {tournament.status === 'open' && (
          <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Daftar Lomba Mancing</Text>
            <Text style={styles.headerSubtitle}>Temukan turnamen mancing terbaik</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama lomba atau lokasi..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.7}
            >
              {filter.icon && (
                <MaterialIcons name={filter.icon as any} size={16} color="#0A3D62" />
              )}
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tournament List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tournaments.map(renderTournamentCard)}
        
        {/* Empty State (if no tournaments) */}
        {tournaments.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={60} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Belum Ada Turnamen</Text>
            <Text style={styles.emptyStateText}>
              Tidak ada turnamen yang tersedia saat ini.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation - Sama seperti Map dan Tiket Saya */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/mapAwal' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="map" 
            size={24} 
            color="rgba(255,255,255,0.6)" 
            style={styles.navTabIcon}
          />
          <Text style={styles.navTabText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/tiketsaya' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="confirmation-number" 
            size={24} 
            color="rgba(255,255,255,0.6)" 
            style={styles.navTabIcon}
          />
          <Text style={styles.navTabText}>Tiket</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => {}} // Already on this screen
          activeOpacity={0.7}
        >
          <View style={styles.activeTabIndicator}>
            <View style={styles.activeTabCircle}>
              <MaterialIcons name="emoji-events" size={30} color="#FFF" />
              <View style={styles.tabHighlight} />
            </View>
          </View>
          <Text style={styles.navTabTextActive}>Turnamen</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/ranking' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="leaderboard" 
            size={24} 
            color="rgba(255,255,255,0.6)" 
            style={styles.navTabIcon}
          />
          <Text style={styles.navTabText}>Rank</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => router.replace('/feed' as any)}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="feed" 
            size={24} 
            color="rgba(255,255,255,0.6)" 
            style={styles.navTabIcon}
          />
          <Text style={styles.navTabText}>Feed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: -55,
    backgroundColor: '#f6f7f8',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A3D62',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 48,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0A3D62',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A3D62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filterScroll: {
    marginHorizontal: -16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0A3D62',
    borderColor: '#0A3D62',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150,
  },
  tournamentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.8,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  thumbnailImage: {
    resizeMode: 'cover',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    paddingRight: 60,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  prizeItem: {
    backgroundColor: 'rgba(255, 107, 0, 0.05)',
    borderColor: 'rgba(255, 107, 0, 0.1)',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 12,
    gap: 8,
  },
  detailButtonPrimary: {
    backgroundColor: '#0A3D62',
    shadowColor: '#0A3D62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailButtonOutline: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#0A3D62',
  },
  detailButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailButtonTextPrimary: {
    color: '#FFF',
  },
  detailButtonTextOutline: {
    color: '#0A3D62',
    fontWeight: '700',
  },
  detailButtonTextDisabled: {
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  // Bottom Navigation Styles (Sama seperti Map dan Tiket Saya)
  bottomNav: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#0A3D62',
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 8,
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -48,
    alignItems: 'center',
  },
  activeTabCircle: {
    width: 64,
    height: 64,
    backgroundColor: '#13a4ec',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13a4ec',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 6,
    borderColor: '#0A3D62',
  },
  tabHighlight: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  navTabIcon: {
    marginBottom: 4,
  },
  navTabText: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 12,
  },
  navTabTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
    marginTop: 36,
  },
});