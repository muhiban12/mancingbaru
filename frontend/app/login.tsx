import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/apiEndpoint";
// Import API_BASE_URL untuk log yang akurat
import { API_BASE_URL } from "../constants/api"; 

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Logic States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan Password tidak boleh kosong");
      return;
    }

    setLoading(true);
    
    // Log sekarang menggunakan variabel asli dari config agar tidak salah baca
    console.log("--- Mencoba Login ---");
    console.log("Target API:", `${API_BASE_URL}/auth/login`);

    try {
      const response = await authAPI.login({ email, password });

      console.log("Login Berhasil:", response.data);

      // Simpan data ke storage
// 1. Simpan Token (Gunakan key "token" agar standar)
      await AsyncStorage.setItem("token", response.data.token); 
      
      // 2. Simpan Data User (Gunakan key "user" agar dibaca oleh SideDrawer)
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      Alert.alert("Berhasil boss", `Selamat datang icibosss!`);
      
      // Arahkan ke halaman utama
      router.replace("/mapAwal");
    } catch (err: any) {
      console.log("--- ERROR LOGIN ---");
      
      if (err.response) {
        // Kasus: Server merespon (Berarti koneksi AMAN), tapi login ditolak
        console.log("Status:", err.response.status);
        console.log("Pesan Server:", err.response.data.message);
        
        Alert.alert(
          "Gagal Masuk",
          err.response.data.message || "Email atau Password salah."
        );
      } else if (err.request) {
        // Kasus: Tidak bisa konek ke server (Timeout / Salah IP / Firewall)
        console.log("Detail Request Error:", err.request);
        
        Alert.alert(
          "Masalah Koneksi",
          "Tidak bisa terhubung ke server. Pastikan Laptop dan HP di Wi-Fi yang sama dan Firewall sudah OFF."
        );
      } else {
        console.log("Kesalahan Sistem:", err.message);
        Alert.alert("Error", "Terjadi kesalahan pada aplikasi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.heroImage}
            imageStyle={{
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          >
            <LinearGradient
              colors={[
                "rgba(10,61,97,0.9)",
                "rgba(10,61,97,0.3)",
                "transparent",
              ]}
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

        <View style={styles.formSection}>
          <Text style={styles.welcomeTitle}>Selamat Datang!</Text>
          <Text style={styles.welcomeSubtitle}>
            Silahkan masuk untuk mulai memancing.
          </Text>

          <View style={styles.inputGroup}>
            <MaterialIcons
              name="mail"
              size={20}
              color="#0a3d61"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9aaebc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#0a3d61"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
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
                name={showPassword ? "visibility-off" : "visibility"}
                size={20}
                color="#637888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/lupaPw1")}
          >
            <Text style={styles.forgotText}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            activeOpacity={0.9}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons
                  name="sailing"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.loginText}>Masuk</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Atau masuk dengan</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} activeOpacity={0.9}>
            <FontAwesome name="google" size={20} color="#4285F4" />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>

          <View style={styles.registerBox}>
            <Text style={styles.registerText}>
              Belum punya akun?{" "}
              <Text
                style={styles.registerLink}
                onPress={() => router.push("/register")}
              >
                Daftar Sekarang
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f7ff" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  hero: { height: 320 },
  heroImage: { flex: 1 },
  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  heroIcon: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 12,
  },
  heroTitle: { fontSize: 32, fontWeight: "800", color: "#fff" },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2dd4bf",
    marginTop: 4,
  },
  formSection: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0a3d61",
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#637888",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(224,242,254,0.2)",
    borderWidth: 1,
    borderColor: "#dce1e5",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#111518" },
  passwordToggle: { paddingHorizontal: 8 },
  forgotPassword: { alignSelf: "flex-end", marginTop: -8 },
  forgotText: { fontSize: 14, fontWeight: "600", color: "#f97316" },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#0a3d61",
    marginTop: 20,
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#dce1e5" },
  dividerText: { marginHorizontal: 8, fontSize: 12, color: "#9ca3af" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce1e5",
    marginBottom: 24,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#111518",
  },
  registerBox: {
    backgroundColor: "rgba(224,242,254,0.3)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  registerText: { fontSize: 14, color: "#637888" },
  registerLink: { color: "#f97316", fontWeight: "700" },
});
