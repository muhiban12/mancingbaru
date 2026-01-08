import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface FilterPopupProps { 
  visible: boolean; 
  onClose: () => void;
} 

export default function FilterPopup({ visible, onClose }: FilterPopupProps) {
  const [spotType, setSpotType] = useState<'komersial' | 'liar'>('liar');
  const [selectedFish, setSelectedFish] = useState<string[]>(['Lele']);
  const [distance, setDistance] = useState(15);
  const [facilities, setFacilities] = useState<string[]>(['Toilet']);

  const toggleFish = (fish: string) => {
    setSelectedFish(prev =>
      prev.includes(fish) ? prev.filter(f => f !== fish) : [...prev, fish]
    );
  };

  const toggleFacility = (facility: string) => {
    setFacilities(prev =>
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}> 
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter Lokasi Mancing</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={20} color="#637888" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Tipe Spot */}
            <Text style={styles.sectionTitle}>Tipe Spot</Text>
            <View style={styles.spotTypeBox}>
              <TouchableOpacity
                style={[
                  styles.spotOption,
                  spotType === 'liar' && styles.spotOptionActive
                ]}
                onPress={() => setSpotType('liar')}
              >
                <MaterialIcons name="forest" size={20} color={spotType === 'liar' ? '#34D399' : '#9aaebc'} />
                <Text style={styles.spotText}>Alam Liar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.spotOption,
                  spotType === 'komersial' && styles.spotOptionActive
                ]}
                onPress={() => setSpotType('komersial')}
              >
                <MaterialIcons name="storefront" size={20} color={spotType === 'komersial' ? '#13a4ec' : '#9aaebc'} />
                <Text style={styles.spotText}>Komersial</Text>
              </TouchableOpacity>
            </View>

            {/* Potensi Ikan */}
            {spotType === 'liar' && (
              <>
                <Text style={styles.sectionTitle}>Filter Potensi Ikan</Text>
                {['Ikan Mas','Lele','Gabus','Nila','Bawal','Patin'].map(fish => (
                  <TouchableOpacity key={fish} style={styles.option} onPress={() => toggleFish(fish)}>
                    <MaterialIcons
                      name={selectedFish.includes(fish) ? 'check-box' : 'check-box-outline-blank'}
                      size={20}
                      color={selectedFish.includes(fish) ? '#34D399' : '#9aaebc'}
                    />
                    <Text style={styles.optionText}>{fish}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Jarak Maksimal */}
            <Text style={styles.sectionTitle}>Jarak Maksimal</Text>
            <Slider
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={distance}
              onValueChange={setDistance}
              minimumTrackTintColor="#FF6B00"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#FF6B00"
            />
            <Text style={styles.distanceLabel}>{distance} km</Text>

            {/* Fasilitas */}
            <Text style={styles.sectionTitle}>Fasilitas</Text>
            {['Kantin','Toilet','Toko Pancing','Musholla','Wi-Fi'].map(fac => (
              <TouchableOpacity key={fac} style={styles.option} onPress={() => toggleFacility(fac)}>
                <MaterialIcons
                  name={facilities.includes(fac) ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={facilities.includes(fac) ? '#13a4ec' : '#9aaebc'}
                />
                <Text style={styles.optionText}>{fac}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSpotType('liar');
                setSelectedFish([]);
                setFacilities([]);
                setDistance(15);
              }}
            >
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyText}>Terapkan Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.6)',
    justifyContent:'flex-end',
  },
  container: {
    backgroundColor:'#fff',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    width:'100%',
    maxHeight:'85%',
    minHeight:500,
    paddingTop: 12,
  },
  header: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:16,
    borderBottomWidth:1,
    borderColor:'#e5e7eb'
  },
  title: {
    fontSize:16,
    fontWeight:'700',
    color:'#111518'
  },
  sectionTitle: {
    fontSize:14,
    fontWeight:'600',
    marginTop:12,
    marginLeft:16,
    color:'#111518',
  },
  option: {
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:16,
    paddingVertical:8
  },
  optionText: {
    marginLeft:8,
    fontSize:14,
    color:'#374151'
  },
  distanceLabel: {
    textAlign:'right',
    marginRight:16,
    fontSize:12,
    fontWeight:'700',
    color:'#FF6B00'
  },
  footer: {
    flexDirection:'row',
    justifyContent:'space-between',
    padding:16,
    borderTopWidth:1,
    borderColor:'#e5e7eb'
  },
  resetButton: {
    flex:1,
    marginRight:8,
    backgroundColor:'#fff',
    borderWidth:1,
    borderColor:'#e5e7eb',
    borderRadius:8,
    alignItems:'center',
    paddingVertical:10
  },
  resetText: {
    color:'#374151',
    fontWeight:'700'
  },
  applyButton: {
    flex:1,
    marginLeft:8,
    backgroundColor:'#FF6B00',
    borderRadius:8,
    alignItems:'center',
    paddingVertical:10
  },
  applyText: {
    color:'#fff',
    fontWeight:'700'
  },
  spotTypeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 2,
    paddingTop: 12,
  },
  spotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    flex: 1,
    marginHorizontal: 4,
  },
  spotOptionActive: {
    borderColor: '#13a4ec',
    backgroundColor: '#e0f2fe',
  },
  spotText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});