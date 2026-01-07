import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; 

const { width } = Dimensions.get('window'); 

export default function LoginScreen() { 
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    console.log('LoginScreen mounted');
  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* ================= HERO SECTION ================= */}
      <View style={styles.hero}>
        <ImageBackground
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2f_uyOkGDosF1TZifcsUx2XoKkoyN26RRBY4K3H8dVm6RqA8VIcaaHxvncigvG48qTaYLi9IC0Kzki9QIVZ35KBdSUct97q9-ds8P3F4CJeAgtxqMXCAjEtHagbKn-X4WjvxQRjVt56AnDWtCAG2IdZdReoq-aT2uwWTMaKuvuNq0Ugd5yikcmfVFE_COPFUReiEfGPJ6_EhB5VpKxLZ2tWA4HpVGEEnRmNUwGfePi8MkIbvyqnM3Pw1vBExm8gZhvM-3tdJel3Ub',
          }}
          style={styles.heroImage}
          imageStyle={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          <LinearGradient
            colors={['rgba(10,61,97,0.9)', 'rgba(10,61,97,0.3)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <MaterialIcons name="phishing" size={42} color="#2dd4bf" />
            </View>
            <Text style={styles.heroTitle}>Pancing.in</Text>
            <Text style={styles.heroSubtitle}>Temukan Spot Terbaikmu</Text>
          </View>
        </ImageBackground>
      </View>

      {/* ================= FORM SECTION ================= */}
      <View style={styles.formSection}>
        <Text style={styles.welcomeTitle}>Selamat Datang!</Text>
        <Text style={styles.welcomeSubtitle}>
          Silahkan masuk untuk mulai memancing.
        </Text>

        {/* Input Email */}
        <View style={styles.inputGroup}>
          <MaterialIcons name="mail" size={20} color="#0a3d61" style={styles.inputIcon} />
          <TextInput
            placeholder="Email atau Nama Lengkap"
            placeholderTextColor="#9aaebc"
            style={styles.input}
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputGroup}>
          <MaterialIcons name="lock" size={20} color="#0a3d61" style={styles.inputIcon} />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#9aaebc"
            secureTextEntry={!showPassword}
            style={styles.input}
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

        {/* Link Lupa Password */}
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push('/lupaPw1')}
        >
          <Text style={styles.forgotText}>Lupa Password?</Text>
        </TouchableOpacity>

        {/* ================= EXTRAS SECTION ================= */}
        {/* Tombol Masuk */}
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.9}
          onPress={() => {
            // validasi login dulu kalau perlu
            router.push('/mapAwal');   // arahkan ke MapsScreen
          }}
        >
          <MaterialIcons name="sailing" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.loginText}>Masuk</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Atau masuk dengan</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Login */}
        <TouchableOpacity style={styles.googleButton} activeOpacity={0.9}>
          <FontAwesome name="google" size={20} color="#4285F4" />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>

        {/* Box Daftar */}
        <View style={styles.registerBox}>
          <Text style={styles.registerText}>
            Belum punya akun?
            <Text
              style={styles.registerLink}
              onPress={() => router.push('/register')}
            >
              Daftar Sekarang
            </Text>
          </Text>
        </View>
      </View>

      {/* ================= DEKORASI BAWAH ================= */}
      {/* <View style={styles.decorBottom}>
        <View style={styles.circleMint} />
        <View style={styles.circlePrimary} />
      </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ff' },
  hero: { height: 320 },
  heroImage: { flex: 1 },
  heroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  heroIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2dd4bf',
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a3d61',
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#637888',
    textAlign: 'center',
    marginBottom: 20,
  },
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
  forgotPassword: { alignSelf: 'flex-end', marginTop: -8 },
  forgotText: { fontSize: 14, fontWeight: '600', color: '#f97316' },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0a3d61',
    shadowColor: '#0a3d61',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#dce1e5' },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dce1e5',
    marginBottom: 24,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#111518',
  },
  registerBox: {
    backgroundColor: 'rgba(224,242,254,0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    fontSize: 14,
    color: '#637888',
  },
  registerLink: {
    color: '#f97316',
    fontWeight: '700',
  },
  // decorBottom: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   height: 80,
  //   overflow: 'hidden',
  // },
  // circleMint: {
  //   position: 'absolute',
  //   bottom: 10,
  //   left: 20,
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: 'rgba(45,212,191,0.2)',
  // },
  // circlePrimary: {
  //   position: 'absolute',
  //   bottom: 20,
  //   right: 40,
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   backgroundColor: 'rgba(10,61,97,0.1)',
  // },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // kasih jarak biar tombol daftar tidak ketutup
  },
});