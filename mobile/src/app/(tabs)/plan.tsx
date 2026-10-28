// Plan — the personal action plan. When signed into the API the step `done`
// state is server-backed (POST /api/plan/toggle); offline it uses a local store.

import { View, Pressable, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card, Eyebrow, Divider } from '@/components/Card';
import { Check } from '@/components/icons';
import { useToast } from '@/components/Toast';
import { colors, spacing, radius } from '@/theme';
import { useT, useL10n } from '@/i18n';
import { getPlan, getBiomarker } from '@/data/health';
import { useDataStore } from '@/store/data';
import { usePlanProgress } from '@/store/plan';
import { useSession } from '@/store/session';
import { haptic } from '@/lib/haptics';
import type { PlanPriority, PlanStep, StepKind } from '@/data/types';

export default function Plan() {
  const t = useT();
  const showToast = useToast((s) => s.show);

  const usingApi = useDataStore((s) => s.usingApi);
  const apiPlan = useDataStore((s) => s.plan);
  const toggleApi = useDataStore((s) => s.toggleStep);
  const token = useSession((s) => s.token);
  const localDone = usePlanProgress((s) => s.done);
  const toggleLocal = usePlanProgress((s) => s.toggle);

  const plan: PlanPriority[] = usingApi ? (apiPlan ?? []) : getPlan();
  const isDone = (s: PlanStep) => (usingApi ? !!s.done : !!localDone[s.id]);
  const onToggle = (s: PlanStep) => {
    haptic.select();
    if (usingApi) toggleApi(s.id, token); else toggleLocal(s.id);
  };

  const allSteps = plan.flatMap((p) => p.steps);
  const completed = allSteps.filter(isDone).length;
  const pct = allSteps.length ? completed / allSteps.length : 0;

  return (
    <Screen scroll>
      <Text variant="h1">{t.plan.title}</Text>

      <Card style={{ marginTop: spacing.lg, gap: spacing.md }}>
        <View style={styles.rowBetween}>
          <Text variant="bodyMd" color="muted">{completed} / {allSteps.length} · {t.plan.done}</Text>
          <Text variant="bodyMd" color="accent" style={{ fontFamily: 'IBMPlexMono_600SemiBold' }}>{Math.round(pct * 100)}%</Text>
        </View>
        <View style={styles.track}><View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} /></View>
      </Card>

      <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
        {plan.map((p) => <PriorityCard key={p.id} priority={p} isDone={isDone} onToggle={onToggle} />)}
      </View>

      <Card style={{ marginTop: spacing.lg, gap: spacing.xs }}>
        <Eyebrow color="accent">{t.plan.retestEyebrow.toUpperCase()}</Eyebrow>
        <Text variant="h3">{t.plan.retestLine}</Text>
      </Card>

      <View style={styles.note}>
        <Text variant="sm" color="muted" style={{ flex: 1, lineHeight: 19 }}>{t.plan.note}</Text>
      </View>
      <Button label={t.plan.doctor} variant="bracket" onPress={() => showToast(t.common.demoToast)} />
    </Screen>
  );
}

function PriorityCard({ priority, isDone, onToggle }: {
  priority: PlanPriority;
  isDone: (s: PlanStep) => boolean;
  onToggle: (s: PlanStep) => void;
}) {
  const t = useT();
  const L = useL10n();
  const marker = getBiomarker(priority.marker);

  return (
    <Card style={{ gap: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={styles.rank}><Text variant="h3" color="onAccent">{priority.rank}</Text></View>
        <View style={{ flex: 1 }}>
          <Text variant="h3">{L(priority.title)}</Text>
          <Text variant="sm" color="muted" numberOfLines={1}>{t.plan.goal}: {L(priority.goal)}</Text>
        </View>
        {marker ? <Text variant="label" color="faint">{marker.abbr}</Text> : null}
      </View>

      <Divider />

      <View style={{ gap: spacing.md }}>
        {priority.steps.map((s) => {
          const done = isDone(s);
          return (
            <Pressable key={s.id} onPress={() => onToggle(s)} style={styles.step}>
              <View style={[styles.checkbox, done && styles.checkboxOn]}>
                {done ? <Check size={13} color={colors.onAccent} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMd" color={done ? 'faint' : 'text'} style={done ? { textDecorationLine: 'line-through' } : undefined}>
                  {L(s.title)}
                </Text>
                <Text variant="sm" color="faint">{L(s.detail)}</Text>
              </View>
              <KindTag kind={s.kind} />
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

function KindTag({ kind }: { kind: StepKind }) {
  const t = useT();
  const accent = kind === 'discuss';
  return (
    <View style={[styles.tag, accent && { backgroundColor: colors.attentionSoft }]}>
      <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: accent ? colors.attention : colors.faint }}>
        {t.plan.kinds[kind]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceHi, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.accent },
  rank: { width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.line3, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxOn: { backgroundColor: colors.optimal, borderColor: colors.optimal },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.surfaceHi, alignSelf: 'flex-start' },
  note: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
});
