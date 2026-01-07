import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import ProvinceModal from './provinsi'; // sesuaikan path file

export default function RegisterScreen() { 
  const router = useRouter();
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [province, setProvince] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRegister = () => {
    if (!name || !province || !email || !password || !confirm) {
      setError('Semua data diri wajib diisi');
      return;
    }
    if (password !== confirm) { 
      setError('Password dan konfirmasi tidak sama');
      return;
    }
    setError('');
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ===== HERO SECTION ===== */}
        <View style={styles.hero}>
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2f_uyOkGDosF1TZifcsUx2XoKkoyN26RRBY4K3H8dVm6RqA8VIcaaHxvncigvG48qTaYLi9IC0Kzki9QIVZ35KBdSUct97q9-ds8P3F4CJeAgtxqMXCAjEtHagbKn-X4WjvxQRjVt56AnDWtCAG2IdZdReoq-aT2uwWTMaKuvuNq0Ugd5yikcmfVFE_COPFUReiEfGPJ6_EhB5VpKxLZ2tWA4HpVGEEnRmNUwGfePi8MkIbvyqnM3Pw1vBExm8gZhvM-3tdJel3Ub',
            }}
            style={styles.heroImage}
            imageStyle={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
          >
            <LinearGradient
              colors={['rgba(10,61,97,0.95)', 'rgba(10,61,97,0.4)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <MaterialIcons name="phishing" size={42} color="#2dd4bf" />
              </View>
              <Text style={styles.heroTitle}>Pancing.in</Text>
              <Text style={styles.heroSubtitle}>Mulai Petualanganmu</Text>
            </View>
          </ImageBackground>
        </View>

        {/* ===== FORM SECTION ===== */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Daftar Akun</Text>
          <Text style={styles.formSubtitle}>Lengkapi data diri untuk mulai memancing.</Text>

          {/* Nama Lengkap */}
          <View style={styles.inputGroup}>
            <MaterialIcons name="person" size={20} color="#0a3d61" style={styles.inputIcon} />
            <TextInput
              placeholder="Nama Lengkap Anda"
              placeholderTextColor="#9aaebc"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Provinsi */}
          <View style={styles.inputGroup}>
            <MaterialIcons name="map" size={20} color="#0a3d61" style={styles.inputIcon} />
            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                  console.log('Open modal');
                  setModalVisible(true);
                }}
                >
              <Text style={{
                fontSize: 16,
                color: province ? '#111518' : '#9aaebc',
                textAlignVertical: 'center',
              }}>
                {province || 'Provinsi Domisili'}
              </Text>
            </TouchableOpacity>
            <MaterialIcons name="expand-more" size={20} color="#637888" />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <MaterialIcons name="mail" size={20} color="#0a3d61" style={styles.inputIcon} />
            <TextInput
              placeholder="xxx123@email.com"
              placeholderTextColor="#9aaebc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <MaterialIcons name="lock" size={20} color="#0a3d61" style={styles.inputIcon} />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#9aaebc"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color="#637888"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <MaterialIcons name="lock-reset" size={20} color="#0a3d61" style={styles.inputIcon} />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#9aaebc"
              secureTextEntry
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Tombol Daftar */}
          <TouchableOpacity style={styles.registerButton} activeOpacity={0.9} onPress={handleRegister}>
            <LinearGradient
              colors={['#0a3d61', '#0e578a']}
              style={styles.registerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="sailing" size={22} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.registerText}>Daftar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ===== BOX BAWAH ===== */}
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>
            Sudah punya akun?
            <Text style={styles.loginLink} onPress={() => router.push('/login')}> Masuk</Text>
          </Text>
        </View>
      </ScrollView>

      <ProvinceModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(prov) => setProvince(prov)}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ff' },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  
  // Hero
  hero: { height: 280 },
  heroImage: { flex: 1 },
  heroContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
  heroIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 4 },
  heroSubtitle: { fontSize: 14, fontWeight: '600', color: '#2dd4bf', marginTop: 4 },

  // Form
  formSection: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#0a3d61', textAlign: 'center', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#637888', textAlign: 'center', marginBottom: 20 },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224,242,254,0.2)',
    borderWidth: 1,
    borderColor: '#dce1e5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#111518' },
  passwordToggle: { paddingHorizontal: 8 },

  // Error
  errorText: { color: '#f97316', fontSize: 14, textAlign: 'center', marginBottom: 12 },

  // Register button (gradient)
  registerButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  registerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Bottom box: "Sudah punya akun? Masuk"
  loginBox: {
    backgroundColor: 'rgba(224,242,254,0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    alignItems: 'center',
  },
  loginText: { fontSize: 14, color: '#637888' },
  loginLink: { color: '#f97316', fontWeight: '700' },
});