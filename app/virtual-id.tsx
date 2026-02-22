import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Spacing, Typography, Gradients } from '../src/theme';

const { width: SW } = Dimensions.get('window');
const CARD_WIDTH = SW - (Spacing.section * 2);
const CARD_HEIGHT = CARD_WIDTH * 1.58; // Standard ID card ratio

export default function VirtualIDScreen() {
  const { profile } = useUserStore();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtual ID Card</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={['#1E293B', '#0F172A']}
            style={[styles.idCard, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
          >
            {/* Design Accents */}
            <View style={styles.accentCircle} />
            <View style={styles.accentLine} />

            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.logoWrap}>
                <Ionicons name="flash" size={20} color={Colors.primary} />
                <Text style={styles.logoText}>FRESHR</Text>
              </View>
              <View style={styles.chipWrap}>
                <View style={styles.chip} />
              </View>
            </View>

            {/* Photo & Basic Info */}
            <View style={styles.photoSection}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: profile?.avatar_url ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }}
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.nameText}>{profile?.name ?? 'Yugank Rathore'}</Text>
              <Text style={styles.roleText}>STUDENT</Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>REGISTER NUMBER</Text>
                <Text style={styles.detailValue}>{profile?.roll_no ?? '22BCS10042'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>BRANCH</Text>
                <Text style={styles.detailValue}>{profile?.branch ?? 'Computer Science'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>YEAR</Text>
                <Text style={styles.detailValue}>{profile?.year ?? 2026}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>COLLEGE</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{profile?.college ?? 'Christ University'}</Text>
              </View>
            </View>

            {/* Barcode / Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.barcodeContainer}>
                {[...Array(30)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.barcodeLine,
                      { width: Math.random() * 3 + 1, marginLeft: Math.random() * 2 }
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.validText}>VALID UNTIL JUNE 2026</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.hintContainer}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textTertiary} />
          <Text style={styles.hintText}>This digital ID is valid for campus entry and library services.</Text>
        </View>

        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
          <LinearGradient colors={[Colors.primary, '#E65100']} style={styles.gradientBtn}>
            <Ionicons name="download-outline" size={20} color="#FFF" />
            <Text style={styles.downloadText}>Download Offline Copy</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 60,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.divider,
  },
  headerTitle: { ...Typography.h3, color: Colors.text },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 25,
  },
  idCard: {
    borderRadius: 24,
    padding: Spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  accentCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(252, 128, 25, 0.05)',
  },
  accentLine: {
    position: 'absolute',
    bottom: 100,
    left: -20,
    width: '120%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: [{ rotate: '-15deg' }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: {
    fontSize: 18,
    fontFamily: 'Sora_700Bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  chipWrap: {
    width: 45,
    height: 35,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
    padding: 4,
    justifyContent: 'center',
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primary,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  nameText: {
    ...Typography.h2,
    color: '#FFF',
    textAlign: 'center',
  },
  roleText: {
    ...Typography.micro,
    color: Colors.primary,
    fontFamily: 'Sora_700Bold',
    letterSpacing: 4,
    marginTop: 4,
  },
  detailsGrid: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  detailItem: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(252, 128, 25, 0.3)',
    paddingLeft: Spacing.md,
  },
  detailLabel: {
    ...Typography.micro,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  detailValue: {
    ...Typography.body2,
    color: '#FFF',
    fontFamily: 'Sora_600SemiBold',
    marginTop: 2,
  },
  cardFooter: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.xl,
    right: Spacing.xl,
    alignItems: 'center',
  },
  barcodeContainer: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  barcodeLine: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  validText: {
    ...Typography.micro,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  hintText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  downloadBtn: {
    marginTop: Spacing.xl,
    width: SW - (Spacing.section * 2),
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  downloadText: {
    ...Typography.body1,
    color: '#FFF',
    fontFamily: 'Sora_700Bold',
  },
});
