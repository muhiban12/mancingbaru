import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ProvinceModal from "./provinsi";
import { authAPI } from "../services/apiEndpoint";

export default function RegisterScreen() {
  const router = useRouter();

  // Logic States
  const [name, setName] = useState("");
  const [wa, setWa] = useState(""); // Tambahan untuk DB
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [province, setProvince] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    // 2. Validasi nomor WA (minimal 10 digit)
    if (wa.length < 10) {
      setError("Nomor WhatsApp tidak valid");
      return;
    }
    if (!name || !wa || !province || !email || !password || !confirm) {
      setError("Semua data diri wajib diisi");
      return;
    }
    if (password !== confirm) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register({
        nama_lengkap: name,
        email: email,
        password: password,
        nomer_wa: wa,
        provinsi_asal: province,
        kota_kabupaten: "-", // Default agar tidak undefined
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat! Silahkan login.", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (err: any) {
      // Menampilkan pesan error spesifik dari backend
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Pendaftaran gagal.";
      setError(msg);
      console.log("Error Register Detail:", err.response?.data);
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
              uri: "https://images.unsplash.com/photo-1544551763-47a0159f9234?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.heroImage}
            imageStyle={{
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          >
            <LinearGradient
              colors={[
                "rgba(10,61,97,0.95)",
                "rgba(10,61,97,0.4)",
                "transparent",
              ]}
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

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Daftar Akun</Text>
          <Text style={styles.formSubtitle}>
            Lengkapi data diri untuk mulai memancing.
          </Text>

          <View style={styles.inputGroup}>
            <MaterialIcons
              name="person"
              size={20}
              color="#0a3d61"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Nama Lengkap Anda"
              placeholderTextColor="#9aaebc"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Input WA Tambahan agar sesuai Database */}
          <View style={styles.inputGroup}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#0a3d61"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Nomor WhatsApp (Contoh: 0812...)"
              placeholderTextColor="#9aaebc"
              style={styles.input}
              value={wa}
              onChangeText={setWa}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <MaterialIcons
              name="map"
              size={20}
              color="#0a3d61"
              style={styles.inputIcon}
            />
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: province ? "#111518" : "#9aaebc",
                }}
              >
                {province || "Provinsi Domisili"}
              </Text>
            </TouchableOpacity>
            <MaterialIcons name="expand-more" size={20} color="#637888" />
          </View>

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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={20}
                color="#637888"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <MaterialIcons
              name="lock-reset"
              size={20}
              color="#0a3d61"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Konfirmasi Password"
              placeholderTextColor="#9aaebc"
              secureTextEntry
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.registerButton, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={["#0a3d61", "#0e578a"]}
              style={styles.registerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
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
                  <Text style={styles.registerText}>Daftar</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.loginBox}>
          <Text style={styles.loginText}>
            Sudah punya akun?
            <Text
              style={styles.loginLink}
              onPress={() => router.push("/login")}
            >
              {" "}
              Masuk
            </Text>
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
  container: { flex: 1, backgroundColor: "#f0f7ff" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  hero: { height: 280 },
  heroImage: { flex: 1 },
  heroContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroIcon: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 12,
  },
  heroTitle: { fontSize: 28, fontWeight: "800", color: "#fff" },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2dd4bf",
    marginTop: 4,
  },
  formSection: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0a3d61",
    textAlign: "center",
  },
  formSubtitle: {
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
  errorText: {
    color: "#f97316",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  registerButton: {
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
  },
  registerGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  loginBox: {
    backgroundColor: "rgba(224,242,254,0.3)",
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#e0f2fe",
    alignItems: "center",
  },
  loginText: { fontSize: 14, color: "#637888" },
  loginLink: { color: "#f97316", fontWeight: "700" },
});
