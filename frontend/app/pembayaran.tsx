import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TextInput,
  Dimensions, 
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PaymentScreen() { 
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState('credit-card');
  const [showCreditCardForm, setShowCreditCardForm] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);

  const paymentMethods = [
    {
      id: 'ewallet',
      name: 'E-Wallet', 
      description: 'OVO, GoPay, Dana',
      icon: 'account-balance-wallet',
      color: '#0c4a6e',
      bgColor: 'rgba(12, 74, 110, 0.1)',
    },
    {
      id: 'bank-transfer',
      name: 'Transfer Bank',
      description: 'BCA, Mandiri, BNI',
      icon: 'account-balance',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'credit-card',
      name: 'Kartu Kredit / Debit',
      description: 'Visa, Mastercard',
      icon: 'credit-card',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    if (methodId === 'credit-card') {
      setShowCreditCardForm(true);
    }
  };

  const handleConfirmPayment = () => {
    // Navigate to success screen
    router.push('/pembayaranberhasil');
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
          
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <View style={styles.orderImageContainer}>
                <ImageBackground
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2hKkSxIJujHXtAEdQWPL9OnvR8UpnXRGLUmBW2UJxzSwQbALBnxyYzP_lBIljVBLmQTqLgafV0E4eDAiF0clsiq864KGa4fRUg4uZh2SfJGpCoZOjLpABAcgHrUjIRt7xcMtj5KPfE1D50WP9XvI9D28-RtQcKq3aQV_kQL3dUe4taLi-1U7cnwujfkYf7D_Azx4x8GkARh3UFkj3CWs2Xgc8bJXQY_tNgZeGln5p_b26IWL5N-o8ZwzbNVPpoAZVf1uWQi2Jg5Tg' }}
                  style={styles.orderImage}
                  imageStyle={styles.orderImageStyle}
                />
              </View>
              
              <View style={styles.orderDetails}>
                <Text style={styles.orderName}>Pemancingan Galatama Spot A</Text>
                <Text style={styles.orderType}>Premium VIP Spot</Text>
                <View style={styles.orderPriceRow}>
                  <Text style={styles.orderPrice}>Rp 150.000</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.orderMeta}>
              <View style={styles.metaItem}>
                <View style={[styles.metaIcon, { backgroundColor: 'rgba(244, 157, 37, 0.1)' }]}>
                  <MaterialIcons name="calendar-today" size={18} color="#f49d25" />
                </View>
                <View style={styles.metaText}>
                  <Text style={styles.metaLabel}>TANGGAL</Text>
                  <Text style={styles.metaValue}>Sabtu, 24 Okt</Text>
                </View>
              </View>
              
              <View style={styles.metaItem}>
                <View style={[styles.metaIcon, { backgroundColor: 'rgba(12, 74, 110, 0.1)' }]}>
                  <MaterialIcons name="schedule" size={18} color="#0c4a6e" />
                </View>
                <View style={styles.metaText}>
                  <Text style={styles.metaLabel}>WAKTU</Text>
                  <Text style={styles.metaValue}>08:00 - 12:00</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.id && styles.paymentMethodSelected,
                ]}
                onPress={() => handlePaymentSelect(method.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.methodIcon, { backgroundColor: method.bgColor }]}>
                  <MaterialIcons name={method.icon as any} size={20} color={method.color} />
                </View>
                
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    selectedPayment === method.id && styles.radioOuterSelected
                  ]}>
                    {selectedPayment === method.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Credit Card Form */}
          {showCreditCardForm && selectedPayment === 'credit-card' && (
            <View style={styles.creditCardForm}>
              <View style={styles.securityNote}>
                <MaterialIcons name="lock" size={14} color="#10b981" />
                <Text style={styles.securityText}>
                  Pembayaran aman dengan enkripsi SSL 256-bit
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nomor Kartu</Text>
                <View style={styles.cardInputContainer}>
                  <TextInput
                    style={styles.cardInput}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#94a3b8"
                    value={formatCardNumber(cardNumber)}
                    onChangeText={(text) => setCardNumber(text)}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                  <View style={styles.cardIcons}>
                    <View style={styles.cardIcon} />
                    <View style={styles.cardIcon} />
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Masa Berlaku</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="MM/YY"
                    placeholderTextColor="#94a3b8"
                    value={formatExpiryDate(expiryDate)}
                    onChangeText={(text) => setExpiryDate(text)}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <View style={styles.cvvLabelRow}>
                    <Text style={styles.formLabel}>CVV</Text>
                    <TouchableOpacity>
                      <MaterialIcons name="help" size={14} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.formInput}
                    placeholder="123"
                    placeholderTextColor="#94a3b8"
                    value={cvv}
                    onChangeText={(text) => setCvv(text)}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nama Pemegang Kartu</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nama Lengkap"
                  placeholderTextColor="#94a3b8"
                  value={cardName}
                  onChangeText={(text) => setCardName(text)}
                />
              </View>
            </View>
          )}
        </View>

        {/* Promo Code */}
        <TouchableOpacity 
          style={styles.promoSection}
          onPress={() => setShowPromoModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.promoIcon}>
            <MaterialIcons name="local-offer" size={20} color="#10b981" />
          </View>
          <View style={styles.promoInfo}>
            <Text style={styles.promoTitle}>Gunakan Promo / Diskon</Text>
            <Text style={styles.promoSubtitle}>Hemat hingga 50% untuk pengguna baru</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#64748b" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Payment Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Tagihan</Text>
          <Text style={styles.totalAmount}>Rp 150.000</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Konfirmasi Pembayaran</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Promo Modal */}
      <Modal
        visible={showPromoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kode Promo</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowPromoModal(false)}
              >
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                placeholder="Masukkan kode promo"
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Terapkan</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.availablePromos}>
              <Text style={styles.availableTitle}>Promo Tersedia</Text>
              
              <TouchableOpacity style={styles.promoItem}>
                <View style={styles.promoItemIcon}>
                  <MaterialIcons name="celebration" size={20} color="#f49d25" />
                </View>
                <View style={styles.promoItemInfo}>
                  <Text style={styles.promoItemTitle}>NEWUSER50</Text>
                  <Text style={styles.promoItemDesc}>Diskon 50% untuk pengguna baru</Text>
                </View>
                <Text style={styles.promoItemApply}>PILIH</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.promoItem}>
                <View style={styles.promoItemIcon}>
                  <MaterialIcons name="weekend" size={20} color="#0c4a6e" />
                </View>
                <View style={styles.promoItemInfo}>
                  <Text style={styles.promoItemTitle}>WEEKEND30</Text>
                  <Text style={styles.promoItemDesc}>Diskon 30% setiap weekend</Text>
                </View>
                <Text style={styles.promoItemApply}>PILIH</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.promoItem}>
                <View style={styles.promoItemIcon}>
                  <MaterialIcons name="panorama-fisheye" size={20} color="#10b981" />
                </View>
                <View style={styles.promoItemInfo}>
                  <Text style={styles.promoItemTitle}>MANCING20</Text>
                  <Text style={styles.promoItemDesc}>Diskon 20% semua spot</Text>
                </View>
                <Text style={styles.promoItemApply}>PILIH</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f49d25',
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  orderRow: {
    flexDirection: 'row',
    padding: 16,
  },
  orderImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
  orderImageStyle: {
    resizeMode: 'cover',
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  orderType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  orderPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f49d25',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
  },
  orderMeta: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  paymentMethodSelected: {
    borderColor: '#f49d25',
    backgroundColor: 'rgba(244, 157, 37, 0.05)',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  radioContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#f49d25',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f49d25',
  },
  creditCardForm: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f49d25',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardInputContainer: {
    position: 'relative',
  },
  cardInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1e293b',
  },
  cardIcons: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    gap: 4,
  },
  cardIcon: {
    width: 24,
    height: 16,
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1e293b',
  },
  cvvLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  promoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(110, 231, 183, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f49d25',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f49d25',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: '#f49d25',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1e293b',
  },
  applyButton: {
    backgroundColor: '#f49d25',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  availablePromos: {
    marginTop: 8,
  },
  availableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  promoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  promoItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  promoItemInfo: {
    flex: 1,
  },
  promoItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  promoItemDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  promoItemApply: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f49d25',
  },
});