import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';



interface SpotDetailPopupProps {
    visible: boolean; 
    onClose: () => void; 
  }
  export default function SpotDetailPopup({ visible, onClose }: SpotDetailPopupProps) {
    const router = useRouter();

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
                <Text style={styles.title}>Telaga Berkah</Text>
                <Text style={styles.distance}>
                  <MaterialIcons name="near-me" size={16} color="#13a4ec" /> 3.5 km dari lokasimu
                </Text>
              </View>  
              <View style={styles.ratingBox}>
                <Text style={styles.rating}>4.5</Text>
                <MaterialIcons name="star" size={16} color="#facc15" />
                <Text style={styles.reviewCount}>(120 ulasan)</Text>
              </View>
            </View> 

            {/* Image carousel */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12, marginHorizontal: 12}}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' }}
                    style={{ width: 240, height: 120, borderRadius: 12, marginHorizontal: 4 }}
                />
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
                    style={{ width: 240, height: 120, borderRadius: 12, marginHorizontal: 4 }}
                />
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e' }}
                    style={{ width: 240, height: 120, borderRadius: 12, marginHorizontal: 4 }}
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

            {/* Fasilitas */}
            <Text style={styles.sectionLabel}>Fasilitas</Text>
            <View style={styles.facilities}>
              <Text style={styles.facility}><MaterialIcons name="restaurant" size={14} /> Kantin</Text>
              <Text style={styles.facility}><MaterialIcons name="wc" size={14} /> Toilet</Text>
              <Text style={styles.facility}><MaterialIcons name="phishing" size={14} /> Toko Pancing</Text>
              <Text style={styles.facility}>+3 Lainnya</Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
                style={styles.cta}
                onPress={() => {
                    onClose(); // tutup modal/drawer dulu
                    router.push('/spotbooking'); // navigasi ke halaman booking
                }}
                >
                <Text style={styles.ctaText}>Lihat Detail & Booking</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
          </ScrollView>
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', marginVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#0A3D62' },
  distance: { fontSize: 12, color: '#637888', marginTop: 4 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 14, fontWeight: '700', color: '#facc15', marginRight: 4 },
  reviewCount: { fontSize: 10, color: '#9aaebc', marginLeft: 4 },
  image: { width: 240, height: 120, borderRadius: 12, marginRight: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  infoCardBlue: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', padding: 12, borderRadius: 12, flex: 1, marginRight: 8 },
  infoCardOrange: { backgroundColor: '#fff7ed', padding: 12, borderRadius: 12, flex: 1 },
  infoLabel: { fontSize: 12, color: '#637888' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#111518' },
  progressBar: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, marginTop: 4 },
  progressFill: { width: '60%', height: '100%', backgroundColor: '#FF6B00', borderRadius: 3 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#9aaebc', marginHorizontal: 16, marginTop: 12 },
  facilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16 },
  facility: { fontSize: 12, color: '#374151', backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cta: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B00', marginHorizontal: 16, marginVertical: 16, paddingVertical: 12, borderRadius: 12 },
  ctaText: { color: '#fff', fontWeight: '700', marginRight: 8 },
});