// Data — biomarkers (searchable via status filters, grouped by system) and the
// documents vault. Two segments: markers · documents.

import { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card, Divider } from '@/components/Card';
import { BiomarkerRow } from '@/components/BiomarkerRow';
import { Plus } from '@/components/icons';
import { colors, spacing, radius } from '@/theme';
import { useT, useL10n, useLang } from '@/i18n';
import { getBiomarkers, getSystems, getRecords } from '@/data/health';
import { formatDate } from '@/lib/format';
import type { Status } from '@/data/types';

type Filter = 'all' | Status;
type Seg = 'markers' | 'docs';

export default function Data() {
  const t = useT();
  const L = useL10n();

  const [seg, setSeg] = useState<Seg>('markers');
  const [filter, setFilter] = useState<Filter>('all');

  const all = getBiomarkers();
  const systems = getSystems();

  const counts = useMemo(() => {
    const c = { all: all.length, optimal: 0, normal: 0, attention: 0 };
    for (const m of all) {
      if (m.status === 'optimal') c.optimal += 1;
      else if (m.status === 'normal') c.normal += 1;
      else c.attention += 1; // attention + priority
    }
    return c;
  }, [all]);

  const filtered = all.filter((m) => filter === 'all' ? true : filter === 'attention' ? (m.status === 'attention' || m.status === 'high') : m.status === filter);
  const grouped = filter === 'all';

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: t.data.fAll, count: counts.all },
    { key: 'optimal', label: t.status.optimal, count: counts.optimal },
    { key: 'normal', label: t.status.normal, count: counts.normal },
    { key: 'attention', label: t.status.attention, count: counts.attention },
  ];

  return (
    <Screen scroll>
      <Text variant="h1" style={{ marginBottom: spacing.lg }}>{t.data.title}</Text>

      {/* Segment */}
      <View style={styles.segment}>
        <SegBtn label={t.data.segMarkers} active={seg === 'markers'} onPress={() => setSeg('markers')} />
        <SegBtn label={t.data.segDocs} active={seg === 'docs'} onPress={() => setSeg('docs')} />
      </View>

      {seg === 'markers' ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, active ? styles.chipOn : styles.chipOff]}>
                  <Text variant="label" style={{ color: active ? colors.cream : colors.text2 }}>{f.label} · {f.count}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text variant="label" color="faint" style={{ marginBottom: spacing.md }}>{t.data.note}</Text>

          {grouped ? (
            <View style={{ gap: spacing.xl }}>
              {systems.map((s) => {
                const markers = all.filter((m) => m.system === s.key);
                if (!markers.length) return null;
                return (
                  <View key={s.key} style={{ gap: spacing.sm }}>
                    <View style={styles.groupHead}>
                      <Text variant="h3">{L(s.name)}</Text>
                      <Text variant="label" color="faint">{s.score}/100</Text>
                    </View>
                    {markers.map((m) => <BiomarkerRow key={m.id} marker={m} />)}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {filtered.length === 0
                ? <Card style={{ alignItems: 'center', paddingVertical: spacing.x3 }}><Text color="faint">{t.data.empty}</Text></Card>
                : filtered.map((m) => <BiomarkerRow key={m.id} marker={m} />)}
            </View>
          )}
        </>
      ) : (
        <DocsView />
      )}
    </Screen>
  );
}

function DocsView() {
  const t = useT();
  const lang = useLang();
  const router = useRouter();
  const records = getRecords();

  return (
    <View style={{ gap: spacing.md }}>
      <Card padded={false} style={{ overflow: 'hidden' }}>
        {records.map((r, i) => (
          <View key={r.id}>
            <View style={styles.docRow}>
              <View style={[styles.docTag, { backgroundColor: r.source === 'zerive' ? colors.text : colors.surfaceAlt }]}>
                <Text style={{ fontFamily: 'IBMPlexMono_600SemiBold', fontSize: 10, color: r.source === 'zerive' ? colors.cream : colors.muted }}>
                  {r.source === 'zerive' ? 'ZRV' : 'PDF'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMd" numberOfLines={1}>{r.title}</Text>
                <Text variant="label" color="faint">{formatDate(r.date, lang)} · {r.markerCount}</Text>
              </View>
              <Text variant="label" color="faint">{t.data.stOk}</Text>
            </View>
            {i < records.length - 1 ? <Divider style={{ marginHorizontal: spacing.lg }} /> : null}
          </View>
        ))}
      </Card>

      <Pressable onPress={() => router.push('/upload')} style={styles.uploadBtn}>
        <Plus size={18} color={colors.accent} />
        <Text variant="bodyMd" color="accent">{t.upload.title}</Text>
      </Pressable>
      <Text variant="label" color="faint" center>{t.data.privacyNote}</Text>
    </View>
  );
}

function SegBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segBtn, active && styles.segBtnActive]}>
      <Text variant="bodyMd" color={active ? 'text' : 'muted'}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: colors.surfaceHi, borderRadius: radius.md, padding: 4, marginBottom: spacing.lg },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.sm },
  segBtnActive: { backgroundColor: colors.surface, ...{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 } },
  filters: { gap: spacing.sm, paddingBottom: spacing.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  chipOn: { backgroundColor: colors.text, borderColor: colors.text },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.line },
  groupHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  docTag: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    height: 52, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line2, borderStyle: 'dashed', backgroundColor: colors.surface,
  },
});
