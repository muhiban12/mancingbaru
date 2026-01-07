import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground, 
  Dimensions,
  Image, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function RankingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rank'); // Tab aktif adalah 'rank'
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activeNavTab, setActiveNavTab] = useState('rank'); // Untuk bottom nav

  const timeframes = [
    { id: 'week', label: 'Minggu Ini' },
    { id: 'month', label: 'Bulan Ini' },
    { id: 'all', label: 'Sepanjang Masa' }, 
  ];

  const navTabs = [
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'tickets', label: 'Tiket Saya', icon: 'confirmation-number' },
    { id: 'tournament', label: 'Turnamen', icon: 'emoji-events' },
    { id: 'rank', label: 'Rank', icon: 'leaderboard' },
    { id: 'feed', label: 'Feed', icon: 'rss-feed' },
  ];

  const topRankers = [
    { 
      rank: 1, 
      name: 'Andi', 
      weight: '15.2 Kg', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJWJXKg9li2YSfsKFAwLodCBTW66XFmvWN1YSpmvGZyKM2DzL_O2iwyhGtbs9D7ncYwNtmC4XCAyilH6_czthjcxVbN8a0ogdxjgATuNmmnaD905ZyrZ2IT7IRj6Rw66xkzlzVI3dwgZweC5q78FotMzoBXGq8dwtSW07K07gmtR21BCtyaEQjH8HR2Ld1eWQsZDefs5uiP1XjEC18oE4wUePAYwMK8SfrgkzcOU7F6A60h8dY_TqtxCY5oHTWMYnQOQldcA9wdEng',
      borderColor: '#f39c12',
      height: 130,
    },
    { 
      rank: 2, 
      name: 'Budi', 
      weight: '12.4 Kg', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjXXgIPEvAN58jNX0qtX7MuR3-ovN9YGOPmbpeCj9ByORInUbpPM2faAggl5KUrtO02UAJydAyIojdvvjksFDTBkEF48GrNCSdAATXa3Wy9sBcI7FD5V3nZ-fprpbpfCorvIGiK7OZntW8U8VOsTYPXnWjGsB6uhcwerLo6udyrLD7yfoKl8YScxQQvzzNkuaNY1EoFdVGTbEos6f-V74qfwiZlvgmnZU7_8dglvoqgenci6m-1ttLeWQzBkkwkmqQs9chYZTz6OVi',
      borderColor: '#C0C0C0',
      height: 100,
    },
    { 
      rank: 3, 
      name: 'Citra', 
      weight: '10.1 Kg', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfXhh00LNEla8qSl-folie9jUClBSwYSFkR4yfulH7k6WUYaWEcIuqeSEtpRJSDhz6-9vgkgy0VFetLISG31gjPRMIgiMbx2Mp1kf0jKOzCBzk3mJD49bWnNN-jkK2GVizxyiijxfRyhJTtysCNd33QyQngUfy310_7iUeqBGjXvgYvtaBdunHUM76gMuoVK5ttThSZjorhBLdcLQdyAsiCwt6YkLrbzv6Heb_1rNVt878FIfEcvp111ErRF61RCdHXu13rBH1w08E',
      borderColor: '#CD7F32',
      height: 80,
    },
  ];

  const otherRankers = [
    { rank: 4, name: 'Deni', region: 'Sumatera Utara', weight: '9.8 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1a1NY2nl7OtpNOqgvS3iTRWkAyTuPqyJpXBGLVQoArGZ27tYSrXCCLiIz86lMjabrYTpx0WN_72IJP2GGMOVoMUVDubyKsMKIIbt6fXOKmrynXkzLdPkgusHRnNXY_8UrK4NLQWMkxb1MFvGwmyd-YJ6EkIhD7h3dOvSzLEaahqvyNC7tMpNxukNQRpokjqgQkHwG0EbckC25rIgex_pLJ7HiXg36umArPMkzDBl4l2-aEblL7y-DA2UVl9UrOD28-Gr2ZaTXoZg' },
    { rank: 5, name: 'Eka', region: 'Jawa Barat', weight: '9.2 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3-kysQGh3MVpNTzkn7999PF_SXVAEuA1ld7EKCNiLD-I7idy_jLC1u8uh57Flc9khlWbCYEW799JVRlNc70cnzQhQDIfgvHjvnLvKWhFjH9s2wD8cos1uT0YF5B6gyi0J0bcKroff__ZGC3D8xJo129jRgqsx4WGAk938vL_DtUPSRjm4fswIQUCj7BsigQ5pqBUjuRFc6YUgEANmrhjJrmT3o3p-oIn1KJ5VOtmWjBMQe1pQJnAxUfHNqQ8F1ZVTPGQGOfbEhInb' },
    { rank: 6, name: 'Fajar', region: 'Bali', weight: '8.9 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzQVONzE8ujqkDk1BU-_0G3_wYoeXxQCgfQhvLEu8YjNO8zUe-nD9T-Vp2yOYXotLZ8_rSve-f561Jg0Io65hzZy5ronY7Pt2Qjrrqj8cFwKlOYuyKltl2XCpJHpKdzB4iTvviHUhMYK8Hb_CgkJTqLC8DcIZCk55iFUbMu28o5GGbK1531IwV48X1GhaTUX4u3E3DmULyQdEkp3yBx5gW8Ejzbk1Xg3u41gwM2tZqlZLZ8D9YLIdn331vvtLwfyqqz-8g4ys98v9n' },
    { rank: 7, name: 'Ginanjar', region: 'Jawa Tengah', weight: '8.5 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzPF3OfNV0BU0SPV-qWB6tkYbe2MyYZ3r5mkLRlu4vF8lb-xEviciSaO6Bq6dhESJOALvFmKze-fq_sNqIaAuSFcz9zfiOXgLKDf5juAgyywVzI87KIXPofmZL3iKlH-WDBCqbYSf8GPITiJ9l58aKhKHc8_rhAMqMq561PCaRfSRbb6Fz3PKWaxD7H2ofN__Ihbi6J72alHvlGiGHM-nLFZ1dKTxosJfeNXml9EalXWqCmhlccqGyMscGK837_FAdFralXgyjnMcs' },
    { rank: 8, name: 'Hani', region: 'Sulawesi Selatan', weight: '8.1 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvGZ0DiSVJjB4LSKH6J9h9pODwE9_662xq4qe8ucfWDGcBlac59vIHfLu6muXgXS3wHkdZLmUbwbvlHJ93Dnep4HMdSIEpjGPPYe-AU3ZBAkenZzqqiel4wOSpd8M0UIGXpDVDjj7Ccmd4MOwAevDXYx7ZKl7WZqGk4uNkuSzYEhjxCBgZPVPQUHoABgBn9zK6Q9RhOgojXg_JrTIoKXrUcS7cZ_Nuyyn1FN3dxT-DaRAYzuK9cgv_mGmD_RECd51szRSKvg29Sr9h' },
    { rank: 9, name: 'Indra', region: 'Kalimantan Barat', weight: '7.9 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJANTt2hGi1s_FlBvq6PNVw2kaHoBqlk0Alrd6dD2gUYTAsGl_SSIO-cdJp2COMtMC40OLbkrr0_utmxw5hqm9zK-sVR5gQ9XwBGMrgPoKgufsLnZ1OS8xDLbnjjAtO36HBLNocPSsw-95NB-Dt_U6Iodl4GIG5tFYQrIwSaIdN3_MKvjk3dBgX03RVcTNbpLJScZul2YfGK2nBiJWebTiOmp0RdFI-h_--paMh-ccEUwDwxALLQsRoFfrpPnpk2QtwrVpbcOLtos_' },
    { rank: 10, name: 'Joko', region: 'Jawa Timur', weight: '7.8 Kg', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfL_zLybt4ZlGG-YYmg28YtXVFLP24EsJhd0wMNl3eHj2_0iPkVC32v10s1ZTWv5j71elkXGdZMDK9uW13OMBWlhCpTl7cSvcYUKHHLrJPY4EObqqO9vaP13NzGGsgknwbYDPLlDHSPXQPyjsVYFzEYx9FvDfboyNQQF0ixU1MMxOFHKtZqlcDF2Kn0GQM_E_iGl9UfgLoAn-jQzHiEYzzeWmdZ1cdfAlIoRU_e4Bl612KwcbWGE-YgEtReaq11786ful8o5QRrc_2' },
  ];

  const myRank = {
    rank: 42,
    name: 'Anda (Kamu)',
    weight: '3.5 Kg',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7hKJmevGfU1Gd683H_BCtA5sDUYPqVmcCV6I7rSxLXV1hY4MrtFFsxbmpClUF04azg8_9mMDQq2Q9Vk8XSVpO6t4WFBJkKtavgKhrWpyJlkp5gyGolJylLua8jazObuRfQlgTWMW81pLyd7TVlPplxnCmSLYkHfMp0b7hPIkGRTltNh6k_QVyIDI5ybXr-n03raBi6uxzOUYdJB8s0WwAixvT8jFuStRFT160PVsYzKPpIyJHg43DUHsExAcCcj5TU_4Ctt3NvrZA',
    status: 'Naik 2 posisi',
  };

  const handleTabPress = (tab: string) => {
    setActiveNavTab(tab);
    switch(tab) {
      case 'map':
        router.push('/mapAwal');
        break;
      case 'tickets':
        router.push('/tiketsaya');
        break;
      case 'tournament':
        router.push('/turnamen');
        break;
      case 'feed':
        router.push('/feed');
        break;
      default:
        // Untuk tab 'rank', tetap di halaman ini
        break;
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard Nasional</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe.id}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe.id && styles.timeframeButtonActive,
            ]}
            onPress={() => setSelectedTimeframe(timeframe.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.timeframeText,
              selectedTimeframe === timeframe.id && styles.timeframeTextActive,
            ]}>
              {timeframe.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          <View style={styles.podiumBackground} />
          
          <View style={styles.topThreeContainer}>
            {/* Second Place */}
            <View style={styles.rankerCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: topRankers[1].avatar }}
                  style={[styles.avatar, { borderColor: topRankers[1].borderColor }]}
                />
                <View style={[styles.rankBadge, { backgroundColor: topRankers[1].borderColor }]}>
                  <Text style={styles.rankBadgeText}>#{topRankers[1].rank}</Text>
                </View>
              </View>
              <Text style={styles.rankerName}>{topRankers[1].name}</Text>
              <Text style={styles.rankerWeight}>{topRankers[1].weight}</Text>
              <View style={[styles.podiumBar, { height: topRankers[1].height }]}>
                <Text style={styles.podiumNumber}>2</Text>
              </View>
            </View>

            {/* First Place */}
            <View style={styles.rankerCard}>
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="crown" size={32} color="#f39c12" style={styles.crownIcon} />
                <Image
                  source={{ uri: topRankers[0].avatar }}
                  style={[styles.avatar, styles.firstPlaceAvatar, { borderColor: topRankers[0].borderColor }]}
                />
                <View style={[styles.rankBadge, { backgroundColor: topRankers[0].borderColor }]}>
                  <Text style={styles.rankBadgeText}>#{topRankers[0].rank}</Text>
                </View>
              </View>
              <Text style={styles.rankerName}>{topRankers[0].name}</Text>
              <Text style={styles.rankerWeight}>{topRankers[0].weight}</Text>
              <View style={[styles.podiumBar, styles.firstPlaceBar, { height: topRankers[0].height }]}>
                <Text style={styles.podiumNumber}>1</Text>
              </View>
            </View>

            {/* Third Place */}
            <View style={styles.rankerCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: topRankers[2].avatar }}
                  style={[styles.avatar, { borderColor: topRankers[2].borderColor }]}
                />
                <View style={[styles.rankBadge, { backgroundColor: topRankers[2].borderColor }]}>
                  <Text style={styles.rankBadgeText}>#{topRankers[2].rank}</Text>
                </View>
              </View>
              <Text style={styles.rankerName}>{topRankers[2].name}</Text>
              <Text style={styles.rankerWeight}>{topRankers[2].weight}</Text>
              <View style={[styles.podiumBar, { height: topRankers[2].height }]}>
                <Text style={styles.podiumNumber}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Anglers List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Anglers (4-50)</Text>
        </View>

        <View style={styles.rankersList}>
          {otherRankers.map((ranker) => (
            <View key={ranker.rank} style={styles.rankerRow}>
              <Text style={styles.rankNumber}>{ranker.rank}</Text>
              <Image
                source={{ uri: ranker.avatar }}
                style={styles.smallAvatar}
              />
              <View style={styles.rankerInfo}>
                <Text style={styles.rankerRowName}>{ranker.name}</Text>
                <Text style={styles.rankerRegion}>{ranker.region}</Text>
              </View>
              <Text style={styles.rankerRowWeight}>{ranker.weight}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* My Rank Card */}
      <View style={styles.myRankCard}>
        <LinearGradient
          colors={['#0A3D62', '#0A3D62']}
          style={styles.myRankGradient}
        >
          <View style={styles.myRankContent}>
            <View style={styles.myRankLeft}>
              <Text style={styles.myRankLabel}>Rank</Text>
              <Text style={styles.myRankNumber}>{myRank.rank}</Text>
            </View>
            <Image
              source={{ uri: myRank.avatar }}
              style={styles.myRankAvatar}
            />
            <View style={styles.myRankInfo}>
              <Text style={styles.myRankName}>{myRank.name}</Text>
              <View style={styles.rankStatus}>
                <MaterialIcons name="arrow-upward" size={14} color="#2ecc71" />
                <Text style={styles.rankStatusText}>{myRank.status}</Text>
              </View>
            </View>
            <Text style={styles.myRankWeight}>{myRank.weight}</Text>
          </View>
          
          <TouchableOpacity style={styles.shareButton}>
            <MaterialIcons name="share" size={20} color="#FFF" />
            <Text style={styles.shareButtonText}>Share My Rank</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Bottom Navigation - SAMA PERSIS SEPERTI mapAwal.tsx */}
      <View style={styles.bottomNav}>
        {navTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.navTab}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            {tab.id === 'rank' ? (
              <>
                <View style={styles.activeTabIndicator}>
                  <View style={styles.activeTabCircle}>
                    <MaterialIcons name="leaderboard" size={30} color="#fff" />
                    <View style={styles.tabHighlight} />
                  </View>
                </View>
                <Text style={styles.navTabTextActive}>{tab.label}</Text>
              </>
            ) : (
              <>
                <MaterialIcons 
                  name={tab.icon as any} 
                  size={24} 
                  color={activeNavTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)'} 
                  style={styles.navTabIcon}
                />
                <Text style={[
                  styles.navTabText,
                  activeNavTab === tab.id && styles.navTabTextActive
                ]}>
                  {tab.label}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    paddingTop: -55,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111518',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f3f4',
    margin: 16,
    borderRadius: 16,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  timeframeButtonActive: {
    backgroundColor: '#0a3d61',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#637888',
  },
  timeframeTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  podiumContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    position: 'relative',
  },
  podiumBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#eef2f5',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 20,
  },
  rankerCard: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    backgroundColor: '#FFF',
  },
  firstPlaceAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#f39c12',
  },
  crownIcon: {
    position: 'absolute',
    top: -36,
    left: '50%',
    transform: [{ translateX: -16 }],
    zIndex: 10,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: [{ translateX: -20 }],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 40,
    alignItems: 'center',
  },
  rankBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  rankerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111518',
    marginBottom: 2,
    textAlign: 'center',
  },
  rankerWeight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2ecc71',
    marginBottom: 8,
  },
  podiumBar: {
    width: '100%',
    backgroundColor: '#eef2f5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  firstPlaceBar: {
    backgroundColor: '#e8edf0',
  },
  podiumNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.1)',
    paddingBottom: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#637888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rankersList: {
    paddingHorizontal: 16,
  },
  rankerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f3f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rankNumber: {
    width: 24,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#637888',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  rankerInfo: {
    flex: 1,
  },
  rankerRowName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111518',
  },
  rankerRegion: {
    fontSize: 12,
    color: '#637888',
    marginTop: 2,
  },
  rankerRowWeight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0a3d61',
  },
  myRankCard: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  myRankGradient: {
    padding: 16,
  },
  myRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  myRankLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  myRankLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  myRankNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  myRankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  myRankInfo: {
    flex: 1,
  },
  myRankName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  rankStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rankStatusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  myRankWeight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2ecc71',
  },
  shareButton: {
    backgroundColor: '#f39c12',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  // NAVBAR STYLES - SAMA PERSIS DENGAN mapAwal.tsx
  bottomNav: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#0A3D62',
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 8,
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -48,
    alignItems: 'center',
  },
  activeTabCircle: {
    width: 64,
    height: 64,
    backgroundColor: '#13a4ec',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13a4ec',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 6,
    borderColor: '#0A3D62',
  },
  tabHighlight: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  navTabIcon: {
    marginBottom: 4,
  },
  navTabText: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 12,
  },
  navTabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});