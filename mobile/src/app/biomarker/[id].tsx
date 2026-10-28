// Biomarker detail — value + trend delta, a visual range bar (lab + optimal),
// the history, plain-language explainers, related markers and safe next steps.

import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card, Eyebrow, StatusPill, Divider } from '@/components/Card';
import { TopBar } from '@/components/TopBar';
import { Sparkline } from '@/components/Sparkline';
import { Check } from '@/components/icons';
import { colors, spacing, radius, statusColors } from '@/theme';
import { useT, useL10n } from '@/i18n';
import { getBiomarker, getSystems } from '@/data/health';
import { num, rangeText, trendDelta } from '@/lib/format';
import type { Biomarker } from '@/data/types';

export default function BiomarkerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const L = useL10n();
  const router = useRouter();
  const marker = getBiomarker(String(id));

  if (!marker) {
    return <Screen><TopBar variant="back" /><Text variant="h3" color="muted">—</Text></Screen>;
  }

  const { fg } = statusColors(marker.status);
  const system = getSystems().find((s) => s.key === marker.system);
  const related = marker.related.map(getBiomarker).filter(Boolean).slice(0, 3) as Biomarker[];
  const delta = trendDelta(marker);
  const hasOptimal = marker.optimalLow != null || marker.optimalHigh != null;

  return (
    <Screen scroll>
      <TopBar variant="back" title={marker.abbr} />

      {/* Hero */}
      <View style={{ gap: spacing.sm }}>
        {system ? <Eyebrow>{L(system.name).toUpperCase()}</Eyebrow> : null}
        <Text variant="h1">{L(marker.name)}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.md }}>
          <Text variant="display" style={{ color: fg }}>{num(marker.value)}</Text>
          <Text variant="h3" color="faint">{marker.unit}</Text>
          {delta ? <Text variant="bodyMd" style={{ color: delta.dir === 'flat' ? colors.faint : fg }}>{delta.label}</Text> : null}
        </View>
        <StatusPill status={marker.status} label={t.status[marker.status]} />
      </View>

      {/* Range bar */}
      <Card style={{ marginTop: spacing.xl, gap: spacing.lg }}>
        <RangeBar marker={marker} />
        <View style={{ gap: spacing.sm }}>
          <InfoLine label={t.biomarker.lab} value={`${rangeText(marker.refLow, marker.refHigh)} ${marker.unit}`} />
          <InfoLine
            label={t.biomarker.opt}
            value={hasOptimal ? `${rangeText(marker.optimalLow, marker.optimalHigh)} ${marker.unit}` : t.biomarker.noOpt}
            accent
          />
        </View>
      </Card>

      {/* History */}
      <SectionLabel>{t.biomarker.hist}</SectionLabel>
      <Card style={{ gap: spacing.md }}>
        <Sparkline data={marker.history.map((h) => h.value)} color={fg} width={280} height={84} fill strokeWidth={2.5} />
        <View style={styles.axis}>
          {marker.history.map((h) => (
            <View key={h.date} style={{ alignItems: 'center', gap: 2 }}>
              <Text variant="bodyMd" style={{ fontFamily: 'IBMPlexMono_500Medium' }}>{num(h.value)}</Text>
              <Text variant="label" color="faint">{h.date}</Text>
            </View>
          ))}
        </View>
        {related.length > 0 && (
          <>
            <Divider />
            <View style={styles.relatedRow}>
              {related.map((r) => (
                <Pressable key={r.id} onPress={() => router.push(`/biomarker/${r.id}`)} style={styles.relatedChip}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: statusColors(r.status).fg }} />
                  <Text variant="label" color="text2">{r.abbr}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </Card>

      {/* What / why */}
      <SectionLabel>{t.biomarker.what}</SectionLabel>
      <Text variant="bodyLg" color="text2">{L(marker.what)}</Text>
      <SectionLabel>{t.biomarker.why}</SectionLabel>
      <Text variant="bodyLg" color="text2">{L(marker.why)}</Text>

      {/* Actions */}
      {marker.actions.length > 0 && (
        <>
          <SectionLabel>{t.biomarker.act}</SectionLabel>
          <View style={{ gap: spacing.sm }}>
            {marker.actions.map((a, i) => (
              <View key={i} style={styles.action}>
                <View style={styles.actionDot}><Check size={13} color={colors.accent} /></View>
                <Text variant="body" style={{ flex: 1 }}>{L(a)}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Pressable onPress={() => router.replace('/(tabs)/ai')} style={styles.askBtn}>
        <Text style={{ fontFamily: 'IBMPlexMono_500Medium', fontSize: 12.5, color: colors.accent }}>{`[ ${t.biomarker.ask} ]`}</Text>
      </Pressable>
    </Screen>
  );
}

function RangeBar({ marker }: { marker: Biomarker }) {
  const nums = [marker.refLow, marker.refHigh, marker.optimalLow, marker.optimalHigh, marker.value, ...marker.history.map((h) => h.value)]
    .filter((n): n is number => n != null);
  let lo = Math.min(...nums), hi = Math.max(...nums);
  const pad = (hi - lo) * 0.15 || Math.abs(hi) * 0.15 || 1;
  lo -= pad; hi += pad;
  const span = hi - lo || 1;
  const frac = (n: number) => Math.max(0, Math.min(1, (n - lo) / span));

  const { fg } = statusColors(marker.status);
  const hasOptimal = marker.optimalLow != null || marker.optimalHigh != null;
  const optLo = marker.optimalLow ?? marker.refLow ?? lo;
  const optHi = marker.optimalHigh ?? marker.refHigh ?? hi;

  return (
    <View style={{ height: 34, justifyContent: 'center' }}>
      <View style={styles.rangeTrack} />
      {hasOptimal && (
        <View style={[styles.optimalBand, { left: `${frac(optLo) * 100}%`, width: `${(frac(optHi) - frac(optLo)) * 100}%` }]} />
      )}
      <View style={[styles.valueMarker, { left: `${frac(marker.value) * 100}%` }]}>
        <View style={[styles.valueDot, { backgroundColor: fg }]} />
      </View>
    </View>
  );
}

function InfoLine({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text variant="label" color="muted">{label}</Text>
      <Text variant="bodyMd" color={accent ? 'accent' : 'text'} style={{ fontFamily: 'IBMPlexMono_500Medium' }}>{value}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <View style={{ marginTop: spacing.x2, marginBottom: spacing.sm }}><Eyebrow>{children}</Eyebrow></View>;
}

const styles = StyleSheet.create({
  axis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.sm },
  action: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg },
  actionDot: { width: 24, height: 24, borderRadius: radius.pill, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  relatedChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surfaceHi },
  rangeTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceHi },
  optimalBand: { position: 'absolute', height: 8, borderRadius: 4, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent },
  valueMarker: { position: 'absolute', marginLeft: -8 },
  valueDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: colors.surface },
  askBtn: { alignItems: 'center', paddingVertical: spacing.lg, marginTop: spacing.sm },
});
