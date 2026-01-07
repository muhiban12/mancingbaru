import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image, 
  Alert,
  Platform,
} from 'react-native'; 
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function PostStrikeScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    species: '',
    weight: '',
    length: '',
    location: '',
    story: '',
  });

  const locations = [
    { id: '1', name: 'Telaga Berkah Fishing' },
    { id: '2', name: 'Pemancingan Galatama' },
    { id: '3', name: 'Danau Sunter' },
    { id: '4', name: 'Muara Angke' },
  ];

  const handleBack = () => { 
    router.back();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permission to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Validasi form
    if (!selectedImage) {
      Alert.alert('Photo Required', 'Please upload a photo of your catch.');
      return;
    }

    if (!formData.species || !formData.weight || !formData.location) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    // Simulasi post submission
    console.log('Posting strike with data:', { ...formData, image: selectedImage });
    
    Alert.alert(
      'Success!',
      'Your fishing strike has been posted to the feed!',
      [
        {
          text: 'OK',
          onPress: () => router.push('/feed'),
        }
      ]
    );
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f2238" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Posting Hasil Tangkapan</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Upload Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Upload Foto Tangkapan</Text>
          
          <TouchableOpacity 
            style={[
              styles.uploadContainer,
              selectedImage && styles.uploadContainerFilled
            ]}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <View style={styles.uploadIcon}>
                  <MaterialIcons name="add-a-photo" size={40} color="#2bee8c" />
                </View>
                <Text style={styles.uploadText}>Tap to upload photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Species Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Jenis Ikan</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="set-meal" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Ikan Mas, Lele..."
                placeholderTextColor="#94a3b8"
                value={formData.species}
                onChangeText={(text) => handleChange('species', text)}
              />
            </View>
          </View>

          {/* Weight and Length Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Berat</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, { paddingRight: 40 }]}
                  placeholder="0.0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="decimal-pad"
                  value={formData.weight}
                  onChangeText={(text) => handleChange('weight', text)}
                />
                <Text style={styles.unitLabel}>Kg</Text>
              </View>
            </View>

            <View style={{ width: 16 }} />

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Panjang</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, { paddingRight: 40 }]}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  value={formData.length}
                  onChangeText={(text) => handleChange('length', text)}
                />
                <Text style={styles.unitLabel}>Cm</Text>
              </View>
            </View>
          </View>

          {/* Location Select */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lokasi Mancing</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="location-on" size={20} color="#64748b" style={styles.inputIcon} />
              <View style={styles.pickerContainer}>
                <Text style={[
                  styles.pickerText,
                  !formData.location && styles.pickerPlaceholder
                ]}>
                  {formData.location || 'Pilih Lokasi'}
                </Text>
                <MaterialIcons name="expand-more" size={20} color="#64748b" />
              </View>

              
              {/* BARANG KALI NANTI BUAT SCROLLDOWN */}
              
              {/* Location Options Modal (simplified) */} 
              {/* {!formData.location && (
                <View style={styles.locationOptions}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      style={styles.locationOption}
                      onPress={() => handleChange('location', location.name)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.locationOptionText}>{location.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )} */}
            </View>
          </View>

          {/* Story Textarea */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cerita Tangkapan</Text>
            <View style={styles.textareaContainer}>
              <TextInput
                style={styles.textarea}
                placeholder="Ceritakan keseruan saat strike! Umpan apa yang dipakai?"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.story}
                onChangeText={(text) => handleChange('story', text)}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Kirim Post</Text>
          <MaterialIcons name="send" size={20} color="#0f2238" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: -55,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2238',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f2238',
    marginBottom: 12,
    marginLeft: 4,
  },
  uploadContainer: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#f4f6f5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContainerFilled: {
    borderColor: '#2bee8c',
    backgroundColor: 'rgba(43, 238, 140, 0.1)',
    borderStyle: 'solid',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f2238',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: '#f4f6f5',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: '#2bee8c',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f2238',
    paddingVertical: 16,
    paddingRight: 8,
  },
  unitLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    position: 'absolute',
    right: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f2238',
  },
  pickerPlaceholder: {
    color: '#94a3b8',
  },
  locationOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  locationOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  locationOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f2238',
  },
  textareaContainer: {
    backgroundColor: '#f4f6f5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textarea: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f2238',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2bee8c',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2bee8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2238',
  },
});