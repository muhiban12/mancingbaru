import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Alert, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);

  const userData = {
    name: 'Rizky Angler', 
    email: 'RizAnglers@example.com',
    phone: '+62 812 3456 7890',
    memberSince: '2021',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtFaq62GNwYJHp3ke8ErgEyyx_-ONdug8BYn17FpUb9cLbIwx9BpPMHR6lbfh5IEvAOCUIOT9RYLplG2cmgZVAq8v6Fhc_ccaUkG0TxsL02vxFDsYm5aWgUYXGHKx0ITpnRzY_Q4bCKQYiM4esw0EDG23fyyaE7JVk7HoMqdh5yTUNq9M_FN9Zgk8w0lNouRIYP8BJhU7vDgAZYbhfsnkjBmcM_TtXwSzDqOsT7Jo-2O79s71P7lwMG8CS9Cc9DFcWtHg4LIia1wuW',
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar Akun',
      'Apakah Anda yakin ingin keluar dari akun?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            // Navigasi ke login screen
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigasi ke edit profile screen (bisa dibuat terpisah)
    router.push('/editprofile2');
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
        <Text style={styles.headerTitle}>Pengaturan Akun</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarBadge}>
              <MaterialIcons name="edit" size={16} color="#0A2436" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userRole}>
            Fishing Enthusiast • Member since {userData.memberSince}
          </Text>
        </View>

        {/* Section: Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(43, 238, 140, 0.1)' }]}>
              <MaterialIcons name="person" size={20} color="#2bee8c" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Nama Lengkap</Text>
              <Text style={styles.settingValue}>{userData.name}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <MaterialIcons name="mail" size={20} color="#f97316" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Email</Text>
              <Text style={styles.settingValue}>{userData.email}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <MaterialIcons name="call" size={20} color="#3b82f6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Nomor Telepon</Text>
              <Text style={styles.settingValue}>{userData.phone}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Section: Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferensi</Text>
          
          <View style={styles.preferencesCard}>
            {/* Notifications Toggle */}
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#f3f4f6' }]}>
                  <MaterialIcons name="notifications" size={18} color="#4b5563" />
                </View>
                <Text style={styles.toggleLabel}>Notifikasi</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#2bee8c' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            {/* Newsletter Toggle */}
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#f3f4f6' }]}>
                  <MaterialIcons name="mark-email-unread" size={18} color="#4b5563" />
                </View>
                <Text style={styles.toggleLabel}>Email Newsletter</Text>
              </View>
              <Switch
                value={newsletterEnabled}
                onValueChange={setNewsletterEnabled}
                trackColor={{ false: '#d1d5db', true: '#2bee8c' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            {/* Language */}
            <TouchableOpacity style={styles.toggleItem} activeOpacity={0.7}>
              <View style={styles.toggleLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#f3f4f6' }]}>
                  <MaterialIcons name="language" size={18} color="#4b5563" />
                </View>
                <Text style={styles.toggleLabel}>Bahasa</Text>
              </View>
              <View style={styles.languageSelector}>
                <Text style={styles.languageText}>Indonesia</Text>
                <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Security & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keamanan & Bantuan</Text>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <MaterialIcons name="lock-reset" size={20} color="#a855f7" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Ubah Kata Sandi</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]}>
              <MaterialIcons name="help" size={20} color="#14b8a6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Pusat Bantuan</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Versi Aplikasi 2.4.0</Text>
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#2bee8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2bee8c',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A2436',
    textAlign: 'center',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(10, 36, 54, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2436',
  },
  preferencesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A2436',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 56,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});