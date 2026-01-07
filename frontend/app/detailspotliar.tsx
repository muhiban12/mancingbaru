import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,  
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WildSpotDetailScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const imageScrollRef = useRef<FlatList>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const spotData = {
    name: 'Danau Alam Sejuk', 
    type: 'Spot Liar',
    location: 'Lembang, Jawa Barat',
    weather: {
      temperature: '24°C',
      condition: 'Cerah Berawan',
    },
    potential: 'Sangat Baik',
    fishTypes: ['Lele', 'Gabus', 'Nila', 'Tawes'],
    accessibility: [
      {
        icon: 'directions-car',
        title: 'Bisa Masuk Mobil',
        description: 'Parkir tersedia 100m dari bibir danau.',
        color: '#3b82f6',
      },
      {
        icon: 'hiking',
        title: 'Trekking Ringan',
        description: 'Perlu jalan kaki sekitar 5 menit melewati semak.',
        color: '#f97316',
      },
    ],
    description: 'Danau alami yang terletak di kaki bukit dengan air yang jernih dan tenang. Spot ini sangat populer di kalangan pemancing lokal untuk berburu ikan Gabus berukuran besar terutama di pagi hari. Lingkungan sekitar masih sangat asri dan sejuk. Harap bawa perbekalan sendiri karena jauh dari warung.',
    rating: 4.5,
    reviewCount: 24,
    reviews: [
      {
        id: '1',
        name: 'Budi Santoso',
        date: '2 hari yang lalu',
        rating: 4.5,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6uY4zv8qVlb2WpPY0LzjN7_xzd2bVJSGhDTJXRnUem3CwHD1_8BEYquI_qsnrHcL9qsrY3xRWCkUwrElbXgtvKvdnkJODiG0jCB3kPafZn5o9A7ZJHxMTz8d5OX6VYh_UDOFmp0BoFAuXGZQ5K-bdJ4PJoU1BVqDn4IHCyOPV4EZy-iDx2OvOjfhnAWdkZQfrIz1FPoAYsU0VAWimRCXDaQOnbtxbc-s0yDQTuhqOO9pr5D9xKIFsKcLs8KEhuLdO9-FNIGBjbxWh',
        comment: 'Spotnya mantap abis! Airnya tenang, ikan gabusnya gede-gede. Cuma sayang akses jalannya agak licin kalai habis hujan. Overall recommended buat healing tipis-tipis.',
      },
      {
        id: '2',
        name: 'Siti Aminah',
        date: '1 minggu yang lalu',
        rating: 4,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGXAu2RFGeGl1R61rgCwc5wEGeOXIMueTdleKKJfQtOyZNPcE84XmcvOsHfeWEz670ffGn0jZDbdeibPnO8d7267TzLuFf16Y7-DmJR74xZf_sjyt1gekqfpTH8pWpX1ZheVvl5me63yLYW3CwW5VgFWf1gwEKktkAo1GxK2QuKl7mOw5LZdiXO-LCGIA6GpcnGuhPSXd9UNCM65l06wljrEl4vftolMb3g9co1_qlE7nydS54b0Cj12ueLhqaNY90X6qMCj4BfhgW',
        comment: 'Pemandangannya indah banget, cocok bawa keluarga piknik sambil mancing. Tapi ikannya agak susah makan umpan pelet, mending bawa cacing atau lumut.',
      },
      {
        id: '3',
        name: 'Dimas Anggara',
        date: '3 minggu yang lalu',
        rating: 5,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh40tsJtgypsA2QzMY12SODNn1Koh4N9EfOqmd0R01kV6zGs8vylm6NxjoNFNIKYlfU6gSe6kO8gYmRqYocMY0mngCb_zaawm6vR_V_uST0iaZz0lesshc5LYBGwAMpDExwdCpuaQKa7uvgdRE0nsQ_V8toS7ZWAygGYh5SbOtA6ZL_fspeUg7AyID21L1q4_qhALeSclM1tknBj4CU7sVrrGMjepWHzKsKblTszYQ5_TDiPFhQANF9h5lo1NkyqDIZpkCdIK4FFXG',
        comment: 'Hidden gem parah! Gak nyangka deket sini ada spot sesejuk ini. Worth it banget jalan kakinya.',
      },
    ],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAlF4EWLpMpqAdRhqxEjIjcGF46IVXVmDTu6f7YmxNkjHCOKo-GTkvYp41q2-XWjn2P5s0pKop3qDKAs2nn197b2crGrB5xdPI_sZqBGhPzIvC2NOStiGusDkoDPsu88s-ohKElPvg9FvEHAFRgutiksOs7Qrtabq4FrLShjJyIlXksCKBWKS1Nv1vNTbb6VRuretaGdmwXOkk1KKG4cGICKGzVYO_neTvjSXAz7MnYG7O5WnUmz3G_FCNyi8qsATUkPA9fkrrkDxq',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWbJh-cZqgLRhIJeykxKeLoSxRcbBlBf2yyEq8G5Dz0LJgNIXr9g81l8gfYofJqybpSna-BvdQ1IqVsZ2aoriJI69rcb-rpIncASaGy2CeBNOUm1vm7GGKd06DObOHF0Dihl8zje8EsMam9URQQ9lfWPhrM88z0ygWFWVyrnKkjZJ0HoECLMjV_5cRtSrv-5O5mzbP0z6HueqmesgH6HfCt_TdI4n2ZEPCEwVaWYrTck46B_Pnrv9OJ2pCEFjhHzXv3L-5eqZ4WH9E',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDiuouK7r81RBpiZYTCKLM7vf7aaS17ByJRa8p1VlxVt0Pb34QHhztS8NDgK9k6RJXV7wMqNZ4J-Yp6-AMe8gtOOyGEbEsNMtCMOT3jxr4TxQoH_DeHFlYWm5b-d3Ts7I4ynQ6yUdqAk8iDGpgQwW7lkZbsB6RbvpeT9jT-17eTFOz5Vq3aMYjEky_srO3mlTpBz-RleBJAEM91tjTZ14vNztHBvrG1SBCyYblH9oR7wV7tIT7CN5qXLfV9zXDmgVmLOyZ4yx_CpmOd',
    ],
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    Alert.alert('Info', 'Fitur berbagi akan segera hadir!');
  };

  const handleNavigate = () => {
    Alert.alert('Navigasi', 'Aplikasi akan membuka Google Maps untuk mengarahkan ke lokasi.');
    // Implementasi navigasi ke Google Maps atau Apple Maps
  };

  const handleWriteReview = () => {
    router.push('/ulasan');
  };

  const handleImageScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveImageIndex(currentIndex);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons key={`star-${i}`} name="star" size={12} color="#FF6B00" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <MaterialIcons key="star-half" name="star-half" size={12} color="#FF6B00" />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialIcons key={`star-empty-${i}`} name="star-border" size={12} color="#FF6B00" />
      );
    }
    
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Buttons */}
      <BlurView style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" size={20} color="#ffffff" />
        </TouchableOpacity>
      </BlurView>

      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <FlatList
          ref={imageScrollRef}
          data={spotData.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={styles.imageSlide}>
              <Image
                source={{ uri: item }}
                style={styles.spotImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        
        {/* Image Pagination */}
        <View style={styles.pagination}>
          {spotData.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeImageIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Spot Header */}
          <View style={styles.spotHeader}>
            <View style={styles.spotTitleRow}>
              <Text style={styles.spotName}>{spotData.name}</Text>
              <View style={styles.typeBadge}>
                <View style={styles.typeDot} />
                <Text style={styles.typeText}>{spotData.type}</Text>
              </View>
            </View>
            
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={18} color="#13a4ec" />
              <Text style={styles.locationText}>{spotData.location}</Text>
            </View>
          </View>

          {/* Weather Card */}
          <View style={styles.weatherCard}>
            <View style={styles.weatherInfo}>
              <View style={styles.weatherHeader}>
                <MaterialIcons name="sunny" size={20} color="#f97316" />
                <Text style={styles.weatherLabel}>KONDISI CUACA</Text>
              </View>
              <View style={styles.temperatureRow}>
                <Text style={styles.temperature}>{spotData.weather.temperature}</Text>
                <Text style={styles.weatherCondition}>{spotData.weather.condition}</Text>
              </View>
            </View>
            
            <View style={styles.potentialBadge}>
              <Text style={styles.potentialLabel}>Potensi</Text>
              <Text style={styles.potentialValue}>{spotData.potential}</Text>
            </View>
          </View>

          {/* Fish Types */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="phishing" size={18} color="#13a4ec" />
              <Text style={styles.sectionTitle}>Potensi Ikan</Text>
            </View>
            
            <View style={styles.fishTags}>
              {spotData.fishTypes.map((fish, index) => (
                <View key={index} style={styles.fishTag}>
                  <Text style={styles.fishEmoji}>
                    {fish === 'Lele' ? '🐟' : 
                     fish === 'Gabus' ? '🐠' : 
                     fish === 'Nila' ? '🐡' : '🎣'}
                  </Text>
                  <Text style={styles.fishName}>{fish}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Accessibility */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="assist-walker" size={18} color="#13a4ec" />
              <Text style={styles.sectionTitle}>Aksesibilitas</Text>
            </View>
            
            <View style={styles.accessibilityList}>
              {spotData.accessibility.map((item, index) => (
                <View key={index} style={styles.accessibilityItem}>
                  <View style={[styles.accessIcon, { backgroundColor: `${item.color}20` }]}>
                    <MaterialIcons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.accessInfo}>
                    <Text style={styles.accessTitle}>{item.title}</Text>
                    <Text style={styles.accessDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.descriptionTitle}>Deskripsi Spot</Text>
            <Text style={styles.descriptionText}>{spotData.description}</Text>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <View style={styles.reviewsTitleRow}>
                <MaterialIcons name="star" size={18} color="#13a4ec" />
                <Text style={styles.reviewsTitle}>Ulasan (Reviews)</Text>
              </View>
              
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingNumber}>{spotData.rating}</Text>
                <MaterialIcons name="star" size={14} color="#FF6B00" />
                <Text style={styles.reviewCount}>({spotData.reviewCount})</Text>
              </View>
            </View>
            
            {/* Reviews Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.reviewsScroll}
              contentContainerStyle={styles.reviewsContent}
            >
              {spotData.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Image
                        source={{ uri: review.avatar }}
                        style={styles.reviewerAvatar}
                      />
                      <View>
                        <Text style={styles.reviewerName}>{review.name}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.reviewStars}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  
                  <Text style={styles.reviewComment} numberOfLines={3}>
                    {review.comment}
                  </Text>
                </View>
              ))}
            </ScrollView>
            
            {/* Write Review Button */}
            <TouchableOpacity 
              style={styles.writeReviewButton}
              onPress={handleWriteReview}
              activeOpacity={0.7}
            >
              <MaterialIcons name="rate-review" size={16} color="#13a4ec" />
              <Text style={styles.writeReviewText}>Tulis Ulasan</Text>
            </TouchableOpacity>
          </View>

          {/* Navigate Button */}
          <View style={styles.navigateSection}>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={handleNavigate}
              activeOpacity={0.8}
            >
              <MaterialIcons name="navigation" size={20} color="#ffffff" />
              <Text style={styles.navigateButtonText}>Arahkan ke Lokasi</Text>
            </TouchableOpacity>
            
            <Text style={styles.navigateNote}>
              Pastikan kendaraan dalam kondisi prima untuk medan off-road ringan.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <View style={styles.mapIconContainer}>
            <MaterialIcons name="map" size={28} color="#ffffff" />
          </View>
          <Text style={styles.navTextActive}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="confirmation-number" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Tiket Saya</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="emoji-events" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Turnamen</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="leaderboard" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Rank</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="rss-feed" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="person" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // backdropFilter: 'blur(10px)',
  },
  imageContainer: {
    height: 320,
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: 320,
  },
  spotImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  pagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    borderRadius: 2,
  },
  activeDot: {
    width: 24,
    height: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  contentContainer: {
    backgroundColor: '#f6f7f8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  spotHeader: {
    marginBottom: 24,
  },
  spotTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
    lineHeight: 32,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 4,
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  weatherLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  weatherCondition: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  potentialBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
    alignItems: 'flex-end',
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
  fishTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fishTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fishEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  fishName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  accessibilityList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  accessIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessInfo: {
    flex: 1,
  },
  accessTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 2,
  },
  accessDescription: {
    fontSize: 10,
    color: '#6b7280',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
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
  reviewsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  reviewCount: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  reviewsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  reviewsContent: {
    gap: 12,
    paddingRight: 24,
  },
  reviewCard: {
    width: 280,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  reviewDate: {
    fontSize: 10,
    color: '#9ca3af',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#13a4ec',
    marginTop: 12,
  },
  writeReviewText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#13a4ec',
  },
  navigateSection: {
    marginBottom: 40,
  },
  navigateButton: {
    backgroundColor: '#13a4ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#13a4ec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  navigateNote: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 12,
    backgroundColor: '#0A3D62',
    borderRadius: 36,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  mapIconContainer: {
    position: 'absolute',
    top: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A3D62',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navText: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 10,
  },
  navTextActive: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 32,
    textAlign: 'center',
    lineHeight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});