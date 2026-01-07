import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground, 
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';


const { width, height } = Dimensions.get('window');

export default function OnboardingFindSpots() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Find Your Perfect Cast', description: 'Discover hidden gems and premium fishing spots curated just for you. Fishing, elevated.' },
    { title: 'Book Instantly', description: 'Reserve your spot with just a few taps. No calls, no waiting.' },
    { title: 'Start Fishing', description: 'Arrive and enjoy. Everything is ready for your perfect fishing experience.' }
  ];

  const handleNext = () => {
      // Navigate to main app
      router.replace('/onboarding2');
    
  };
 
  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Background with decorative elements */}
      <View style={styles.background}>
        {/* Top right blur circle */}
        <View style={styles.topRightBlur} />
        {/* Bottom left blur circle */}
        <View style={styles.bottomLeftBlur} />
      </View>

      {/* Main content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImageContainer}>
            <ImageBackground
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDU-z7b9hbpAN4lckYcHJsjjt8Scw9rGY--GUVUV9EGSkgvVVll-OQXC4F67Gk2Xj2pSFyLeOz_vQ7Vk3iPgevG_39EI7R4wUjWK42RmP4JgB8xZwA9Dce2IWB2rz33x7MGD92uQ91aS05xHlvLcwQxmQ10Rc33o7VE-WFGbINbMgBWaCpGmVMK8AwWMKdPDn7q9Sn__zdITVxGBtgxwpMhFDZjnmcS61Zdge9utCtkmS1GuPsf_1_lNHoYCd-mviPMdV4Yr6jLXeF' }}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            >
              {/* Gradient overlay */}
              <View style={styles.imageOverlay} />
              
              {/* Featured Spot Card */}
              <BlurView style={styles.featuredCard}>
                <View style={styles.featuredCardContent}>
                  <View style={styles.featuredIconContainer}>
                    <MaterialIcons name="star" size={20} color="#f97316" />
                  </View>
                  <View style={styles.featuredTextContainer}>
                    <Text style={styles.featuredLabel}>FEATURED SPOT</Text>
                    <Text style={styles.featuredTitle}>Danau Toba, North Sumatra</Text>
                  </View>
                </View>
                <View style={styles.arrowContainer}>
                  <MaterialIcons name="arrow-outward" size={18} color="#64748b" />
                </View>
              </BlurView>
            </ImageBackground>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Badge */}
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>New Experience</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Find Your{"\n"}
            <Text style={styles.titleGradient}>Perfect Cast</Text>
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Discover hidden gems and premium fishing spots curated just for you. Fishing, elevated.
          </Text>

          {/* Steps Indicator */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepDots}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index === currentStep ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>

            {/* Skip Button (only show if not last step) */}
            {currentStep < steps.length - 1 && (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep < steps.length - 1 ? 'Next Step' : 'Get Started'}
            </Text>
            <View style={styles.nextButtonIcon}>
              <MaterialIcons 
                name={currentStep < steps.length - 1 ? "arrow-forward" : "check"} 
                size={20} 
                color="#0a3d61" 
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topRightBlur: {
    position: 'absolute',
    top: -200,
    right: -200,
    width: 400,
    height: 400,
    backgroundColor: 'rgba(219, 234, 254, 0.5)',
    borderRadius: 200,
  },
  bottomLeftBlur: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderRadius: 150,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  heroImageContainer: {
    width: width * 0.85,
    aspectRatio: 3/4,
    maxHeight: 460,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#0a3d61',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  }, 
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(10, 61, 97, 0.05)',
  },
  featuredCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    overflow: 'hidden', // untuk clip blur
  },
  featuredCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featuredIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a3d61',
    marginTop: 2,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -4,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.03,
    shadowRadius: 40,
    elevation: 5,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2dd4bf',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a3d61',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0a3d61',
    lineHeight: 38,
    marginBottom: 16,
  },
  titleGradient: {
    color: '#2dd4bf',
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginTop: 'auto',
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#0a3d61',
  },
  inactiveDot: {
    backgroundColor: '#e2e8f0',
    width: 6,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a3d61',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#0a3d61',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  nextButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  nextButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});