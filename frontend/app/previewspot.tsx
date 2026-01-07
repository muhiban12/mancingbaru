import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Image, 
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SpotDetailPopupProps {
  visible: boolean; 
  onClose: () => void;
  spotData?: any; // Data spot dari MapsScreen
  onBookNow?: (spotId: string) => void; // Callback untuk booking
}

export default function SpotDetailPopup({ 
  visible, 
  onClose, 
  spotData,
  onBookNow 
}: SpotDetailPopupProps) {
  const router = useRouter();

  // Data dari spotData atau default
  const spotName = spotData?.name || 'Telaga Berkah';
  const spotLocation = spotData?.location || 'Jl. Mancing No. 5, Bogor';
  const spotRating = spotData?.rating || 4.5;
  const spotType = spotData?.type || 'commercial';

  const handleBookNow = () => {
    if (spotData && onBookNow) {
      onBookNow(spotData.id);
    } else {
      // Fallback jika tidak ada data
      onClose();
      router.push('/spotbooking');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Drag handle */}
              <View style={styles.handle} />

              <ScrollView showsVerticalScrollIndicator={false}> 
                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={styles.title}>{spotName}</Text>
                    <View style={styles.distanceRow}>
                      <MaterialIcons name="near-me" size={16} color="#13a4ec" />
                      <Text style={styles.distance}>3.5 km dari lokasimu</Text>
                    </View>
                  </View>  
                  <View style={styles.ratingBox}>
                    <Text style={styles.rating}>{spotRating}</Text>
                    <MaterialIcons name="star" size={16} color="#facc15" />
                    <Text style={styles.reviewCount}>(120 ulasan)</Text>
                  </View>
                </View>

                {/* Spot Type Badge */}
                <View style={styles.typeBadge}>
                  <View style={[styles.typeDot, 
                    spotType === 'commercial' ? { backgroundColor: '#13a4ec' } : { backgroundColor: '#34D399' }
                  ]} />
                  <Text style={styles.typeText}>
                    {spotType === 'commercial' ? 'Spot Komersial' : 'Spot Liar'}
                  </Text>
                </View>

                {/* Image carousel */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.imageCarousel}
                >
                  <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8SQAYsfIpgLMEiDuHjDbqTDQ_7SOJlxGnIigVh1rlCV6Yu5G2fIOfDcxUq5OENvmhjh3Hr-Tdh31rEbxUNfA1F_idDX-ZfHx-Xy5qG8NIuP4FxVkugJg0zscmgAcu7Vz-Bzf24MkunGfF15S29QDIU21WC8sIHysbZsr_79QIRuF-pILGDF9cfmsBBN_UalocLah0QRe3sR7Y-PQ_Zp0xbn-DLQsvyh4OP_rAbG0wJJbOOepoluNYpzUInkQW8sMIqPIpAMvodPQl' }}
                    style={styles.image}
                  />
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
                    style={styles.image}
                  />
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e' }}
                    style={styles.image}
                  />
                </ScrollView>

                {/* Info cards */}
                <View style={styles.infoRow}>
                  <View style={styles.infoCardBlue}>
                    <MaterialIcons name="wb-sunny" size={24} color="#13a4ec" />
                    <View>
                      <Text style={styles.infoLabel}>Cuaca</Text>
                      <Text style={styles.infoValue}>Cerah, 28°C</Text>
                    </View>
                  </View>
                  <View style={styles.infoCardOrange}>
                    <Text style={styles.infoLabel}>Crowd Meter</Text>
                    <Text style={styles.infoValue}>Ramai Lancar</Text>
                    <View style={styles.progressBar}>
                      <View style={styles.progressFill} />
                    </View>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.locationCard}>
                  <MaterialIcons name="location-on" size={18} color="#13a4ec" />
                  <Text style={styles.locationText}>{spotLocation}</Text>
                </View>

                {/* Fasilitas (hanya untuk commercial) */}
                {spotType === 'commercial' && (
                  <>
                    <Text style={styles.sectionLabel}>Fasilitas</Text>
                    <View style={styles.facilities}>
                      <View style={styles.facilityItem}>
                        <MaterialIcons name="restaurant" size={14} color="#13a4ec" />
                        <Text style={styles.facilityText}>Kantin</Text>
                      </View>
                      <View style={styles.facilityItem}>
                        <MaterialIcons name="wc" size={14} color="#13a4ec" />
                        <Text style={styles.facilityText}>Toilet</Text>
                      </View>
                      <View style={styles.facilityItem}>
                        <MaterialIcons name="phishing" size={14} color="#13a4ec" />
                        <Text style={styles.facilityText}>Toko Pancing</Text>
                      </View>
                      <Text style={styles.moreFacilities}>+3 Lainnya</Text>
                    </View>
                  </>
                )}

                {/* CTA */}
                <TouchableOpacity
                  style={styles.cta}
                  onPress={handleBookNow}
                >
                  <Text style={styles.ctaText}>Lihat Detail & Booking</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Quick Action Buttons */}
                <View style={styles.quickActions}>
                  <TouchableOpacity style={styles.quickAction}>
                    <MaterialIcons name="share" size={18} color="#64748b" />
                    <Text style={styles.quickActionText}>Bagikan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction}>
                    <MaterialIcons name="favorite-border" size={18} color="#64748b" />
                    <Text style={styles.quickActionText}>Simpan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction}>
                    <MaterialIcons name="directions" size={18} color="#64748b" />
                    <Text style={styles.quickActionText}>Navigasi</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  container: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    maxHeight: '80%' 
  },
  handle: { 
    alignSelf: 'center', 
    width: 40, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#ccc', 
    marginVertical: 8 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#0A3D62',
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: { 
    fontSize: 12, 
    color: '#637888',
  },
  ratingBox: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#92400e', 
    marginRight: 4 
  },
  reviewCount: { 
    fontSize: 10, 
    color: '#9aaebc', 
    marginLeft: 4 
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 164, 236, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#13a4ec',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  imageCarousel: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  image: { 
    width: 240, 
    height: 140, 
    borderRadius: 12, 
    marginRight: 12 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  infoCardBlue: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#e0f2fe', 
    padding: 12, 
    borderRadius: 12, 
    flex: 1, 
    marginRight: 8,
    gap: 8,
  },
  infoCardOrange: { 
    backgroundColor: '#fff7ed', 
    padding: 12, 
    borderRadius: 12, 
    flex: 1 
  },
  infoLabel: { 
    fontSize: 12, 
    color: '#637888' 
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#111518' 
  },
  progressBar: { 
    height: 6, 
    backgroundColor: '#e5e7eb', 
    borderRadius: 3, 
    marginTop: 4 
  },
  progressFill: { 
    width: '60%', 
    height: '100%', 
    backgroundColor: '#FF6B00', 
    borderRadius: 3 
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#9aaebc', 
    marginHorizontal: 16, 
    marginBottom: 8 
  },
  facilities: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginHorizontal: 16,
    marginBottom: 16,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  facilityText: { 
    fontSize: 12, 
    color: '#374151',
  },
  moreFacilities: {
    fontSize: 12,
    color: '#13a4ec',
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cta: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FF6B00', 
    marginHorizontal: 16, 
    marginBottom: 12,
    paddingVertical: 14, 
    borderRadius: 12,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16,
    marginRight: 8 
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    padding: 8,
  },
  quickActionText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
});