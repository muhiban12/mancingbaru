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
} from 'react-native'; 
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Definisikan tipe untuk user data
type UserData = {
  name: string;
  username: string;
  phone: string;
  email: string;
  avatar: string; 
};

export default function EditProfileScreen() {
  const router = useRouter();
  
  const [userData, setUserData] = useState<UserData>({
    name: 'Budi Santoso',
    username: 'budifishing_21',
    phone: '+62 812 3456 7890',
    email: 'budisantoso@example.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtFaq62GNwYJHp3ke8ErgEyyx_-ONdug8BYn17FpUb9cLbIwx9BpPMHR6lbfh5IEvAOCUIOT9RYLplG2cmgZVAq8v6Fhc_ccaUkG0TxsL02vxFDsYm5aWgUYXGHKx0ITpnRzY_Q4bCKQYiM4esw0EDG23fyyaE7JVk7HoMqdh5yTUNq9M_FN9Zgk8w0lNouRIYP8BJhU7vDgAZYbhfsnkjBmcM_TtXwSzDqOsT7Jo-2O79s71P7lwMG8CS9Cc9DFcWtHg4LIia1wuW',
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Logika untuk menyimpan perubahan
    Alert.alert(
      'Berhasil',
      'Perubahan profil telah disimpan!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleChangeAvatar = () => {
    router.push('/editprofile3')
  };

  // Tentukan tipe untuk parameter field
  const updateField = (field: keyof UserData, value: string) => {
    setUserData({
      ...userData,
      [field]: value,
    });
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
          <MaterialIcons name="arrow-back" size={24} color="#0A2436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Photo Section */}
        <View style={styles.profilePhotoContainer}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity 
              onPress={handleChangeAvatar}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: userData.avatar }}
                style={styles.avatar}
              />
              <View style={styles.cameraButton}>
                <MaterialIcons name="photo-camera" size={20} color="#0A2436" />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={handleChangeAvatar}
          >
            <Text style={styles.changePhotoText}>Ubah Foto Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Full Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nama Lengkap</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text: string) => updateField('name', text)}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#9ca3af"
              />
              <MaterialIcons 
                name="person" 
                size={20} 
                color="#9ca3af" 
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Username Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Username</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userData.username}
                onChangeText={(text: string) => updateField('username', text)}
                placeholder="Buat username"
                placeholderTextColor="#9ca3af"
              />
              <MaterialIcons 
                name="alternate-email" 
                size={20} 
                color="#9ca3af" 
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nomor Telepon</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userData.phone}
                onChangeText={(text: string) => updateField('phone', text)}
                placeholder="08xx-xxxx-xxxx"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
              <MaterialIcons 
                name="call" 
                size={20} 
                color="#9ca3af" 
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* Email Field - Mengganti bagian "Tentang Saya" */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                value={userData.email}
                onChangeText={(text: string) => updateField('email', text)}
                placeholder="email@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <MaterialIcons 
                name="mail" 
                size={20} 
                color="#9ca3af" 
                style={styles.inputIcon}
              />
            </View>
            <Text style={styles.charLimit}>Ganti alamat email untuk verifikasi ulang</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <MaterialIcons name="save" size={20} color="#0A2436" />
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
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
    borderBottomColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    color: '#0A2436',
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#2bee8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#2bee8c',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2bee8c',
    textAlign: 'center',
  },
  formContainer: {
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(10, 36, 54, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 48,
    fontSize: 16,
    fontWeight: '500',
    color: '#0A2436',
  },
  emailInput: {
    height: 56,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  charLimit: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2bee8c',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
    marginTop: 32,
    marginBottom: 24,
    shadowColor: '#2bee8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0A2436',
  },
});