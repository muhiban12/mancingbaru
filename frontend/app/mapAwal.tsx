import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ImageBackground, 
  Animated,
  useWindowDimensions,  
} from 'react-native'; 
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SideDrawer from './menusamping';
import FilterPopup from './filterpopup1';
import SpotDetailPopup from './previewspot'; // Import SpotDetailPopup

export default function MapsScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [selectedFilter, setSelectedFilter] = useState('liar');
  const [activeTab, setActiveTab] = useState('map');
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSpotDetail, setShowSpotDetail] = useState(false); // State untuk SpotDetailPopup
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null); // State untuk menyimpan spot ID yang dipilih
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Calculate position function
  const calculatePosition = (percentage: string, isWidth: boolean = true) => {
    const value = parseFloat(percentage);
    const dimension = isWidth ? width : height;
    return (value / 100) * dimension;
  };

  // Memoized map points with calculated positions
  const mapPoints = useMemo(() => [
    { 
      id: '1', 
      name: 'Kolam Bahagia', 
      type: 'commercial', 
      x: calculatePosition('20%'), 
      y: calculatePosition('30%', false), 
      icon: 'storefront' 
    },
    { 
      id: '2', 
      name: 'Sungai Deras', 
      type: 'wild', 
      x: calculatePosition('15%'), 
      y: calculatePosition('45%', false), 
      icon: 'forest' 
    },
    { 
      id: '3', 
      name: 'Telaga Berkah', 
      type: 'featured', 
      x: calculatePosition('48%'), 
      y: calculatePosition('52%', false), 
      icon: 'phishing', 
      rating: 4.5 
    },
  ], [width, height]);

  // Start pulse animation
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const toggleSidebar = () => {
    setShowSideDrawer(true);
  };

  const handleFilterPress = () => {
    setShowFilterPopup(true);
  };

  const handleSpotPress = (spotId: string) => {
    setSelectedSpotId(spotId); // Simpan spot ID yang dipilih
    setShowSpotDetail(true); // Buka SpotDetailPopup modal
    
    // Jika ingin passing data spot berdasarkan ID, bisa tambahkan di sini
    console.log('Spot ID yang dipilih:', spotId);
    
    // Contoh: Tampilkan data berbeda berdasarkan spot ID
    switch(spotId) {
      case '1':
        console.log('Kolam Bahagia - Spot komersial');
        break;
      case '2':
        console.log('Sungai Deras - Spot alam liar');
        break;
      case '3':
        console.log('Telaga Berkah - Spot featured');
        break;
    }
  };

  const handleBookingFromSpotDetail = () => {
    setShowSpotDetail(false); // Tutup SpotDetailPopup
    router.push('/spotbooking'); // Navigasi ke halaman booking
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch(tab) {
      case 'tickets':
        router.push('/tiketsaya');
        break;
      case 'tournament':
        router.push('/turnamen');
        break;
      case 'rank':
        router.push('/ranking');
        break;
      case 'feed':
        router.push('/feed');
        break;
      default:
        break;
    }
  };

  const filters = [
    { id: 'liar', label: 'Liar / Alam', color: '#34D399', icon: 'forest' },
    { id: 'komersial', label: 'Komersial', color: '#13a4ec', icon: 'storefront' },
    { id: 'weather', label: 'Cuaca', color: '#94a3b8', icon: 'cloud' },
  ];

  const navTabs = [
    { id: 'map', label: 'Map', icon: 'map', active: true },
    { id: 'tickets', label: 'Tiket Saya', icon: 'confirmation-number' },
    { id: 'tournament', label: 'Turnamen', icon: 'emoji-events' },
    { id: 'rank', label: 'Rank', icon: 'leaderboard' },
    { id: 'feed', label: 'Feed', icon: 'rss-feed' },
  ];

  return (
    <View style={styles.container}>
      {/* Main Map Background */}
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWbJh-cZqgLRhIJeykxKeLoSxRcbBlBf2yyEq8G5Dz0LJgNIXr9g81l8gfYofJqybpSna-BvdQ1IqVsZ2aoriJI69rcb-rpIncASaGy2CeBNOUm1vm7GGKd06DObOHF0Dihl8zje8EsMam9URQQ9lfWPhrM88z0ygWFWVyrnKkjZJ0HoECLMjV_5cRtSrv-5O5mzbP0z6HueqmesgH6HfCt_TdI4n2ZEPCEwVaWYrTck46B_Pnrv9OJ2pCEFjhHzXv3L-5eqZ4WH9E' }}
        style={styles.mapBackground}
        imageStyle={{ opacity: 0.9 }}
      >
        {/* Top Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent']}
          style={styles.topGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={toggleSidebar}
            activeOpacity={0.7}
          >
            <MaterialIcons name="menu" size={24} color="#334155" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari spot atau lokasi..."
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="tune" size={24} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChips}
          contentContainerStyle={styles.filterChipsContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.7}
            >
              {filter.id !== 'weather' && (
                <View style={[styles.filterDot, { backgroundColor: filter.color }]} />
              )}
              {filter.id === 'weather' && (
                <MaterialIcons name={filter.icon as any} size={16} color={filter.color} />
              )}
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive,
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map Points */}
        {mapPoints.map((point) => (
          <TouchableOpacity
            key={point.id}
            style={[
              styles.mapPoint,
              { 
                left: point.x,
                top: point.y,
              },
              point.type === 'featured' && styles.featuredPoint,
            ]}
            onPress={() => handleSpotPress(point.id)}
            activeOpacity={0.8}
          >
            {/* Point Label */}
            {point.rating && (
              <View style={styles.pointLabel}>
                <Text style={styles.pointName}>{point.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{point.rating}</Text>
                  <MaterialIcons name="star" size={10} color="#f59e0b" />
                </View>
              </View>
            )}

            {/* Point Marker */}
            <Animated.View
              style={[
                styles.pointMarker,
                point.type === 'commercial' && { backgroundColor: '#13a4ec' },
                point.type === 'wild' && { backgroundColor: '#34D399' },
                point.type === 'featured' && styles.featuredMarker,
                point.type === 'featured' && { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <MaterialIcons 
                name={point.icon as any} 
                size={point.type === 'featured' ? 24 : 20} 
                color="#fff" 
              />
              
              {/* Pulse effect for featured point */}
              {point.type === 'featured' && (
                <>
                  <View style={styles.pulseRing1} />
                  <View style={styles.pulseRing2} />
                  <View style={styles.pinShadow} />
                </>
              )}
            </Animated.View>

            {/* Point Name (for non-featured) */}
            {!point.rating && (
              <View style={styles.simpleLabel}>
                <Text style={styles.simpleLabelText}>{point.name}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton} activeOpacity={0.7}>
            <MaterialIcons name="layers" size={20} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton} activeOpacity={0.7}>
            <MaterialIcons name="compass-calibration" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Location Button */}
        <TouchableOpacity style={styles.locationButton} activeOpacity={0.7}>
          <MaterialIcons name="my-location" size={28} color="#13a4ec" />
        </TouchableOpacity>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {navTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.navTab}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              {tab.id === 'map' ? (
                <>
                  <View style={styles.activeTabIndicator}>
                    <View style={styles.activeTabCircle}>
                      <MaterialIcons name="map" size={30} color="#fff" />
                      <View style={styles.tabHighlight} />
                    </View>
                  </View>
                  <Text style={styles.navTabTextActive}>{tab.label}</Text>
                </>
              ) : (
                <>
                  <MaterialIcons 
                    name={tab.icon as any} 
                    size={24} 
                    color={activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)'} 
                    style={styles.navTabIcon}
                  />
                  <Text style={[
                    styles.navTabText,
                    activeTab === tab.id && styles.navTabTextActive
                  ]}>
                    {tab.label}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>

      {/* SideDrawer Modal */}
      <SideDrawer 
        visible={showSideDrawer} 
        onClose={() => setShowSideDrawer(false)} 
      />

      {/* FilterPopup Modal */}
      <FilterPopup
        visible={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
      />

      {/* SpotDetailPopup Modal */}
      <SpotDetailPopup
        visible={showSpotDetail}
        onClose={() => setShowSpotDetail(false)}
      />
    </View>
  );
}

// Styles tetap sama seperti sebelumnya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e3df',
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 128,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    gap: 8,
  },
  menuButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    padding: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChips: {
    position: 'absolute',
    top: 116,
    left: 16,
    right: 16,
  },
  filterChipsContent: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#1e293b',
  },
  mapPoint: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  featuredPoint: {
    zIndex: 20,
  },
  pointLabel: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pointName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f59e0b',
  },
  pointMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#13a4ec',
    shadowColor: '#13a4ec',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  pulseRing1: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#13a4ec',
    opacity: 0.3,
    zIndex: -1,
  },
  pulseRing2: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#13a4ec',
    opacity: 0.15,
    zIndex: -2,
  },
  pinShadow: {
    position: 'absolute',
    bottom: -6,
    width: 12,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 1.5,
    zIndex: -1,
  },
  simpleLabel: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  simpleLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -50 }],
    gap: 12,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButton: {
    position: 'absolute',
    bottom: 128,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
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
  },
});