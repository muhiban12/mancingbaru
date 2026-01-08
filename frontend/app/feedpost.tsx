import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { masterAPI, authAPI } from "../services/apiEndpoint";
import api from "../services/apiService";

export default function PostStrikeScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fishList, setFishList] = useState<any[]>([]);
  const [wildSpots, setWildSpots] = useState<any[]>([]);
  const [isFishModalVisible, setIsFishModalVisible] = useState(false);
  const [isSpotModalVisible, setIsSpotModalVisible] = useState(false);

  // State untuk data user
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    species: "",
    weight: "",
    length: "",
    story: "",
  });

  const [selectedSpot, setSelectedSpot] = useState<{
    id: number;
    nama: string;
  } | null>(null);

  useEffect(() => {
    loadInitialData();
    loadUserProfile();
  }, []);

  // FUNGSI LOAD USER (HYBRID: Storage + API)
  const loadUserProfile = async () => {
    try {
      // 1. Ambil data cepat dari storage dulu
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      // 2. Validasi/Update data terbaru dari API profile (/auth/me)
      const response = await authAPI.getProfile();
      if (response.data && response.data.status === "Success") {
        const userData = response.data.data;
        setCurrentUser(userData);
        // Simpan versi terbaru ke storage
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        console.log(
          "User Verified:",
          userData.nama_lengkap,
          "ID:",
          userData.id
        );
      }
    } catch (error: any) {
      console.error("Gagal sinkronisasi profil:", error.message);
      // Jika error 401 (Unauthorized), tendang ke login
      if (error.response?.status === 401) {
        Alert.alert("Sesi Berakhir", "Silakan login kembali.");
        router.replace("/login" as any);
      }
    }
  };

  const loadInitialData = async () => {
    try {
      const [fishRes, spotRes] = await Promise.all([
        masterAPI.getFish(),
        masterAPI.getWildSpots(),
      ]);
      if (fishRes.data.status === "Success") setFishList(fishRes.data.data);
      if (spotRes.data.status === "Success") setWildSpots(spotRes.data.data);
    } catch (error) {
      console.error("Gagal mengambil data master:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Diperlukan", "Izin galeri dibutuhkan.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setBase64Data(result.assets[0].base64 || null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !base64Data)
      return Alert.alert("Foto Kosong", "Pilih foto dulu.");
    if (!formData.species || !formData.weight || !selectedSpot)
      return Alert.alert("Data Kurang", "Lengkapi semua form.");

    if (!currentUser) {
      return Alert.alert(
        "Eror",
        "Data user tidak ditemukan. Coba buka ulang halaman ini."
      );
    }

    setIsSubmitting(true);

    try {
      const payload = {
        user_id: currentUser.id, // ID diambil dari state yang sudah sinkron
        nama_ikan: formData.species,
        berat: formData.weight,
        panjang: formData.length || "0",
        caption: formData.story || "",
        wild_spot_id: selectedSpot.id,
        foto_base64: `data:image/jpeg;base64,${base64Data}`,
      };

      const response = await api.post("/feeds", payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Berhasil!",
          `Strike kamu telah diposting sebagai ${currentUser.nama_lengkap}!`,
          [{ text: "OK", onPress: () => router.replace("./feed" as any) }]
        );
      }
    } catch (error: any) {
      console.error("DEBUG ERROR POST:", error.response?.data || error.message);
      Alert.alert(
        "Gagal Posting",
        error.response?.data?.message || "Terjadi kesalahan pada server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f2238" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Posting Strike</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Indikator */}
        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>
            {currentUser
              ? `Posting sebagai: ${currentUser.nama_lengkap}`
              : "Menghubungkan akun..."}
          </Text>
        </View>

        <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.uploadedImage}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <MaterialIcons name="add-a-photo" size={40} color="#2bee8c" />
              <Text style={styles.uploadText}>Tambah Foto Ikan</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Jenis Ikan</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setIsFishModalVisible(true)}
          >
            <MaterialIcons name="set-meal" size={20} color="#64748b" />
            <Text
              style={[
                styles.textInput,
                {
                  color: formData.species ? "#0f2238" : "#94a3b8",
                  marginLeft: 10,
                },
              ]}
            >
              {formData.species || "Pilih Jenis Ikan"}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Berat (Kg)</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="0.0"
                keyboardType="decimal-pad"
                value={formData.weight}
                onChangeText={(v) => setFormData({ ...formData, weight: v })}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Panjang (Cm)</Text>
              <TextInput
                style={styles.inputContainer}
                placeholder="0"
                keyboardType="number-pad"
                value={formData.length}
                onChangeText={(v) => setFormData({ ...formData, length: v })}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Lokasi Mancing</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setIsSpotModalVisible(true)}
          >
            <MaterialIcons name="location-on" size={20} color="#64748b" />
            <Text
              style={[
                styles.textInput,
                { color: selectedSpot ? "#0f2238" : "#94a3b8", marginLeft: 10 },
              ]}
            >
              {selectedSpot ? selectedSpot.nama : "Pilih Lokasi Mancing"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Cerita Strike</Text>
          <TextInput
            style={[
              styles.inputContainer,
              { height: 80, textAlignVertical: "top" },
            ]}
            placeholder="Tulis caption..."
            multiline
            value={formData.story}
            onChangeText={(v) => setFormData({ ...formData, story: v })}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (isSubmitting || !currentUser) && { opacity: 0.5 },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !currentUser}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0f2238" />
          ) : (
            <Text style={styles.submitButtonText}>Kirim Sekarang</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PILIH IKAN */}
      <Modal
        visible={isFishModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Jenis Ikan</Text>
            <FlatList
              data={fishList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.fishItem}
                  onPress={() => {
                    setFormData({ ...formData, species: item.nama_ikan });
                    setIsFishModalVisible(false);
                  }}
                >
                  <Text style={styles.fishText}>{item.nama_ikan}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsFishModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PILIH LOKASI */}
      <Modal
        visible={isSpotModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Lokasi Mancing</Text>
            <FlatList
              data={wildSpots}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.fishItem}
                  onPress={() => {
                    setSelectedSpot({ id: item.id, nama: item.nama_lokasi });
                    setIsSpotModalVisible(false);
                  }}
                >
                  <Text style={styles.fishText}>{item.nama_lokasi}</Text>
                  <Text style={{ fontSize: 12, color: "#64748b" }}>
                    {item.kabupaten_provinsi}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsSpotModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f2238",
  },
  backButton: { width: 40 },
  placeholder: { width: 40 },
  scrollContent: { padding: 20 },
  userBadge: {
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  userBadgeText: {
    fontSize: 12,
    color: "#166534",
    textAlign: "center",
    fontWeight: "600",
  },
  uploadContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 15 },
  uploadText: { marginTop: 8, color: "#666" },
  formSection: { marginTop: 10 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#0f2238",
  },
  inputContainer: {
    backgroundColor: "#f1f3f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: { flex: 1, fontSize: 14 },
  row: { flexDirection: "row" },
  submitButton: {
    backgroundColor: "#2bee8c",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  submitButtonText: { fontWeight: "bold", fontSize: 16, color: "#0f2238" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  fishItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  fishText: { fontSize: 16 },
  closeButton: {
    backgroundColor: "#ff5252",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
