// Home — the health dashboard. Photo header, ZERIVE Score + legend, biological
// age, body systems as bars, priorities, and a retest nudge.

import { View, ImageBackground, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Card, Eyebrow } from '@/components/Card';
import { ScoreRing } from '@/components/ScoreRing';
import { BiomarkerRow } from '@/components/BiomarkerRow';
import { ArrowRight } from '@/components/icons';
import { colors, spacing, radius, layout } from '@/theme';
import { useT, useL10n } from '@/i18n';
import { getReport, getSystems, getPriorities, USER } from '@/data/health';
import { useSession } from '@/store/session';
import { heroPhoto, PHOTOS } from '@/lib/photos';
import { num } from '@/lib/format';
import type { BodySystem } from '@/data/types';

export default function Home() {
  const t = useT();
  const L = useL10n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const name = useSession((s) => s.profile.name) || USER.name;

  const report = getReport();
  const systems = getSystems();
  const priorities = getPriorities().slice(0, 3);

  const hour = new Date().getHours();
  const greet = hour < 5 ? t.home.greets[0] : hour < 12 ? t.home.greets[1] : hour < 18 ? t.home.greets[2] : t.home.greets[3];
  const attention = report.counts.attention + report.counts.high;
  const ageDelta = Math.round((report.realAge - report.bioAge) * 10) / 10;

  const legend = [
    { c: colors.optimal, label: t.home.legOpt, n: report.counts.optimal },
    { c: colors.normalDot, label: t.home.legNorm, n: report.counts.normal },
    { c: colors.attention, label: t.home.legAtt, n: attention },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.x2 }}>
        {/* Photo header + greeting */}
        <View>
          <ImageBackground source={heroPhoto()} style={{ height: 250 }} resizeMode="cover">
            <LinearGradient colors={['rgba(16,11,6,0.12)', 'transparent']} style={{ height: 90 }} />
          </ImageBackground>
          <View style={[styles.greetBlock]}>
            <Eyebrow>{t.home.date.toUpperCase()}</Eyebrow>
            <Text variant="h1" style={{ marginTop: spacing.xs }}>{greet}, {name}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Score */}
          <Card style={{ gap: spacing.lg }}>
            <View style={styles.rowBetween}>
              <Eyebrow>{t.home.scoreLabel}</Eyebrow>
              <Text variant="label" color="faint">{t.home.updated}</Text>
            </View>
            <View style={styles.scoreRow}>
              <ScoreRing value={report.score} size={132} stroke={11} />
              <View style={styles.legend}>
                <View style={styles.sincePill}><Text variant="label" style={{ color: colors.optimal }}>{t.home.sinceTest}</Text></View>
                {legend.map((l) => (
                  <View key={l.label} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: l.c }]} />
                    <Text variant="bodyMd" color="text2" style={{ flex: 1 }}>{l.label}</Text>
                    <Text variant="bodyMd" style={{ fontFamily: 'IBMPlexMono_600SemiBold' }}>{l.n}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Biological age */}
          <ImageBackground source={PHOTOS.nature} style={styles.bioCard} imageStyle={{ borderRadius: radius.x2 }} resizeMode="cover">
            <LinearGradient colors={['rgba(16,11,6,0.55)', 'rgba(16,11,6,0.82)']} style={StyleSheet.absoluteFill} />
            <View style={{ padding: spacing.xl }}>
              <Text style={styles.bioEyebrow}>{t.home.bioEyebrow.toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: spacing.sm }}>
                <Text style={styles.bioValue}>{num(report.bioAge)}</Text>
                <Text style={styles.bioUnit}>{t.home.bioUnit}</Text>
              </View>
              <Text style={styles.bioLine}>{ageDelta >= 0 ? '−' : '+'}{num(Math.abs(ageDelta))} {t.home.bioLine}</Text>
            </View>
          </ImageBackground>

          {/* Body systems */}
          <View style={styles.sectionHead}>
            <Text variant="h3">{t.home.bodyTitle}</Text>
            <Pressable onPress={() => router.navigate('/(tabs)/data')} hitSlop={8} style={styles.seeAll} accessibilityRole="button">
              <Text variant="label" color="accent">{t.common.seeAll}</Text>
              <ArrowRight size={13} color={colors.accent} />
            </Pressable>
          </View>
          <Card style={{ gap: spacing.lg }}>
            {systems.map((s, i) => <SystemBar key={s.key} system={s} name={L(s.name)} last={i === systems.length - 1} />)}
          </Card>

          {/* Priorities */}
          {priorities.length > 0 && (
            <>
              <Text variant="h3" style={{ marginTop: spacing.x2, marginBottom: spacing.md }}>{t.home.prioTitle}</Text>
              <View style={{ gap: spacing.sm }}>
                {priorities.map((m) => <BiomarkerRow key={m.id} marker={m} />)}
              </View>
            </>
          )}

          {/* Retest */}
          <Pressable onPress={() => router.push('/checkout')} style={styles.retest}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMd" color="onAccent">{t.home.retestTitle}</Text>
              <Text variant="sm" style={{ color: 'rgba(255,255,255,0.82)', marginTop: 2 }}>{t.home.retestSub}</Text>
            </View>
            <View style={styles.retestBtn}>
              <Text style={{ fontFamily: 'IBMPlexMono_500Medium', fontSize: 11.5, color: colors.onAccent }}>{`[ ${t.home.retestBtn} ]`}</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function SystemBar({ system, name, last }: { system: BodySystem; name: string; last: boolean }) {
  const color = system.score >= 80 ? colors.optimal : colors.attention;
  return (
    <View style={[styles.sysRow, !last && styles.sysRowBorder]}>
      <View style={styles.sysTop}>
        <Text variant="bodyMd">{name}</Text>
        <Text variant="bodyMd" style={{ fontFamily: 'IBMPlexMono_600SemiBold', color }}>{system.score}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${system.score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greetBlock: {
    backgroundColor: colors.bg,
    marginTop: -26,
    borderTopLeftRadius: radius.x3,
    borderTopRightRadius: radius.x3,
    paddingTop: spacing.xl,
    paddingHorizontal: layout.screenX,
    alignSelf: 'center',
    width: '100%',
    maxWidth: layout.maxContentWidth,
  },
  content: {
    paddingHorizontal: layout.screenX,
    paddingTop: spacing.lg,
    gap: spacing.lg,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  legend: { flex: 1, gap: spacing.sm },
  sincePill: { alignSelf: 'flex-start', backgroundColor: colors.optimalSoft, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, marginBottom: spacing.xs },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  bioCard: { borderRadius: radius.x2, overflow: 'hidden' },
  bioEyebrow: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 11, letterSpacing: 1.4, color: 'rgba(246,241,233,0.75)' },
  bioValue: { fontFamily: 'Manrope_800ExtraBold', fontSize: 44, lineHeight: 46, letterSpacing: -1.4, color: colors.cream },
  bioUnit: { fontFamily: 'Manrope_500Medium', fontSize: 16, color: 'rgba(246,241,233,0.75)' },
  bioLine: { fontFamily: 'Manrope_500Medium', fontSize: 14, color: colors.normalDot, marginTop: spacing.xs },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sysRow: { paddingBottom: spacing.md, gap: spacing.sm },
  sysRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  sysTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceHi, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  retest: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.accent, borderRadius: radius.x2, padding: spacing.lg, marginTop: spacing.sm,
  },
  retestBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
});
