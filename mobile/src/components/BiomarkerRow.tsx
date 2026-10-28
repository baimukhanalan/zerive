// A biomarker list row: name + current value, status pill, mini sparkline and
// trend delta. Tapping routes to the detail screen. Shared by Data & Home.

import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { StatusDot } from './Card';
import { Sparkline } from './Sparkline';
import { ChevronRight } from './icons';
import { colors, spacing, radius, statusColors } from '@/theme';
import { useL10n } from '@/i18n';
import { num, trendDelta } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import type { Biomarker } from '@/data/types';

export function BiomarkerRow({ marker, showSpark = true }: { marker: Biomarker; showSpark?: boolean }) {
  const L = useL10n();
  const router = useRouter();
  const { fg } = statusColors(marker.status);
  const delta = trendDelta(marker);

  return (
    <Pressable
      onPress={() => { haptic.light(); router.push(`/biomarker/${marker.id}`); }}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.8 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`${L(marker.name)}, ${num(marker.value)} ${marker.unit}`}
    >
      <View style={styles.left}>
        <StatusDot status={marker.status} />
        <View style={styles.info}>
          <Text variant="bodyMd" numberOfLines={1}>{L(marker.name)}</Text>
          <Text variant="label" color="text3">{marker.abbr}</Text>
        </View>
      </View>

      {showSpark ? <Sparkline data={marker.history.map((h) => h.value)} color={fg} width={56} height={26} /> : null}

      <View style={styles.value}>
        <Text variant="bodyMd" style={{ fontFamily: 'IBMPlexMono_500Medium' }}>{num(marker.value)}</Text>
        <Text variant="label" color="text3">{marker.unit}</Text>
      </View>

      <View style={styles.trail}>
        {delta ? <Text variant="label" style={{ color: delta.dir === 'flat' ? colors.text3 : fg }}>{delta.label}</Text> : null}
        <ChevronRight size={16} color={colors.text3} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  info: { flex: 1, gap: 1 },
  value: { alignItems: 'flex-end', width: 58 },
  trail: { alignItems: 'flex-end', gap: 2, width: 42 },
});
