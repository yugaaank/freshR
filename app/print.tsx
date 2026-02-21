import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';
import { router } from 'expo-router';

type Slot = {
  label: string;
  value: string;
};

type UploadedDoc = {
  name: string;
  size: number;
};

function generateTimeSlots(startHour = 8, endHour = 18, stepMinutes = 10): Slot[] {
  const slots: Slot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({ label, value: label });
    }
  }
  return slots;
}

const MOCK_DOCS: UploadedDoc[] = [
  { name: 'SemesterProject.pdf', size: 512_000 },
  { name: 'Resume.pdf', size: 256_000 },
  { name: 'LabReport.pdf', size: 345_000 },
];

const createQRCode = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export default function PrintRequestScreen() {
  const [document, setDocument] = useState<UploadedDoc | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [slotOpen, setSlotOpen] = useState(false);
  const slots = useMemo(() => generateTimeSlots(8, 18, 10), []);

  const handleUpload = () => {
    // Cycle through mock documents to keep the UI interactive until a real picker is implemented.
    const nextIndex = document ? (MOCK_DOCS.findIndex((doc) => doc.name === document.name) + 1) % MOCK_DOCS.length : 0;
    setDocument(MOCK_DOCS[nextIndex]);
    setStatusMessage(null);
  };

  const handleSchedule = () => {
    if (!document) {
      setStatusMessage('Upload a PDF to send to stationery.');
      return;
    }
    if (!selectedSlot) {
      setStatusMessage('Pick a 10-minute slot so the stationery team can prepare.');
      return;
    }
    setStatusMessage(null);
    router.push({
      pathname: '/print/payment',
      params: {
        doc: document.name,
        slot: selectedSlot,
      },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Ionicons name="print" size={32} color="#FFF" />
          <Text style={styles.heroTitle}>Express Print Request</Text>
          <Text style={styles.heroSubtitle}>
            Upload your PDF and choose a 10-minute pickup window. Stationery will print on demand and have it ready
            at the counter.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Step 1 · Upload your document</Text>
          <Text style={styles.sectionDesc}>Only PDF files are accepted today.</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} activeOpacity={0.75}>
            <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} />
            <Text style={styles.uploadBtnText}>{document ? 'Replace PDF' : 'Upload PDF'}</Text>
          </TouchableOpacity>
          {document && (
            <View style={styles.docPreview}>
              <View>
                <Text style={styles.docName}>{document.name}</Text>
                <Text style={styles.docMeta}>{Math.max(Math.round((document.size ?? 0) / 1024), 1)} KB · PDF</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Step 2 · Reserve your 10-min slot</Text>
          <Text style={styles.sectionDesc}>
            Stationery opens from 8:00 AM to 6:00 PM. We hold your print request for 10 minutes so you can collect it easily.
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, slotOpen && styles.dropdownActive]}
            activeOpacity={0.8}
            onPress={() => setSlotOpen((prev) => !prev)}
          >
            <Text style={[styles.dropdownLabel, selectedSlot ? styles.dropdownLabelActive : styles.dropdownPlaceholder]}>
              {selectedSlot ?? 'Select a 10 min window'}
            </Text>
            <Ionicons name={slotOpen ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
          {slotOpen && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
                {slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedSlot(slot.value);
                      setSlotOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{slot.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Step 3 · Confirm delivery</Text>
          <Text style={styles.sectionDesc}>
            Once submitted, stationery receives the PDF instantly and prints it before your selected window. Proceed to pay to generate the pickup QR.
          </Text>
          <TouchableOpacity
            style={styles.scheduleBtn}
            activeOpacity={0.8}
            onPress={handleSchedule}
          >
            <Text style={styles.scheduleText}>Proceed to payment</Text>
          </TouchableOpacity>
          {statusMessage && (
            <Text
              style={[
                styles.statusMessage,
                statusMessage.startsWith('Pick') ? styles.statusError : styles.statusSuccess,
              ]}
            >
              {statusMessage}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.section,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.background,
  },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  heroTitle: {
    ...Typography.h2,
    color: '#FFF',
    marginTop: Spacing.xs,
  },
  heroSubtitle: {
    ...Typography.body2,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
  },
  uploadBtnText: {
    ...Typography.label,
    color: Colors.primary,
    fontWeight: '700',
  },
  docPreview: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docName: {
    ...Typography.h5,
  },
  docMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownActive: {
    borderColor: Colors.primary,
  },
  dropdownLabel: {
    ...Typography.body2,
  },
  dropdownPlaceholder: {
    color: Colors.textTertiary,
  },
  dropdownLabelActive: {
    color: Colors.text,
    fontWeight: '700',
  },
  dropdownList: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  dropdownItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  dropdownItemText: {
    ...Typography.body2,
    color: Colors.text,
  },
  scheduleBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  scheduleText: {
    ...Typography.label,
    color: '#FFF',
    fontWeight: '700',
  },
  statusMessage: {
    marginTop: Spacing.sm,
    ...Typography.body2,
  },
  statusSuccess: {
    color: Colors.success,
  },
  statusError: {
    color: Colors.warning,
  },
});
