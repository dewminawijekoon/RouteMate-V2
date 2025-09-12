import React, { useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18n from '@/src/i18n';
import { ThemedText } from '@/components/ThemedText';

type IconName = keyof typeof Ionicons.glyphMap;

export default function LanguageSelector() {
  const { t } = useTranslation();
  const current = (i18n.language || 'en').startsWith('si') ? 'si' : 'en';

  const setLang = useCallback(async (lng: 'en' | 'si') => {
    if (current !== lng) {
      await i18n.changeLanguage(lng);
    }
  }, [current]);

  const Pill = ({ code, label }: { code: 'en' | 'si'; label: string }) => {
    const selected = current === code;
    const icon: IconName = selected ? 'radio-button-on' : 'radio-button-off';
    return (
      <Pressable onPress={() => setLang(code)} style={[styles.pill, selected && styles.pillSelected]} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={label}>
        <Ionicons name={icon} size={16} color={selected ? '#fff' : '#0B1220'} />
        <ThemedText style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</ThemedText>
      </Pressable>
    );
  };

  return (
    <View style={styles.row}>
      <Pill code="en" label={t('english')} />
      <Pill code="si" label={t('sinhala')} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  pillSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  pillText: { color: '#0B1220', fontWeight: '600' },
  pillTextSelected: { color: '#fff' },
});

