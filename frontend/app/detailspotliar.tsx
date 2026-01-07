import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WildSpotDetailScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [zoomMap, setZoomMap] = useState(false);

  // Data images for carousel
  const images = [
    { id: '1', uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAlF4EWLpMpqAdRhqxEjIjcGF46IVXVmDTu6f7YmxNkjHCOKo-GTkvYp41q2-XWjn2P5s0pKop3qDKAs2nn197b2crGrB5xdPI_sZqBGhPzIvC2NOStiGusDkoDPsu88s-ohKElPvg9FvEHAFRgutiksOs7Qrtabq4FrLShjJyIlXksCKBWKS1Nv1vNTbb6VRuretaGdmwXOkk1KKG4cGICKGzVYO_neTvjSXAz7MnYG7O5WnUmz3G_FCNyi8qsATUkPA9fkrrkDxq' },
    { id: '2', uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWbJh-cZqgLRhIJeykxKeLoSxRcbBlBf2yyEq8G5Dz0LJgNIXr9g81l8gfYofJqybpSna-BvdQ1IqVsZ2aoriJI69rcb-rpIncASaGy2CeBNOUm1vm7GGKd06DObOHF0Dihl8zje8EsMam9URQQ9lfWPhrM88z0ygWFWVyrnKkjZJ0HoECLMjV_5cRtSrv-5O5mzbP0z6HueqmesgH6HfCt_TdI4n2ZEPCEwVaWYrTck46B_Pnrv9OJ2pCEFjhHzXv3L-5eqZ4WH9E' },
    { id: '3', uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiuouK7r81RBpiZYTCKLM7vf7aaS17ByJRa8p1VlxVt0Pb34QHhztS8NDgK9k6RJXV7wMqNZ4J-Yp6-AMe8gtOOyGEbEsNMtCMOT3jxr4TxQoH_DeHFlYWm5b-d3Ts7I4ynQ6yUdqAk8iDGpgQwW7lkZbsB6RbvpeT9jT-17eTFOz5Vq3aMYjEky_srO3mlTpBz-RleBJAEM91tjTZ14vNztHBvrG1SBCyYblH9oR7wV7tIT7CN5qXLfV9zXDmgVmLOyZ4yx_CpmOd' },
  ];

  // Fish species data
  const fishSpecies = [
    { id: '1', name: 'Lele', emoji: '🐟' },
    { id: '2', name: 'Gabus', emoji: '🐠' },
    { id: '3', name: 'Nila', emoji: '🐡' },
    { id: '4', name: 'Tawes', emoji: '🎣' },
  ];

  // Accessibility data
  const accessibility = [
    {
      id: '1',
      icon: 'directions-car',
      title: 'Bisa Masuk Mobil',
      description: 'Parkir tersedia 100m dari bibir danau.',
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      id: '2',
      icon: 'hiking',
      title: 'Trekking Ringan',
      description: 'Perlu jalan kaki sekitar 5 menit melewati semak.',
      color: '#f97316',
      bgColor: '#fed7aa',
    },
  ];

  // Reviews data
  const reviews = [
    {
      id: '1',
      name: 'Budi Santoso',
      time: '2 hari yang lalu',
      rating: 4.5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6uY4zv8qVlb2WpPY0LzjN7_xzd2bVJSGhDTJXRnUem3CwHD1_8BEYquI_qsnrHcL9qsrY3xRWCkUwrElbXgtvKvdnkJODiG0jCB3kPafZn5o9A7ZJHxMTz8d5OX6VYh_UDOFmp0BoFAuXGZQ5K-bdJ4PJoU1BVqDn4IHCyOPV4EZy-iDx2OvOjfhnAWdkZQfrIz1FPoAYsU0VAWimRCXDaQOnbtxbc-s0yDQTuhqOO9pr5D9xKIFsKcLs8KEhuLdO9-FNIGBjbxWh',
      comment: 'Spotnya mantap abis! Airnya tenang, ikan gabusnya gede-gede. Cuma sayang akses jalannya agak licin kalau habis hujan. Overall recommended buat healing tipis-tipis.',
    },
    {
      id: '2',
      name: 'Siti Aminah',
      time: '1 minggu yang lalu',
      rating: 4,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGXAu2RFGeGl1R61rgCwc5wEGeOXIMueTdleKKJfQtOyZNPcE84XmcvOsHfeWEz670ffGn0jZDbdeibPnO8d7267TzLuFf16Y7-DmJR74xZf_sjyt1gekqfpTH8pWpX1ZheVvl5me63yLYW3CwW5VgFWf1gwEKktkAo1GxK2QuKl7mOw5LZdiXO-LCGIA6GpcnGuhPSXd9UNCM65l06wljrEl4vftolMb3g9co1_qlE7nydS54b0Cj12ueLhqaNY90X6qMCj4BfhgW',
      comment: 'Pemandangannya indah banget, cocok bawa keluarga piknik sambil mancing. Tapi ikannya agak susah makan umpan pelet, mending bawa cacing atau lumut.',
    },
    {
      id: '3',
      name: 'Dimas Anggara',
      time: '3 minggu yang lalu',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh40tsJtgypsA2QzMY12SODNn1Koh4N9EfOqmd0R01kV6zGs8vylm6NxjoNFNIKYlfU6gSe6kO8gYmRqYocMY0mngCb_zaawm6vR_V_uST0iaZz0lesshc5LYBGwAMpDExwdCpuaQKa7uvgdRE0nsQ_V8toS7ZWAygGYh5SbOtA6ZL_fspeUg7AyID21L1q4_qhALeSclM1tknBj4CU7sVrrGMjepWHzKsKblTszYQ5_TDiPFhQANF9h5lo1NkyqDIZpkCdIK4FFXG',
      comment: 'Hidden gem parah! Gak nyangka deket sini ada spot sesejuk ini. Worth it banget jalan kakinya.',
    },
  ];

  // Bottom navigation tabs
  const navTabs = [
    { id: 'map', label: 'Map', icon: 'map', active: true },
    { id: 'tickets', label: 'Tiket Saya', icon: 'confirmation-number' },
    { id: 'tournament', label: 'Turnamen', icon: 'emoji-events' },
    { id: 'rank', label: 'Rank', icon: 'leaderboard' },
    { id: 'feed', label: 'Feed', icon: 'rss-feed' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    console.log('Share spot');
  };

  const handleNavigate = () => {
    console.log('Navigate to location');
    // In real app, open maps with coordinates
  };

  const handleWriteReview = () => {
    router.push('/ulasan');
  };

  const handleTabPress = (tabId: string) => {
    switch(tabId) {
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
      case 'profile':
        router.push('/editprofile1');
        break;
      default:
        break;
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <MaterialIcons key={i} name="star" size={12} color="#FF6B00" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <MaterialIcons key={i} name="star-half" size={12} color="#FF6B00" />
        );
      } else {
        stars.push(
          <MaterialIcons key={i} name="star-border" size={12} color="#FF6B00" />
        );
      }
    }
    return stars;
  };

  const renderImageCarousel = () => (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={scrollRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <ImageBackground
              source={{ uri: item.uri }}
              style={styles.carouselImage}
            >
              <View style={styles.imageGradient} />
            </ImageBackground>
          </View>
        )}
        onScroll={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
      />
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex ? styles.activeIndicator : styles.inactiveIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <MaterialIcons name="share" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Carousel */}
        {renderImageCarousel()}

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Title & Spot Type Badge */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Danau Alam Sejuk</Text>
              <View style={styles.spotTypeBadge}>
                <View style={styles.spotTypeDot} />
                <Text style={styles.spotTypeText}>Spot Liar</Text>
              </View>
            </View>
            <View style={styles.location}>
              <MaterialIcons name="location-on" size={18} color="#13a4ec" />
              <Text style={styles.locationText}>Lembang, Jawa Barat</Text>
            </View>
          </View>

          {/* Weather & Potential Card */}
          <View style={styles.weatherCard}>
            <View style={styles.weatherLeft}>
              <View style={styles.weatherIcon}>
                <MaterialIcons name="wb-sunny" size={24} color="#f97316" />
              </View>
              <View>
                <Text style={styles.weatherLabel}>Kondisi Cuaca</Text>
                <View style={styles.temperatureRow}>
                  <Text style={styles.temperature}>24°C</Text>
                  <Text style={styles.weatherCondition}>Cerah Berawan</Text>
                </View>
              </View>
            </View>
            <View style={styles.potentialBadge}>
              <Text style={styles.potentialLabel}>Potensi</Text>
              <Text style={styles.potentialValue}>Sangat Baik</Text>
            </View>
          </View>

          {/* Fish Potential */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="phishing" size={20} color="#13a4ec" />
              <Text style={styles.sectionTitle}>Potensi Ikan</Text>
            </View>
            <View style={styles.fishContainer}>
              {fishSpecies.map((fish) => (
                <View key={fish.id} style={styles.fishItem}>
                  <Text style={styles.fishEmoji}>{fish.emoji}</Text>
                  <Text style={styles.fishName}>{fish.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Accessibility */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="assist-walker" size={20} color="#13a4ec" />
              <Text style={styles.sectionTitle}>Aksesibilitas</Text>
            </View>
            <View style={styles.accessibilityCard}>
              {accessibility.map((item) => (
                <View key={item.id} style={styles.accessibilityItem}>
                  <View style={[styles.accessibilityIcon, { backgroundColor: item.bgColor }]}>
                    <MaterialIcons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.accessibilityInfo}>
                    <Text style={styles.accessibilityTitle}>{item.title}</Text>
                    <Text style={styles.accessibilityDesc}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi Spot</Text>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 4}>
              Danau alami yang terletak di kaki bukit dengan air yang jernih dan tenang. Spot ini sangat populer di kalangan pemancing lokal untuk berburu ikan Gabus berukuran besar terutama di pagi hari. Lingkungan sekitar masih sangat asri dan sejuk. Harap bawa perbekalan sendiri karena jauh dari warung.
            </Text>
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.readMore}>
                {showFullDescription ? 'Tutup' : 'Baca Selengkapnya'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <View style={styles.reviewsTitleRow}>
                <MaterialIcons name="star" size={20} color="#13a4ec" />
                <Text style={styles.sectionTitle}>Ulasan (Reviews)</Text>
              </View>
              <View style={styles.ratingSummary}>
                <Text style={styles.ratingNumber}>4.5</Text>
                <MaterialIcons name="star" size={16} color="#FF6B00" />
                <Text style={styles.reviewCount}>(24)</Text>
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.reviewsScroll}
            >
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Image
                        source={{ uri: review.avatar }}
                        style={styles.avatar}
                      />
                      <View>
                        <Text style={styles.reviewerName}>{review.name}</Text>
                        <Text style={styles.reviewTime}>{review.time}</Text>
                      </View>
                    </View>
                    <View style={styles.reviewStars}>
                      {renderStarRating(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewComment} numberOfLines={3}>
                    {review.comment}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.writeReviewButton}
              onPress={handleWriteReview}
              activeOpacity={0.8}
            >
              <MaterialIcons name="rate-review" size={18} color="#13a4ec" />
              <Text style={styles.writeReviewText}>Tulis Ulasan</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Button */}
          <View style={styles.navigationSection}>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={handleNavigate}
              activeOpacity={0.8}
            >
              <MaterialIcons name="navigation" size={24} color="#FFF" />
              <Text style={styles.navigateText}>Arahkan ke Lokasi</Text>
            </TouchableOpacity>
            <Text style={styles.navigationHint}>
              Pastikan kendaraan dalam kondisi prima untuk medan off-road ringan.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carouselContainer: {
    width: '100%',
    height: 320,
  },
  carouselItem: {
    width,
    height: 320,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    borderRadius: 2,
  },
  activeIndicator: {
    width: 24,
    height: 6,
    backgroundColor: '#FFF',
  },
  inactiveIndicator: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  contentContainer: {
    backgroundColor: '#f6f7f8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  spotTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  spotTypeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  spotTypeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherIcon: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  weatherCondition: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  potentialBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  potentialLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 2,
  },
  potentialValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803d',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  fishContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fishItem: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fishEmoji: {
    fontSize: 16,
  },
  fishName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  accessibilityCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  accessibilityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessibilityInfo: {
    flex: 1,
  },
  accessibilityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  accessibilityDesc: {
    fontSize: 10,
    color: '#64748b',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#13a4ec',
    marginTop: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  reviewCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  reviewsScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewCard: {
    width: 280,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  reviewTime: {
    fontSize: 10,
    color: '#94a3b8',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  writeReviewButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(19, 164, 236, 0.2)',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  writeReviewText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#13a4ec',
  },
  navigationSection: {
    marginBottom: 32,
  },
  navigateButton: {
    width: '100%',
    backgroundColor: '#13a4ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#13a4ec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  navigateText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  navigationHint: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 12,
    backgroundColor: '#0A3D62',
    height: 72,
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
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
    paddingTop: 4,
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -28,
    alignItems: 'center',
  },
  activeTabCircle: {
    width: 56,
    height: 56,
    backgroundColor: '#0A3D62',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#0A3D62',
  },
  navTabText: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 12,
    marginTop: 4,
  },
  navTabTextActive: {
    color: '#FFF',
    fontWeight: '800',
    marginTop: 28,
  },
});