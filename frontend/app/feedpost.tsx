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
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { socialAPI, masterAPI } from "../services/apiEndpoint";

export default function PostStrikeScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fishList, setFishList] = useState<any[]>([]);
  const [wildSpots, setWildSpots] = useState<any[]>([]);
  const [isFishModalVisible, setIsFishModalVisible] = useState(false);
  const [isSpotModalVisible, setIsSpotModalVisible] = useState(false);

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
  }, []);

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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square lebih kecil ukurannya
      quality: 0.1, // KOMPRES MAKSIMAL (0.1 atau 0.05)
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // 1. Validasi Input
    if (!selectedImage)
      return Alert.alert("Foto Kosong", "Pilih foto strike kamu dulu.");
    if (!formData.species)
      return Alert.alert("Ikan Kosong", "Pilih jenis ikan.");
    if (!formData.weight) return Alert.alert("Berat Kosong", "Isi berat ikan.");
    if (!selectedSpot)
      return Alert.alert("Lokasi Kosong", "Pilih lokasi mancing.");

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("nama_ikan", formData.species);
      data.append("berat", formData.weight);
      data.append("panjang", formData.length || "0");
      data.append("caption", formData.story || "");
      data.append("wild_spot_id", selectedSpot.id.toString());

      // @ts-ignore
      data.append("foto", {
        uri: selectedImage,
        name: `strike.jpg`, // Nama simpel
        type: "image/jpeg",
      });

      const response = await socialAPI.createFeed(data, {
        // PAKSA TIMEOUT SANGAT LAMA UNTUK NGROK
        timeout: 60000,
        headers: {
          Accept: "application/json",
        },
        transformRequest: (data: any) => data,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Berhasil!", "Postingan masuk.");
        router.replace("/(tabs)/feed" as any);
      }
    } catch (error: any) {
      // CEK DISINI: Kalau error message tetap "Network Error",
      // berarti Ngrok memutus koneksi sebelum file sampai ke backend.
      console.log("DEBUG NGROK ERROR:", error.message);
      Alert.alert(
        "Error",
        "Ngrok memutus koneksi. Coba ganti sinyal atau kecilkan gambar lagi."
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
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
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

          <Text style={styles.inputLabel}>Lokasi Mancing (Wild Spot)</Text>
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
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748b" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Cerita Strike</Text>
          <TextInput
            style={[
              styles.inputContainer,
              { height: 100, textAlignVertical: "top", paddingTop: 12 },
            ]}
            placeholder="Tulis caption menarik..."
            multiline
            value={formData.story}
            onChangeText={(v) => setFormData({ ...formData, story: v })}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
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
