import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground, 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
 
export default function LoginScreen() { 
  const router = useRouter(); 
  const [input, setInput] = useState('');
  const [error, setError] = useState(''); 
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <View style={styles.container}> 
      {/* Header dengan background image */}
      <View style={styles.header}>
        <ImageBackground
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2f_uyOkGDosF1TZifcsUx2XoKkoyN26RRBY4K3H8dVm6RqA8VIcaaHxvncigvG48qTaYLi9IC0Kzki9QIVZ35KBdSUct97q9-ds8P3F4CJeAgtxqMXCAjEtHagbKn-X4WjvxQRjVt56AnDWtCAG2IdZdReoq-aT2uwWTMaKuvuNq0Ugd5yikcmfVFE_COPFUReiEfGPJ6_EhB5VpKxLZ2tWA4HpVGEEnRmNUwGfePi8MkIbvyqnM3Pw1vBExm8gZhvM-3tdJel3Ub',
          }}
          style={styles.headerImage}
          imageStyle={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          <LinearGradient
            colors={['rgba(10,61,97,0.9)', 'rgba(10,61,97,0.3)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.headerContent}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="lock-reset" size={42} color="#2dd4bf" />
            </View>
            <Text style={styles.headerTitle}>Pancing.in</Text>
            <Text style={styles.headerSubtitle}>Bantuan Akses Akun</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Lupa Password?</Text>
        <Text style={styles.description}>
          Masukkan email atau nama lengkap akun Anda untuk menerima instruksi reset password.
        </Text>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="badge"
            size={20}
            color="rgba(10,61,97,0.5)"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email atau Nama Lengkap"
            placeholderTextColor="#9aaebc"
            value={input}
            onChangeText={setInput}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() => {
            if (!input) {
              setError('Email tidak boleh kosong');
              return;
            }
            if (!validateEmail(input)) {
              setError('Format email tidak valid');
              return;
            }
            setError('');
            router.push('/lupaPw2');
          }}
        >
          <MaterialIcons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Kirim Instruksi Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff', // background-light
  },
  header: {
    height: 320,
    width: '100%',
  },
  headerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  iconCircle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2dd4bf',
    marginTop: 4,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a3d61',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#637888',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dce1e5',
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(224,242,254,0.2)', // water-blue/20
    marginBottom: 20,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111518',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f97316', // accent orange
    shadowColor: '#f97316',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#f97316',   // warna oranye biar konsisten
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center', // bikin teks rata tengah
  },
});