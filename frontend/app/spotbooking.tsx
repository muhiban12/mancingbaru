import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Modal,  
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TournamentDetailScreen from './detailLomba';
import { useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SpotDetailScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedSeat, setSelectedSeat] = useState('B-6');
  const [duration, setDuration] = useState(3);
  const [startTime, setStartTime] = useState('08:00');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [zoomMap, setZoomMap] = useState(false); 
  const params = useLocalSearchParams();

  const spotData = params.spotData ? JSON.parse(params.spotData as string) : null;
  const spotName = spotData?.name || 'Telaga Berkah';
  const spotLocation = spotData?.location || 'Jl. Mancing No. 5, Bogor';
  const spotRating = spotData?.rating || 4.5;

  const dates = [
    { day: 'Sen', date: 12, active: true },
    { day: 'Sel', date: 13, active: false }, 
    { day: 'Rab', date: 14, active: false },
    { day: 'Kam', date: 15, active: false },
    { day: 'Jum', date: 16, active: false },
  ];
 
  const facilities = [
    { icon: 'restaurant', label: 'Kantin' },
    { icon: 'wc', label: 'Toilet' },
    { icon: 'mosque', label: 'Musholla' },
    { icon: 'wifi', label: 'Wi-Fi' },
    { icon: 'battery-charging-full', label: 'Charger' },
  ];

  const seats = [
    'occupied', 'occupied', 'occupied', 'occupied', 'occupied', 'event',
    'occupied', 'selected', 'occupied', 'occupied', 'event', 'occupied',
    'occupied', 'occupied', 'occupied', 'occupied', 'occupied', 'occupied'
  ];

  const reviews = [
    { 
      initials: 'DS', 
      name: 'Dimas Saputra', 
      time: '2 hari lalu', 
      rating: 5,
      comment: '"Gokil sih spot ini! Ikannya gacor parah, literally gapernah boncos. Facilities-nya juga proper banget buat healing."'
    },
    { 
      initials: 'SW', 
      name: 'Sarah Wijaya', 
      time: '1 minggu lalu', 
      rating: 4,
      comment: '"Tempatnya bersih, toilet wangi. Cuma pas weekend agak crowded ya. But overall worth to try buat family time!"'
    },
    { 
      initials: 'AF', 
      name: 'Andi Fishing', 
      time: '3 minggu lalu', 
      rating: 5,
      comment: '"Hidden gem di Bogor nih. Suasananya tenang, which is good buat ngilangin stress kerjaan."'
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share spot');
  };

  const handleBookNow = () => {
    router.push('/pembayaran');
  };
  const handleWriteReview = () => {
    router.push('/ulasan');
  };

  const handleDecreaseDuration = () => {
    if (duration > 1) setDuration(duration - 1);
  };

  const handleIncreaseDuration = () => {
    if (duration < 12) setDuration(duration + 1);
  };

  const calculateEndTime = () => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <MaterialIcons name="ios-share" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8SQAYsfIpgLMEiDuHjDbqTDQ_7SOJlxGnIigVh1rlCV6Yu5G2fIOfDcxUq5OENvmhjh3Hr-Tdh31rEbxUNfA1F_idDX-ZfHx-Xy5qG8NIuP4FxVkugJg0zscmgAcu7Vz-Bzf24MkunGfF15S29QDIU21WC8sIHysbZsr_79QIRuF-pILGDF9cfmsBBN_UalocLah0QRe3sR7Y-PQ_Zp0xbn-DLQsvyh4OP_rAbG0wJJbOOepoluNYpzUInkQW8sMIqPIpAMvodPQl' }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.imageIndicator}>
              <View style={styles.activeIndicator} />
              <View style={styles.inactiveIndicator} />
              <View style={styles.inactiveIndicator} />
              <View style={styles.inactiveIndicator} />
            </View>
          </ImageBackground>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Title & Rating */}
          <View style={styles.titleSection}>
            <View style={styles.titleLeft}>
              <Text style={styles.title}>Telaga Berkah</Text>
              <View style={styles.location}>
                <MaterialIcons name="location-on" size={18} color="#64748b" />
                <Text style={styles.locationText}>Jl. Mancing No. 5, Bogor</Text>
              </View>
            </View>
            <View style={styles.ratingSection}>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={18} color="#fbbf24" />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
              <Text style={styles.reviewCount}>123 reviews</Text>
            </View>
          </View>

          {/* Weather Card */}
          <View style={styles.weatherCard}>
            <View style={styles.weatherLeft}>
              <View style={styles.weatherIconContainer}>
                <MaterialIcons name="wb-sunny" size={28} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.weatherLabel}>Cuaca Saat Ini</Text>
                <View style={styles.temperatureRow}>
                  <Text style={styles.temperature}>28°C</Text>
                  <Text style={styles.weatherCondition}>Cerah Berawan</Text>
                </View>
              </View>
            </View>
            <View style={styles.weatherRight}>
              <Text style={styles.tomorrowLabel}>Besok</Text>
              <View style={styles.tomorrowWeather}>
                <MaterialIcons name="umbrella" size={16} color="#60a5fa" />
                <Text style={styles.tomorrowText}>Hujan</Text>
              </View>
            </View>
          </View>

          {/* Facilities */}
          <View style={styles.facilitiesSection}>
            <Text style={styles.sectionTitle}>Fasilitas Spot</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.facilitiesScroll}
            >
              {facilities.map((facility, index) => (
                  <View key={index} style={styles.facilityItem}>
                    <View style={styles.facilityIcon}>
                      <MaterialIcons 
                        name={facility.icon as any} // Type assertion
                        size={24} 
                        color="#0a3d61" 
                      />
                    </View>
                    <Text style={styles.facilityLabel}>{facility.label}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <View style={styles.hoursRow}>
              <MaterialIcons name="schedule" size={20} color="#3eb489" />
              <Text style={styles.hoursText}>Buka: 08:00 - 20:00</Text>
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>BUKA</Text>
              </View>
            </View>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 3}>
              Telaga Berkah menawarkan pengalaman mancing yang tenang dengan pemandangan pegunungan. 
              Kolam kami diisi rutin dengan Ikan Mas dan Nila kualitas super. Cocok untuk keluarga.
            </Text>
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.readMore}>
                {showFullDescription ? 'Tutup' : 'Baca Selengkapnya'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tournament Banner */}
          <TouchableOpacity 
            style={styles.tournamentBanner}
            onPress={() => router.push('/detailLomba')}
            activeOpacity={0.8}
          >
            <View style={styles.tournamentOverlay1} />
            <View style={styles.tournamentOverlay2} />
            <View style={styles.tournamentContent}>
              <View style={styles.tournamentIcon}>
                <MaterialIcons name="emoji-events" size={26} color="#FFF" />
              </View>
              <View style={styles.tournamentInfo}>
                <View style={styles.tournamentTitleRow}>
                  <Text style={styles.tournamentTitle}>Ada Lomba!</Text>
                  <View style={styles.hotBadge}>
                    <Text style={styles.hotBadgeText}>HOT</Text>
                  </View>
                </View>
                <Text style={styles.tournamentDate}>Minggu, 15 Okt • Hadiah 5 Juta</Text>
              </View>
            </View>
            <View style={styles.registerButton}>
              <Text style={styles.registerText}>Daftar</Text>
              <MaterialIcons name="chevron-right" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ulasan (Reviews)</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingSummary}>
              <View style={styles.ratingLeft}>
                <Text style={styles.ratingScore}>4.5</Text>
                <View style={styles.starRow}>
                  {[...Array(5)].map((_, i) => (
                    <MaterialIcons 
                      key={i} 
                      name={i < 4.5 ? "star" : "star-half"} 
                      size={14} 
                      color="#fbbf24" 
                    />
                  ))}
                </View>
              </View>
              <View style={styles.ratingRight}>
                <Text style={styles.ratingLabel}>Rating Pengunjung</Text>
                <Text style={styles.ratingQuote}>
                  "Overall experience-nya oke banget, fasilitas proper dan ikannya banyak!"
                </Text>
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.reviewsScroll}
            >
              {reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={[styles.reviewAvatar, 
                      { backgroundColor: index === 0 ? '#3eb48920' : index === 1 ? '#FF6B0010' : '#0a3d6120' }
                    ]}>
                      <Text style={[styles.reviewInitials,
                        { color: index === 0 ? '#3eb489' : index === 1 ? '#FF6B00' : '#0a3d61' }
                      ]}>
                        {review.initials}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <View style={styles.reviewMeta}>
                        <Text style={styles.reviewTime}>{review.time}</Text>
                        <View style={styles.reviewStars}>
                          {[...Array(5)].map((_, i) => (
                            <MaterialIcons 
                              key={i} 
                              name={i < review.rating ? "star" : "star"} 
                              size={12} 
                              color={i < review.rating ? "#fbbf24" : "#d1d5db"} 
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.writeReviewButton}
              onPress={handleWriteReview}
              activeOpacity={0.8}
            >
              <MaterialIcons name="rate-review" size={18} color="#0a3d61" />
              <Text style={styles.writeReviewText}>Tulis Ulasan</Text>
            </TouchableOpacity>
          </View>

          {/* Schedule Selection */}
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Pilih Jadwal & Kursi</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.datesScroll}
            >
              {dates.map((date) => (
                <TouchableOpacity 
                  key={date.date}
                  style={[
                    styles.dateButton,
                    date.active && styles.dateButtonActive
                  ]}
                  onPress={() => setSelectedDate(date.date)}
                >
                  <Text style={[
                    styles.dateDay,
                    date.active && styles.dateDayActive
                  ]}>
                    {date.day}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    date.active && styles.dateNumberActive
                  ]}>
                    {date.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.timeSelection}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>Mulai</Text>
                <View style={styles.timePicker}>
                  <MaterialIcons name="expand-more" size={20} color="#64748b" style={styles.dropdownIcon} />
                  <TouchableOpacity style={styles.timeInput}>
                    <Text style={styles.timeInputText}>{startTime}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>Durasi</Text>
                <View style={styles.durationControl}>
                  <TouchableOpacity 
                    style={styles.durationButton} 
                    onPress={handleDecreaseDuration}
                  >
                    <MaterialIcons name="remove" size={18} color="#0a3d61" />
                  </TouchableOpacity>
                  <Text style={styles.durationText}>{duration} Jam</Text>
                  <TouchableOpacity 
                    style={[styles.durationButton, styles.durationButtonPlus]} 
                    onPress={handleIncreaseDuration}
                  >
                    <MaterialIcons name="add" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.endTime}>
              Selesai Pukul <Text style={styles.endTimeHighlight}>{calculateEndTime()}</Text>
            </Text>
          </View>

          {/* Map Layout */}
          <View style={styles.mapSection}>
            <View style={styles.mapHeader}>
              <Text style={styles.sectionTitle}>Denah Tata Letak Kolam</Text>
              <TouchableOpacity 
                style={styles.zoomButton}
                onPress={() => setZoomMap(true)}
              >
                <MaterialIcons name="zoom-in" size={18} color="#3eb489" />
                <Text style={styles.zoomText}>Perbesar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.mapContainer}
              onPress={() => setZoomMap(true)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM1OWq_pHw0WXxR6Itxxm9f5h3kcXZi0j5SuUdXFW06YGAwW4GpVUfxZicJfbiJ37oCMtzctvdDI-XKsJDw65UIsox-7M0VBK2K_JWxdRMUOdR9qSw5me6vUJex3XncPDuJqdfiutrKUZKrIDEa98qL2pkVTj3e0BMG8RY0wkC4frL6QjjywPd87jvTrK-NecquPGQfUSF0YizMevHw1NLHficECekMnf-IL5mVv9EnEMuB8HZvCkpJOsE99v5e3RklQyIKfzVyYxl' }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay} />
              <View style={styles.mapBadge}>
                <Text style={styles.mapBadgeText}>Bird's Eye View</Text>
              </View>
              <View style={styles.mapHint}>
                <MaterialCommunityIcons name="gesture-tap" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.mapHintText}>Zoomable</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.mapDescription}>
              Gambar denah di atas menunjukkan posisi detail nomor lapak relatif terhadap pintu masuk dan aliran air. 
              Gunakan fitur zoom untuk melihat nomor kursi lebih jelas.
            </Text>
          </View>

          {/* Seat Selection */}
          <View style={styles.seatSection}>
            <View style={styles.seatHeader}>
              <Text style={styles.sectionTitle}>Pilih Lapak</Text>
              <View style={styles.seatLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#3eb489' }]} />
                  <Text style={styles.legendText}>Kosong</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#d1d5db' }]} />
                  <Text style={styles.legendText}>Isi</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#fbbf24' }]} />
                  <Text style={styles.legendText}>Event</Text>
                </View>
              </View>
            </View>

            <View style={styles.seatMapContainer}>
              <View style={styles.poolAreaLabel}>
                <Text style={styles.poolAreaText}>AREA KOLAM</Text>
              </View>
              
              <View style={styles.seatGrid}>
                {seats.map((seat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.seat,
                      seat === 'available' && styles.seatAvailable,
                      seat === 'occupied' && styles.seatOccupied,
                      seat === 'event' && styles.seatEvent,
                      seat === 'selected' && styles.seatSelected,
                    ]}
                    disabled={seat === 'occupied' || seat === 'event'}
                    onPress={() => setSelectedSeat(`B-${index + 1}`)}
                  >
                    {seat === 'occupied' && (
                      <MaterialIcons name="close" size={16} color="#9ca3af" />
                    )}
                    {seat === 'selected' && (
                      <MaterialIcons name="check" size={18} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.selectedSeatText}>
                Lapak yang Anda pilih: <Text style={styles.selectedSeatHighlight}>{selectedSeat}</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bookingBar}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total Harga</Text>
          <Text style={styles.priceValue}>Rp 30.000</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Pesan Sekarang</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Zoom Modal */}
      <Modal
        visible={zoomMap}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomMap(false)}
      >
        <TouchableWithoutFeedback onPress={() => setZoomMap(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.zoomContainer}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM1OWq_pHw0WXxR6Itxxm9f5h3kcXZi0j5SuUdXFW06YGAwW4GpVUfxZicJfbiJ37oCMtzctvdDI-XKsJDw65UIsox-7M0VBK2K_JWxdRMUOdR9qSw5me6vUJex3XncPDuJqdfiutrKUZKrIDEa98qL2pkVTj3e0BMG8RY0wkC4frL6QjjywPd87jvTrK-NecquPGQfUSF0YizMevHw1NLHficECekMnf-IL5mVv9EnEMuB8HZvCkpJOsE99v5e3RklQyIKfzVyYxl' }}
                style={styles.zoomImage}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={styles.closeZoomButton}
                onPress={() => setZoomMap(false)}
              >
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  heroImageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#e5e7eb',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeIndicator: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  inactiveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0a3d61',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  ratingSection: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400e',
  },
  reviewCount: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 24,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherIconContainer: {
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
    color: '#64748b',
    fontWeight: '500',
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  temperature: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0a3d61',
  },
  weatherCondition: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0a3d61',
  },
  weatherRight: {
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: '#bfdbfe',
    paddingLeft: 12,
  },
  tomorrowLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  tomorrowWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tomorrowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0a3d61',
  },
  facilitiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0a3d61',
    marginBottom: 12,
  },
  facilitiesScroll: {
    flexDirection: 'row',
  },
  facilityItem: {
    alignItems: 'center',
    minWidth: 60,
    marginRight: 16,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f6f7f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  facilityLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  descriptionSection: {
    gap: 12,
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a3d61',
  },
  openBadge: {
    backgroundColor: 'rgba(62, 180, 137, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  openBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3eb489',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a3d61',
  },
  tournamentBanner: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  tournamentOverlay1: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tournamentOverlay2: {
    position: 'absolute',
    bottom: -32,
    left: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,107,0,0.1)',
  },
  tournamentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  tournamentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  hotBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF6B00',
  },
  tournamentDate: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-end',
  },
  registerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  reviewsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B00',
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  ratingLeft: {
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#bfdbfe',
    paddingRight: 16,
    marginRight: 16,
  },
  ratingScore: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0a3d61',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  ratingRight: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0a3d61',
    marginBottom: 4,
  },
  ratingQuote: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
  },
  reviewsScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewCard: {
    minWidth: 260,
    backgroundColor: '#f6f7f8',
    padding: 16,
    borderRadius: 16,
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewInitials: {
    fontSize: 12,
    fontWeight: '800',
  },
  reviewName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0a3d61',
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewTime: {
    fontSize: 10,
    color: '#64748b',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
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
    borderColor: 'rgba(10, 61, 97, 0.1)',
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
    color: '#0a3d61',
  },
  scheduleSection: {
    marginBottom: 24,
  },
  datesScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateButton: {
    minWidth: 64,
    height: 72,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateButtonActive: {
    backgroundColor: '#0a3d61',
    borderWidth: 2,
    borderColor: '#0a3d61',
    shadowColor: '#0a3d61',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    opacity: 0.8,
  },
  dateDayActive: {
    color: '#FFF',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0a3d61',
  },
  dateNumberActive: {
    color: '#FFF',
  },
  timeSelection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  timePicker: {
    position: 'relative',
  },
  timeInput: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 36,
  },
  timeInputText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0a3d61',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  durationControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 6,
  },
  durationButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  durationButtonPlus: {
    backgroundColor: '#0a3d61',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0a3d61',
  },
  endTime: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  endTimeHighlight: {
    fontWeight: '800',
    color: '#0a3d61',
  },
  mapSection: {
    marginBottom: 24,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(62, 180, 137, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3eb489',
  },
  mapContainer: {
    aspectRatio: 4/3,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mapHint: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapHintText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  mapDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  seatSection: {
    marginBottom: 32,
  },
  seatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  seatLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    color: '#64748b',
  },
  seatMapContainer: {
    backgroundColor: '#f6f7f8',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  poolAreaLabel: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  poolAreaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0a3d61',
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
    justifyContent: 'center',
  },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  seatAvailable: {
    backgroundColor: '#3eb489',
  },
  seatOccupied: {
    backgroundColor: '#d1d5db',
  },
  seatEvent: {
    backgroundColor: '#fbbf24',
    opacity: 0.8,
  },
  seatSelected: {
    backgroundColor: '#3eb489',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  selectedSeatText: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  selectedSeatHighlight: {
    fontWeight: '800',
    color: '#FF6B00',
  },
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0a3d61',
  },
  bookButton: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
  },
  zoomImage: {
    width: '100%',
    height: '100%',
  },
  closeZoomButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});