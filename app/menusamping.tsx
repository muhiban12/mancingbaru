import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


interface SideDrawerProps {
  visible: boolean;
  onClose: () => void; 
}

export default function SideDrawer({ visible, onClose }: SideDrawerProps) {
  const translateX = useRef(new Animated.Value(-340)).current; // mulai di luar layar kiri
  const router = useRouter();  

  useEffect(() => { 
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(); 
    } else {
      Animated.timing(translateX, {
        toValue: -340,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
          {/* Header user info */}
          <View style={styles.userHeader}>
            <View style={styles.avatarBox}>
              <MaterialIcons name="person" size={40} color="#fff" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userName}>Rizky Angler</Text>
              <Text style={styles.userRole}>Angler Member</Text>
              <TouchableOpacity 
                style={styles.editProfile}
                onPress={() => {
                  onClose(); // tutup drawer
                  router.push('/editprofile1'); // navigasi ke halaman pengaturan
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.editText}>Edit Profile</Text>
                <MaterialIcons name="edit" size={14} color="#cbd5e1" />
              </TouchableOpacity>
            </View> 
          </View>

          {/* Promo card */}
          <View style={styles.promoCard}>
            <MaterialIcons name="water-drop" size={24} color="#34D399" />
            <Text style={styles.promoTitle}>Jadi Juragan Empang?</Text>
            <Text style={styles.promoDesc}>
              Kelola kolam pancingmu dan dapatkan lebih banyak pemancing!
            </Text>
            <TouchableOpacity
                style={styles.promoButton}
                onPress={() => {
                    onClose(); // tutup drawer
                    router.push('/daftarowner'); // buka halaman Owner Register
                }}
                >
                <Text style={styles.promoButtonText}>Daftar Sebagai Owner</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#003366" />
            </TouchableOpacity>
          </View>

          {/* Menu list */}
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity style={styles.drawerItem}>
              <MaterialIcons name="favorite" size={22} color="#64748b" />
              <Text style={styles.drawerText}>Favorit Saya</Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem}>
              <MaterialIcons name="help" size={22} color="#64748b" />
              <Text style={styles.drawerText}>Pusat Bantuan</Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem}>
              <MaterialIcons name="description" size={22} color="#64748b" />
              <Text style={styles.drawerText}>Syarat & Ketentuan</Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </ScrollView>

          {/* Footer logout */}
          <View style={styles.footer}>
          <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={() => router.push('/login')} // arahkan ke login
                activeOpacity={0.7}
              >
                <MaterialIcons name="logout" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            <Text style={styles.version}>Pancing.in v1.0.2</Text>
          </View>
        </Animated.View>

        {/* Overlay klik untuk tutup */}
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)' },
  drawer: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    height: '100%',
  },
  userHeader: { backgroundColor: '#0A3D62', padding: 20, flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1e40af', alignItems: 'center', justifyContent: 'center' },
  userName: { color: '#fff', fontSize: 20, fontWeight: '700' },
  userRole: { color: '#34D399', fontSize: 12, fontWeight: '600', marginTop: 4 },
  editProfile: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  editText: { color: '#cbd5e1', fontSize: 11, marginRight: 4 },
  promoCard: { margin: 16, padding: 16, borderRadius: 20, backgroundColor: '#003366', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
  promoTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 8 },
  promoDesc: { color: '#cbd5e1', fontSize: 12, marginVertical: 8 },
  promoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
  promoButtonText: { color: '#003366', fontWeight: '700', marginRight: 6 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  drawerText: { marginLeft: 12, fontSize: 15, color: '#374151', fontWeight: '600' },
  footer: { borderTopWidth: 1, borderColor: '#e5e7eb', padding: 16, alignItems: 'center' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  logoutText: { color: '#ef4444', fontWeight: '700', marginLeft: 8 },
  version: { marginTop: 8, fontSize: 10, color: '#9ca3af', fontWeight: '700', letterSpacing: 1 },
});