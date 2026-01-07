import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar, 
  Platform,
} from 'react-native'; 
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ChangeProfilePhotoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Data user (bisa dari props atau context) 
  const userData = {
    username: 'mancing_mania',
    currentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5wJEEbn3DeFbI2QtMDJ2lSCJBRDKDKeWA4y5T3CeIIbI7TkC9LN-90BW8SASUYIdltaxphQ9by8iTrbF2xxBUwGPJdE0_tWecC6WMXgft5VwJhr30lxwFRflKCe7sG0MZRZA8OHWFk7dTaOJNVusOJBHHTrgYBMiVjzT6C8z4tu2aQxSkfweV1QCj4Y56L4tx1Yili4Ty0WssHLBCwjn0gbFj5BEXxtgFdnVoMi7TQJF36ZV7iT7x7Lfxj8jfsrpKFbrurJk0uLqv',
    level: 'Angler Level 4',
    location: 'Jakarta, ID',
  };

  const handleBack = () => {
    router.back();
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Kami membutuhkan izin kamera dan galeri untuk mengubah foto profil.'
        );
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Kompres dan resize gambar
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800, height: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        // Simpan foto ke state atau upload ke server
        Alert.alert(
          'Foto Berhasil Diambil',
          'Foto profil Anda telah berhasil diperbarui.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Kompres dan resize gambar
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800, height: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        // Simpan foto ke state atau upload ke server
        Alert.alert(
          'Foto Berhasil Dipilih',
          'Foto profil Anda telah berhasil diperbarui.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error choosing from gallery:', error);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Hapus Foto Profil',
      'Apakah Anda yakin ingin menghapus foto profil?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            // Logika untuk menghapus foto (gunakan foto default)
            Alert.alert(
              'Foto Dihapus',
              'Foto profil telah dihapus.',
              [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Foto Profil</Text>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <MaterialIcons name="settings" size={24} color="#111518" />
        </TouchableOpacity>
      </View>

      {/* Background Content (Blurred) */}
      <View style={styles.backgroundContent}>
        {/* Profile Preview */}
        <View style={styles.profilePreview}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userData.currentAvatar }}
              style={styles.previewAvatar}
            />
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.userDetails}>
              {userData.level} • {userData.location}
            </Text>
          </View>
        </View>

        {/* Form Placeholders */}
        <View style={styles.formPlaceholders}>
          <View style={styles.placeholderField} />
          <View style={styles.placeholderField} />
          <View style={[styles.placeholderField, styles.placeholderTextArea]} />
        </View>
      </View>

      {/* Modal Overlay */}
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Profile Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalAvatarContainer} activeOpacity={0.8}>
              <Image
                source={{ uri: userData.currentAvatar }}
                style={styles.modalAvatar}
              />
              <View style={styles.modalAvatarOverlay}>
                <MaterialIcons name="edit" size={24} color="#ffffff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>Ubah Foto Profil</Text>
              <Text style={styles.modalSubtitle}>{userData.username}</Text>
            </View>
          </View>

          {/* Action List */}
          <View style={styles.actionList}>
            {/* Take Photo */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTakePhoto}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, styles.cameraIcon]}>
                <MaterialIcons name="photo-camera" size={24} color="#1891e7" />
              </View>
              <Text style={styles.actionText}>Ambil Foto</Text>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {/* Choose from Gallery */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChooseFromGallery}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, styles.galleryIcon]}>
                <MaterialIcons name="photo-library" size={24} color="#1891e7" />
              </View>
              <Text style={styles.actionText}>Pilih dari Galeri</Text>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {/* Remove Photo */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRemovePhoto}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, styles.deleteIcon]}>
                <MaterialIcons name="delete" size={24} color="#ef4444" />
              </View>
              <Text style={[styles.actionText, styles.deleteText]}>
                Hapus Foto Saat Ini
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    paddingTop:-55,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111518',
    textAlign: 'center',
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backgroundContent: {
    flex: 1,
    padding: 16,
    opacity: 0.5,
    filter: 'blur(2px)',
  },
  profilePreview: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  previewAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#e5e7eb',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1891e7',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#f6f7f8',
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111518',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  formPlaceholders: {
    gap: 16,
  },
  placeholderField: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  placeholderTextArea: {
    height: 128,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 26, 33, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
  },
  modalHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  modalAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: 'rgba(24, 145, 231, 0.1)',
  },
  modalAvatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111518',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#637888',
    textAlign: 'center',
  },
  actionList: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cameraIcon: {
    backgroundColor: 'rgba(24, 145, 231, 0.1)',
  },
  galleryIcon: {
    backgroundColor: 'rgba(24, 145, 231, 0.1)',
  },
  deleteIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111518',
  },
  deleteText: {
    color: '#ef4444',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#637888',
  },
});