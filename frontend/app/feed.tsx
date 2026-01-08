import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { socialAPI } from "../services/apiEndpoint";

const { width } = Dimensions.get("window");

export default function FeedScreen() {
  const router = useRouter();
  const [activeNavTab, setActiveNavTab] = useState("feed");
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  // Logic States
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi Fetch Data
  const fetchFeeds = async () => {
    try {
      const response = await socialAPI.getFeeds();

      // LOGIC FIX: Cek apakah data ada di response.data.data atau langsung di response.data
      const rawData = response.data;
      const finalArray = Array.isArray(rawData)
        ? rawData
        : rawData?.data && Array.isArray(rawData.data)
        ? rawData.data
        : [];

      setPosts(finalArray);
    } catch (error) {
      console.error("Gagal mengambil feed:", error);
      setPosts([]); // Set array kosong jika error agar tidak crash
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeeds();
  }, []);

  const navTabs = [
    { id: "map", label: "Map", icon: "map" },
    { id: "tickets", label: "Tiket Saya", icon: "confirmation-number" },
    { id: "tournament", label: "Turnamen", icon: "emoji-events" },
    { id: "rank", label: "Rank", icon: "leaderboard" },
    { id: "feed", label: "Feed", icon: "rss-feed" },
  ];

  const handleTabPress = (tab: string) => {
    setActiveNavTab(tab);
    switch (tab) {
      case "map":
        router.push("/mapAwal");
        break;
      case "tickets":
        router.push("/tiketsaya");
        break;
      case "tournament":
        router.push("/turnamen");
        break;
      case "rank":
        router.push("/ranking");
        break;
      default:
        break;
    }
  };

  const handlePostStrike = () => {
    router.push("/feedpost");
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Strike Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="search" size={26} color="#0f2238" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.notificationButton]}
          >
            <MaterialIcons name="notifications" size={26} color="#0f2238" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Content */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#1aa860" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1aa860"
            />
          }
        >
          {!posts || posts.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <MaterialIcons name="auto-awesome" size={48} color="#cbd5e1" />
              <Text style={{ color: "#64748b", marginTop: 10 }}>
                Belum ada kiriman terbaru.
              </Text>
            </View>
          ) : (
            posts.map((post, index) => (
              <View
                key={post.id?.toString() || index.toString()}
                style={styles.postCard}
              >
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Image
                      source={{
                        uri:
                          post.user?.avatar ||
                          `https://ui-avatars.com/api/?name=${
                            post.user?.nama || "A"
                          }&background=random`,
                      }}
                      style={styles.userAvatar}
                    />
                    <View>
                      <Text style={styles.userName}>
                        {post.user?.nama || "Angler"}
                      </Text>
                      <View style={styles.locationRow}>
                        <MaterialIcons
                          name="location-on"
                          size={14}
                          color="#1aa860"
                        />
                        <Text style={styles.locationText}>
                          {post.lokasi || "Unknown Spot"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <MaterialIcons
                      name="more-horiz"
                      size={24}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                {/* Post Image */}
                <View style={styles.imageContainer}>
                  <ImageBackground
                    source={{ uri: post.foto || post.image }}
                    style={styles.postImage}
                    imageStyle={styles.postImageStyle}
                  >
                    <View style={styles.fishInfoOverlay}>
                      <View style={styles.fishInfoContent}>
                        <View style={styles.fishInfoItem}>
                          <Text style={styles.fishInfoLabel}>Species</Text>
                          <Text style={styles.fishInfoValue}>
                            {post.jenis_ikan || "-"}
                          </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.fishInfoItem}>
                          <Text style={styles.fishInfoLabel}>Weight</Text>
                          <Text style={styles.fishInfoValue}>
                            {post.berat || "0"} Kg
                          </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.fishInfoItem}>
                          <Text style={styles.fishInfoLabel}>Length</Text>
                          <Text style={styles.fishInfoValue}>
                            {post.panjang || "0"} cm
                          </Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                          <MaterialIcons
                            name="verified"
                            size={18}
                            color="#0f2238"
                          />
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </View>

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <View style={styles.leftActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => toggleLike(post.id.toString())}
                    >
                      <MaterialIcons
                        name="phishing"
                        size={28}
                        color={likedPosts[post.id] ? "#ff8a3d" : "#0f2238"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialIcons
                        name="chat-bubble"
                        size={26}
                        color="#0f2238"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialIcons name="send" size={26} color="#0f2238" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="bookmark" size={26} color="#0f2238" />
                  </TouchableOpacity>
                </View>

                {/* Post Stats & Caption */}
                <View style={styles.postStats}>
                  <Text style={styles.likesCount}>
                    {post.likes_count || 0} Likes
                  </Text>
                </View>

                <View style={styles.postCaption}>
                  <Text style={styles.captionText}>
                    <Text style={styles.captionUsername}>
                      {post.user?.nama || "Angler"}{" "}
                    </Text>
                    {post.konten || post.caption}
                  </Text>
                  <Text style={styles.postTime}>
                    {post.created_at_human || "Just now"}
                  </Text>
                </View>
              </View>
            ))
          )}
          <View style={styles.spacer} />
        </ScrollView>
      )}

      {/* Action Buttons & Nav */}
      <TouchableOpacity
        style={styles.postStrikeButton}
        onPress={handlePostStrike}
      >
        <LinearGradient
          colors={["#2bee8c", "#1aa860"]}
          style={styles.postStrikeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialIcons name="photo-camera" size={24} color="#0f2238" />
          <Text style={styles.postStrikeText}>Post Strike</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        {navTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.navTab}
            onPress={() => handleTabPress(tab.id)}
          >
            {tab.id === "feed" ? (
              <View style={{ alignItems: "center" }}>
                <View style={styles.activeTabIndicator}>
                  <View style={styles.activeTabCircle}>
                    <MaterialIcons name="rss-feed" size={30} color="#fff" />
                  </View>
                </View>
                <Text style={styles.navTabTextActive}>{tab.label}</Text>
              </View>
            ) : (
              <>
                <MaterialIcons
                  name={tab.icon as any}
                  size={24}
                  color="rgba(255,255,255,0.6)"
                />
                <Text style={styles.navTabText}>{tab.label}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ... styles tetap sama seperti kode Anda sebelumnya ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.5)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f2238",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: "#ff8a3d",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  postCard: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.5)",
    paddingBottom: 24,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#f4f6f5",
  },
  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f2238",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1aa860",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: "#f4f6f5",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  postImageStyle: {
    resizeMode: "cover",
  },
  fishInfoOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  fishInfoContent: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  fishInfoItem: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  fishInfoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fishInfoValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  verifiedBadge: {
    backgroundColor: "#2bee8c",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  hookIcon: {
    fontWeight: "600",
  },
  postStats: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f2238",
  },
  postCaption: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  captionText: {
    fontSize: 14,
    color: "#0f2238",
    lineHeight: 20,
    marginBottom: 4,
  },
  captionUsername: {
    fontWeight: "800",
    color: "#0f2238",
  },
  viewComments: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 2,
  },
  postTime: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  spacer: {
    height: 32,
  },
  postStrikeButton: {
    position: "absolute",
    bottom: 160,
    right: 20,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#2bee8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  postStrikeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  postStrikeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f2238",
    letterSpacing: 0.5,
  },
  bottomNav: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: "#0A3D62",
    height: 80,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: 8,
  },
  activeTabIndicator: {
    position: "absolute",
    top: -48,
    alignItems: "center",
  },
  activeTabCircle: {
    width: 64,
    height: 64,
    backgroundColor: "#13a4ec",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#13a4ec",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 6,
    borderColor: "#0A3D62",
  },
  tabHighlight: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
  },
  navTabIcon: {
    marginBottom: 4,
  },
  navTabText: {
    fontSize: 9,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 12,
  },
  navTabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
});
