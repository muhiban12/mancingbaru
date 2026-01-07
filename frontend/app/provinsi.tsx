import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProvinceModalProps { 
    visible: boolean;
    onClose: () => void;
    onSelect: (province: string) => void;
  }
  

  const provinces = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau', 
    'Kepulauan Riau',
    'Lampung', 
    'Kalimantan Barat',
    'Kalimantan Timur',
    'Kalimantan Selatan',
    'Sulawesi Selatan',
    'Sulawesi Utara',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Papua',
    'Papua Barat',
  ];

export default function ProvinceModal({ visible, onClose, onSelect }: ProvinceModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = provinces.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Pilih Provinsi</Text>
              <Text style={styles.subtitle}>Tentukan lokasi domisili</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#637888" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <MaterialIcons
              name="search"
              size={20}
              color="#637888"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Cari provinsi..."
              placeholderTextColor="#9aaebc"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* List */}
          <ScrollView style={{ flex: 1 }}>
            {filtered.map((prov) => (
              <TouchableOpacity
              key={prov}
              style={[styles.item, selected === prov && styles.itemSelected]}
              onPress={() => {
                setSelected(prov);
                onSelect(prov);
                // jangan langsung onClose() kalau mau lihat centang dulu
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={selected === prov ? '#2dd4bf' : '#637888'}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.itemText, selected === prov && styles.itemTextSelected]}>{prov}</Text>
              </View>
            
              {selected === prov ? (
                <MaterialIcons name="check-circle" size={22} color="#2dd4bf" />
              ) : (
                <MaterialIcons name="radio-button-unchecked" size={22} color="#ccc" />
              )}
            </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,61,97,0.4)',
    justifyContent: 'flex-end',   // biar nempel bawah
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: '100%',
    maxHeight: '85%',
    minHeight: 500,      // angka px, biar modal pasti kelihatan
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0a3d61' },
  subtitle: { fontSize: 12, color: '#637888' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  searchIcon: { marginRight: 4 },
  searchInput: { flex: 1, height: 40, color: '#0a3d61' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemText: { fontSize: 14, color: '#637888' },
  cancelButton: {
    margin: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: 'rgba(224,242,254,0.4)',
    borderColor: '#2dd4bf',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(45,212,191,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  itemTextSelected: { color: '#0a3d61', fontWeight: '700' },
  cancelText: { color: '#637888', fontWeight: '700' },
});