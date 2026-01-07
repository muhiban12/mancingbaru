// apps/(onboarding)/onboarding2.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity, 
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router'; 
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OnboardingEasyBooking() {
  const router = useRouter();
  const floatAnim1 = useState(new Animated.Value(0))[0];
  const floatAnim2 = useState(new Animated.Value(0))[0];
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Floating animation for icons
    const createFloatAnimation = (animatedValue: Animated.Value, delay: number = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: -10,
            duration: 3000,
            useNativeDriver: true, 
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createFloatAnimation(floatAnim1);
    const animation2 = createFloatAnimation(floatAnim2, 1500);

    animation1.start();
    animation2.start();

    return () => {
      animation1.stop();
      animation2.stop();
    };
  }, []);

  const handleNext = () => {
    // Navigate to home or next onboarding screen
    router.replace('/onboarding3');
  };

  const handleBack = () => {
    router.replace('/onboarding1');
  };

  return (
    <View style={styles.container}>
      {/* Wave Background Pattern */}
      <View style={styles.background}>
        <ImageBackground
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJGmsXmFUOJLwP-iiaRzwiayYHAJPdrkcuaVdLHEpYlXoPLaX8XcSU7I8s4JF7wf6MTQOwBFkJ8kfjx65SHyKdAmzzafRCiepzV9rMYvZIt0AmSsvFJSWTzrmQVel7S9smIIMRx4iOuHaQv13HDA4JkHH974Qe4Cb9_eso0hGO0gzJT9Wa6hWphqUpUXpyz1LHrvW2_0om8v8cdoUoVmsAjuP3nBWy4Ybr_gOhr5OliI0OE6dL4vVO88WqLktq5_7Vsman1hk1lhzm' }}
          style={styles.waveBackground}
          imageStyle={{ opacity: 1 }}
        />
        <View style={styles.topRightBlur} />
        <View style={styles.bottomLeftBlur} />
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <MaterialIcons name="arrow-back" size={24} color="#0a3d61" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Icons */}
        <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
          <View style={styles.floatingIconContainer1}>
            <MaterialIcons name="verified" size={28} color="#4ade80" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
          <View style={styles.floatingIconContainer2}>
            <MaterialIcons name="phishing" size={24} color="#fff" />
          </View>
        </Animated.View>

        {/* Booking Card */}
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => {
                Animated.spring(scaleAnim, {
                  toValue: 1.02,
                  useNativeDriver: true,
                  tension: 100,
                  friction: 3,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  useNativeDriver: true,
                  tension: 100,
                  friction: 3,
                }).start();
              }}
            >
              {/* Card Header with Image */}
              <View style={styles.cardHeader}>
                <ImageBackground
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX3M3Hwmc10Gr9CmGyj4GCRGxQU03dkcpkoBd_U38Fu5LZM_491o_KEpX9qD-q09rlObHlSnpVAekHubRVQcBoArUGy_kWJqvW6bBs8o1Ry2rHLILnlvHrKQ7WiTtuH0DWiuQ5v00TSErcWcm4zB98HfiVj1KSuB3mZ-cFQAQbxVhs3HpcjYVh-H7IUMNIyxBhQRpecSjfKg_IxKlgPLwbDo54mZJ-LCadXNx0-Oep2QOAbv51OJYQLo0UHnX1tWXp06OW2nkkYNsb' }}
                  style={styles.cardImage}
                  imageStyle={{ resizeMode: 'cover' }}
                >
                  <View style={styles.cardImageOverlay}>
                    <View style={styles.locationContainer}>
                      <MaterialIcons name="location-on" size={16} color="#fff" />
                      <Text style={styles.premiumLabel}>PREMIUM SPOT</Text>
                    </View>
                    <Text style={styles.spotName}>Danau Sunter Paradise</Text>
                  </View>
                </ImageBackground>
              </View>

              {/* Dotted Separator */}
              <View style={styles.separator}>
                <View style={styles.separatorEndLeft} />
                <View style={styles.dottedLine} />
                <View style={styles.separatorEndRight} />
              </View>

              {/* Card Details */}
              <View style={styles.cardDetails}>
                {/* Water Drop Background Icon */}
                <MaterialIcons 
                  name="water-drop" 
                  size={120} 
                  color="rgba(10, 61, 97, 0.05)" 
                  style={styles.waterDropIcon}
                />

                {/* Date and Time */}
                <View style={styles.datetimeContainer}>
                  <View style={styles.datetimeItem}>
                    <Text style={styles.datetimeLabel}>DATE</Text>
                    <Text style={styles.datetimeValue}>Oct 24, 2024</Text>
                  </View>
                  <View style={styles.datetimeItem}>
                    <Text style={styles.datetimeLabel}>TIME</Text>
                    <Text style={styles.datetimeValue}>07:00 AM</Text>
                  </View>
                </View>

                {/* Seat and Price */}
                <View style={styles.seatPriceContainer}>
                  <View style={styles.seatInfo}>
                    <View style={styles.seatIconContainer}>
                      <MaterialIcons name="event-seat" size={20} color="#4ade80" />
                    </View>
                    <View style={styles.seatTextContainer}>
                      <Text style={styles.seatLabel}>Seat Number</Text>
                      <Text style={styles.seatValue}>A-12 (VIP)</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.price}>$25</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>
            Booking Spot{"\n"}Tanpa Ribet
          </Text>
          <Text style={styles.description}>
            Secure your favorite fishing spot in real-time. Experience the seamless way to start your journey.
          </Text>

          {/* Steps Indicator */}
          <View style={styles.stepsIndicator}>
            <View style={styles.inactiveStepDot} />
            <View style={styles.activeStepDot} />
            <View style={styles.inactiveStepDot} />
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <View style={styles.shimmerOverlay} />
            <Text style={styles.nextButtonText}>Get Started</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  waveBackground: {
    flex: 1,
    opacity: 1,
  },
  topRightBlur: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '80%',
    aspectRatio: 1,
    borderRadius: 200,
    backgroundColor: 'rgba(10, 61, 97, 0.05)',
  },
  bottomLeftBlur: {
    position: 'absolute',
    bottom: '20%',
    left: '-20%',
    width: '60%',
    aspectRatio: 1,
    borderRadius: 150,
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    alignItems: 'center',
  },
  floatingIcon1: {
    position: 'absolute',
    top: 100,
    right: 30,
    zIndex: 30,
  },
  floatingIconContainer1: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
    transform: [{ rotate: '6deg' }],
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: 400,
    left: 10,
    zIndex: 30,
  },
  floatingIconContainer2: {
    backgroundColor: 'rgba(10, 61, 97, 0.9)',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '-6deg' }],
  },
  cardContainer: {
    width: width * 0.85,
    maxWidth: 320,
    marginTop: 100,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  cardHeader: {
    height: 220,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(10, 61, 97, 0.9)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginLeft: 4,
    opacity: 0.9,
  },
  spotName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 24,
  },
  separatorEndLeft: {
    width: 12,
    height: 24,
    backgroundColor: '#f6f7f8',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  dottedLine: {
    flex: 1,
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
  },
  separatorEndRight: {
    width: 12,
    height: 24,
    backgroundColor: '#f6f7f8',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardDetails: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 16,
    position: 'relative',
  },
  waterDropIcon: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    opacity: 0.5,
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datetimeItem: {
    flex: 1,
  },
  datetimeLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  datetimeValue: {
    fontSize: 16,
    color: '#0a3d61',
    fontWeight: '700',
  },
  seatPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  seatTextContainer: {
    flex: 1,
  },
  seatLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  seatValue: {
    fontSize: 14,
    color: '#0a3d61',
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#d1d5db',
    marginHorizontal: 16,
  },
  price: {
    fontSize: 20,
    color: '#fb923c',
    fontWeight: '700',
  },
  contentSection: {
    marginTop: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0a3d61',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 340,
    fontWeight: '500',
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  activeStepDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0a3d61',
  },
  inactiveStepDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a3d61',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#0a3d61',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    right: -100,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginRight: 12,
  },
});