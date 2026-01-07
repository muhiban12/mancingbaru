import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  StatusBar,
  ImageBackground, 
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';


export default function WriteReviewScreen() {
  const router = useRouter(); 
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState(''); 
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Data spot dari props atau context
  const spotData = {
    name: 'Danau Alam Sejuk',
    type: 'Spot Liar',
    location: 'Lembang, Jawa Barat',
    temperature: '24°C',
    weather: 'Cerah Berawan',
    potential: 'Sangat Baik',
    fishTypes: ['Lele', 'Gabus'],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAlF4EWLpMpqAdRhqxEjIjcGF46IVXVmDTu6f7YmxNkjHCOKo-GTkvYp41q2-XWjn2P5s0pKop3qDKAs2nn197b2crGrB5xdPI_sZqBGhPzIvC2NOStiGusDkoDPsu88s-ohKElPvg9FvEHAFRgutiksOs7Qrtabq4FrLShjJyIlXksCKBWKS1Nv1vNTbb6VRuretaGdmwXOkk1KKG4cGICKGzVYO_neTvjSXAz7MnYG7O5WnUmz3G_FCNyi8qsATUkPA9fkrrkDxq',
    ],
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    Alert.alert('Info', 'Fitur berbagi akan segera hadir!');
  };

  const handleRatingPress = (starCount: number) => {
    setRating(starCount);
  };

  const handleAddPhoto = async () => {
    if (uploadedImages.length >= 3) {
      Alert.alert('Maksimal Foto', 'Anda hanya dapat mengupload maksimal 3 foto.');
      return;
    }

    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploadedImages([...uploadedImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      Alert.alert('Error', 'Gagal memilih foto. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (libraryStatus.status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Kami membutuhkan izin galeri untuk mengupload foto.'
        );
        return false;
      }
    }
    return true;
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      Alert.alert('Peringatan', 'Silakan tulis ulasan terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    
    // Simulasi pengiriman data
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Ulasan Terkirim!',
        'Terima kasih telah berbagi pengalaman Anda.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCloseModal = () => {
    router.back();
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 5: return 'Luar Biasa!';
      case 4: return 'Sangat Bagus!';
      case 3: return 'Bagus';
      case 2: return 'Cukup';
      case 1: return 'Buruk';
      default: return 'Beri Rating';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      
      {/* Background Blurred Content */}
      <View style={styles.backgroundContent}>
        {/* Header */}
        <View style={styles.backgroundHeader}>
        <BlurView>
          <TouchableOpacity 
            style={styles.backgroundBackButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          </BlurView>
          <TouchableOpacity 
            style={styles.backgroundShareButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="share" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Image Slider */}
        <ImageBackground
          source={{ uri: spotData.images[0] }}
          style={styles.backgroundImage}
        >
          <View style={styles.imageOverlay} />
          <View style={styles.imagePagination}>
            <View style={styles.activeDot} />
            <BlurView style={styles.inactiveDot} />
            <BlurView style={styles.inactiveDot} />
          </View>
        </ImageBackground>

        {/* Spot Details */}
        <View style={styles.spotDetails}>
          <View style={styles.spotHeader}>
            <Text style={styles.spotName}>{spotData.name}</Text>
            <View style={styles.spotTypeBadge}>
              <View style={styles.spotTypeDot} />
              <Text style={styles.spotTypeText}>{spotData.type}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={18} color="#13a4ec" />
            <Text style={styles.locationText}>{spotData.location}</Text>
          </View>

          <View style={styles.weatherCard}>
            <View style={styles.weatherInfo}>
              <View style={styles.weatherHeader}>
                <MaterialIcons name="sunny" size={20} color="#f97316" />
                <Text style={styles.weatherLabel}>Kondisi Cuaca</Text>
              </View>
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{spotData.temperature}</Text>
                <Text style={styles.weatherDescription}>{spotData.weather}</Text>
              </View>
            </View>
            
            <View style={styles.potentialBadge}>
              <Text style={styles.potentialLabel}>Potensi</Text>
              <Text style={styles.potentialValue}>{spotData.potential}</Text>
            </View>
          </View>

          <View style={styles.fishSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="phishing" size={18} color="#13a4ec" />
              <Text style={styles.sectionTitle}>Potensi Ikan</Text>
            </View>
            
            <View style={styles.fishTags}>
              {spotData.fishTypes.map((fish, index) => (
                <View key={index} style={styles.fishTag}>
                  <Text style={styles.fishEmoji}>🐟</Text>
                  <Text style={styles.fishName}>{fish}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Modal Review */}
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>Tulis Ulasan Anda</Text>
              <Text style={styles.modalSubtitle}>
                Bagikan pengalaman seru di spot ini
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionLabel}>Rating Spot</Text>
              
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={styles.starButton}
                    onPress={() => handleRatingPress(star)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="star"
                      size={36}
                      color={star <= rating ? "#FF6B00" : "#e2e8f0"}
                      style={styles.starIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
            </View>

            {/* Comment Section */}
            <View style={styles.commentSection}>
              <Text style={styles.sectionLabel}>Bagikan Pengalaman Anda</Text>
              
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Ceritakan kondisi air, umpan jitu, atau tips akses ke lokasi..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Photo Upload Section */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionLabel}>Upload Foto (Opsional)</Text>
              
              <View style={styles.photoGrid}>
                {/* Add Photo Button */}
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add-a-photo" size={24} color="#13a4ec" />
                  <Text style={styles.addPhotoText}>Tambah</Text>
                </TouchableOpacity>

                {/* Uploaded Photos */}
                {uploadedImages.map((uri, index) => (
                  <View key={index} style={styles.photoPreview}>
                    <Image
                      source={{ uri }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => handleRemoveImage(index)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="close" size={12} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Kirim Ulasan</Text>
              <MaterialIcons name="send" size={18} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
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
  },
  backgroundContent: {
    flex: 1,
    opacity: 0.5,
    filter: 'blur(2px)',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  backgroundHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    zIndex: 20,
  },
  backgroundBackButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    overflow: 'hidden', // clip konten blur
  },
  backgroundShareButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    overflow: 'hidden', // clip konten blur
  },
  backgroundImage: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  imagePagination: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -25 }],
    flexDirection: 'row',
    gap: 6,
  },
  activeDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // backdropFilter: 'blur(10px)',
  },
  spotDetails: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  spotHeader: {
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
  spotTypeBadge: {
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
  spotTypeDot: {
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
  spotTypeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
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
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  weatherDescription: {
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
  fishSection: {
    marginBottom: 32,
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: 'rgba(239, 246, 255, 0.5)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    maxHeight: 400,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  photoSection: {
    marginBottom: 24,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  addPhotoText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#13a4ec',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  submitButton: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
  },
});