import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal, 
  Alert, 
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';

interface FormData { 
  fullName: string;
  whatsappNumber: string;
  ktpFile: string | null;
  selfieFile: string | null;
  spotName: string;
  spotAddress: string;
  openTime: string;
  closeTime: string;
  pricePerHour: string;
  capacity: string;
  facilities: string[];
  spotPhone: string;
  spotDescription: string;
  layoutFile: string | null;
  spotPhotos: string[];
}

export default function UpgradeToOwnerPage() {
  const router = useRouter();

  // State
  const [formData, setFormData] = useState<FormData>({
    fullName: 'Rudi Hartono',
    whatsappNumber: '',
    ktpFile: null,
    selfieFile: null,
    spotName: '',
    spotAddress: '',
    openTime: '',
    closeTime: '',
    pricePerHour: '',
    capacity: '',
    facilities: [],
    spotPhone: '',
    spotDescription: '',
    layoutFile: null,
    spotPhotos: []
  });

  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState<'open' | 'close' | null>(null);

  // Facility options
  const facilityOptions = [
    { id: 'mushola', label: 'Mushola' },
    { id: 'parkir', label: 'Parkir' },
    { id: 'kantin', label: 'Kantin' },
    { id: 'toilet', label: 'Toilet' },
    { id: 'toko-pancing', label: 'Toko Pancing' },
    { id: 'wifi', label: 'Wi-Fi' }
  ];

  // Time options
  const timeOptions = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file picker
  const pickImage = async (field: keyof FormData) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      if (field === 'spotPhotos') {
        setFormData(prev => ({
          ...prev,
          spotPhotos: [...prev.spotPhotos, result.assets[0].uri]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: result.assets[0].uri
        }));
      }
    }
  };

  // Handle facility selection
  const handleFacilityToggle = (facilityId: string) => {
    setFormData(prev => {
      const isSelected = prev.facilities.includes(facilityId);
      return {
        ...prev,
        facilities: isSelected
          ? prev.facilities.filter(id => id !== facilityId)
          : [...prev.facilities, facilityId]
      };
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validation
    if (!formData.whatsappNumber) {
      Alert.alert('Error', 'Nomor WhatsApp harus diisi');
      return;
    }
    if (!formData.ktpFile) {
      Alert.alert('Error', 'Foto KTP harus diupload');
      return;
    }
    if (!formData.selfieFile) {
      Alert.alert('Error', 'Foto selfie dengan KTP harus diupload');
      return;
    }

    console.log('Form submitted:', formData);
    Alert.alert('Sukses', 'Pendaftaran berhasil diajukan!');
    // Navigate back or to next screen
    // router.back();
  };

  // Render input field with icon
  const renderInputField = (
    label: string,
    field: keyof FormData,
    icon: string,
    placeholder: string,
    props?: any
  ) => (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name={icon as any} size={20} color="#0a3d61" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData[field] as string}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          {...props}
        />
      </View>
    </View>
  );

  // Render file upload button
  const renderFileUpload = (
    label: string,
    field: keyof FormData,
    icon: string,
    description: string,
    optional?: boolean
  ) => (
    <View style={styles.group}>
      <Text style={styles.label}>
        {label}
        {optional && <Text style={styles.optionalText}> (Opsional)</Text>}
      </Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage(field)}
      >
        <View style={styles.uploadContent}>
          <View style={styles.uploadIconContainer}>
            <MaterialIcons name={icon as any} size={24} color="#0a3d61" />
          </View>
          <Text style={styles.uploadText}>
            {formData[field] ? 'File terupload ✓' : description}
          </Text>
          {description.includes('Max') && (
            <Text style={styles.uploadSubtext}>JPG, PNG (Max 5MB)</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.page}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upgrade ke Pemilik Spot</Text>
          <View style={{ width: 40 }} /> {/* Spacer for balance */}
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialIcons name="info" size={20} color="#0a3d61" />
          <Text style={styles.infoText}>
            Verifikasi identitas memakan waktu 1-24 jam. Setelah disetujui, Anda dapat mulai mendaftarkan spot pancing Anda.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Data Pribadi</Text>

          {/* Full Name (readonly) */}
          <View style={styles.group}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={[styles.inputContainer, styles.readonlyInput]}>
              <MaterialIcons name="person" size={20} color="#0a3d61" style={styles.inputIcon} />
              <Text style={styles.readonlyText}>{formData.fullName}</Text>
              <MaterialIcons name="check-circle" size={20} color="#10b981" style={styles.checkIcon} />
            </View>
          </View>

          {/* WhatsApp Number */}
          {renderInputField(
            'Nomor WhatsApp',
            'whatsappNumber',
            'chat',
            'Contoh: 08123456789'
          )}

          {/* KTP Upload */}
          {renderFileUpload(
            'Upload Foto KTP',
            'ktpFile',
            'badge',
            'Ketuk untuk upload KTP'
          )}

          {/* Selfie with KTP */}
          {renderFileUpload(
            'Upload Foto Selfie dengan KTP',
            'selfieFile',
            'add-a-photo',
            'Ambil Selfie dengan KTP',
            false
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Fishing Spot Section */}
          <Text style={styles.sectionTitle}>Data Spot Pancing Anda</Text>

          {/* Spot Name */}
          {renderInputField(
            'Nama Spot',
            'spotName',
            'storefront',
            'Contoh: Pemancingan Berkah'
          )}

          {/* Spot Address */}
          <View style={styles.group}>
            <Text style={styles.label}>Alamat Lengkap Spot</Text>
            <View style={styles.textAreaContainer}>
              <MaterialIcons name="location-on" size={20} color="#0a3d61" style={styles.inputIcon} />
              <TextInput
                style={styles.textArea}
                value={formData.spotAddress}
                onChangeText={(text) => handleInputChange('spotAddress', text)}
                placeholder="Jl. Raya Mancing No. 12, Jakarta Selatan"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={() => Alert.alert('Info', 'Pilih lokasi di peta')}>
              <MaterialIcons name="map" size={24} color="#0a3d61" />
              <Text style={styles.mapButtonText}>Pilih Titik Lokasi di Peta</Text>
            </TouchableOpacity>
          </View>

          {/* Operating Hours */}
          <View style={styles.group}>
            <Text style={styles.label}>Jam Operasional</Text>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>Jam Buka</Text>
                <TouchableOpacity 
                  style={styles.timePicker}
                  onPress={() => setShowTimeModal('open')}
                >
                  <MaterialIcons name="schedule" size={20} color="#0a3d61" style={styles.inputIcon} />
                  <Text style={styles.timeText}>
                    {formData.openTime || 'Pilih jam'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.smallLabel}>Jam Tutup</Text>
                <TouchableOpacity 
                  style={styles.timePicker}
                  onPress={() => setShowTimeModal('close')}
                >
                  <MaterialIcons name="schedule" size={20} color="#0a3d61" style={styles.inputIcon} />
                  <Text style={styles.timeText}>
                    {formData.closeTime || 'Pilih jam'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Price and Capacity */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInputField(
                'Harga per Jam',
                'pricePerHour',
                'payments',
                '50.000',
                { keyboardType: 'numeric' }
              )}
            </View>
            <View style={styles.halfInput}>
              {renderInputField(
                'Kapasitas',
                'capacity',
                'chair',
                '20',
                { keyboardType: 'numeric' }
              )}
            </View>
          </View>

          {/* Facilities Dropdown */}
          <View style={styles.group}>
            <Text style={styles.label}>
              Fasilitas <Text style={styles.subLabel}>(Pilih banyak)</Text>
            </Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setIsFacilitiesOpen(!isFacilitiesOpen)}
            >
              <MaterialIcons name="fact-check" size={20} color="#0a3d61" style={styles.inputIcon} />
              <Text style={styles.dropdownText}>
                {formData.facilities.length > 0 
                  ? `${formData.facilities.length} fasilitas dipilih`
                  : 'Pilih fasilitas tersedia...'
                }
              </Text>
              <MaterialIcons 
                name={isFacilitiesOpen ? "expand-less" : "expand-more"} 
                size={24} 
                color="#0a3d61" 
              />
            </TouchableOpacity>

            {isFacilitiesOpen && (
              <View style={styles.facilitiesList}>
                {facilityOptions.map((facility) => (
                  <TouchableOpacity
                    key={facility.id}
                    style={styles.facilityItem}
                    onPress={() => handleFacilityToggle(facility.id)}
                  >
                    <Checkbox
                      value={formData.facilities.includes(facility.id)}
                      onValueChange={() => handleFacilityToggle(facility.id)}
                      color={formData.facilities.includes(facility.id) ? '#2dd4bf' : undefined}
                    />
                    <Text style={styles.facilityText}>{facility.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Spot Phone */}
          {renderInputField(
            'Nomor Telepon Spot',
            'spotPhone',
            'call',
            '021-xxxxxxx'
          )}

          {/* Spot Description */}
          <View style={styles.group}>
            <Text style={styles.label}>Deskripsi Singkat Spot</Text>
            <View style={styles.textAreaContainer}>
              <MaterialIcons name="description" size={20} color="#0a3d61" style={styles.inputIcon} />
              <TextInput
                style={styles.textArea}
                value={formData.spotDescription}
                onChangeText={(text) => handleInputChange('spotDescription', text)}
                placeholder="Ceritakan tentang fasilitas dan keunggulan spot Anda..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Layout Upload */}
          {renderFileUpload(
            'Upload Foto Denah Lokasi',
            'layoutFile',
            'map',
            'Upload Denah / Layout Kolam',
            true
          )}

          {/* Spot Photos Upload */}
          <View style={styles.group}>
            <Text style={styles.label}>Upload Foto Spot</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage('spotPhotos')}
            >
              <View style={styles.uploadContent}>
                <View style={styles.uploadIconContainer}>
                  <MaterialIcons name="add-photo-alternate" size={24} color="#0a3d61" />
                </View>
                <Text style={styles.uploadText}>
                  {formData.spotPhotos.length > 0
                    ? `${formData.spotPhotos.length} foto terpilih`
                    : 'Upload Foto Spot'
                  }
                </Text>
                <Text style={styles.uploadSubtext}>Tampilkan suasana kolam</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Ajukan Pendaftaran Owner & Spot</Text>
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimeModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Pilih Jam {showTimeModal === 'open' ? 'Buka' : 'Tutup'}
            </Text>
            <ScrollView>
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.modalItem}
                  onPress={() => {
                    if (showTimeModal === 'open') {
                      handleInputChange('openTime', time);
                    } else {
                      handleInputChange('closeTime', time);
                    }
                    setShowTimeModal(null);
                  }}
                >
                  <Text style={styles.modalItemText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowTimeModal(null)}
            >
              <Text style={styles.modalCloseText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0a3d61',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  infoBanner: {
    backgroundColor: '#e0f2fe',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: '#0a3d61',
    lineHeight: 18,
    fontWeight: '500',
  },
  formSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a3d61',
    marginBottom: 16,
  },
  group: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a3d61',
    marginBottom: 8,
    marginLeft: 4,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.7,
  },
  optionalText: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111518',
    fontWeight: '500',
  },
  readonlyInput: {
    backgroundColor: '#f3f4f6',
  },
  readonlyText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 8,
  },
  uploadButton: {
    backgroundColor: '#e0f2fe',
    borderWidth: 2,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a3d61',
    textAlign: 'center',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    marginVertical: 24,
    borderStyle: 'dashed',
  },
  textAreaContainer: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
  },
  textArea: {
    flex: 1,
    fontSize: 14,
    color: '#111518',
    fontWeight: '500',
    marginLeft: 32,
    paddingTop: 0,
  },
  mapButton: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a3d61',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0a3d61',
    marginBottom: 4,
    marginLeft: 4,
    opacity: 0.7,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  timeText: {
    flex: 1,
    fontSize: 14,
    color: '#111518',
    fontWeight: '500',
    marginLeft: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 12,
  },
  facilitiesList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  facilityText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#0a3d61',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a3d61',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#0a3d61',
  },
  modalClose: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
  },
});