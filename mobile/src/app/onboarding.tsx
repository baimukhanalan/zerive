// Onboarding — 3 steps (about you / goals / lifestyle), then a short "build"
// sequence, then into the app. Chip-based, driven by i18n.

import { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Eyebrow } from '@/components/Card';
import { colors, spacing, radius } from '@/theme';
import { useT, fill } from '@/i18n';
import { useSession, type OnbAnswers } from '@/store/session';
import { api } from '@/lib/api';
import { haptic } from '@/lib/haptics';

type Sel = {
  sex: string; age: string; city: string; goals: string[];
  sleep: string; act: string; smoke: string; alc: string;
};

export default function Onboarding() {
  const t = useT();
  const router = useRouter();
  const complete = useSession((s) => s.completeOnboarding);
  const token = useSession((s) => s.token);

  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState(false);
  const [buildLine, setBuildLine] = useState(0);
  const [sel, setSel] = useState<Sel>({
    sex: 'm', age: '30–39', city: 'almaty', goals: ['energy', 'longevity'],
    sleep: '6–7', act: 'mid', smoke: 'no', alc: 'rare',
  });

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
  }, []);

  const one = (key: keyof Sel, val: string) => setSel((s) => ({ ...s, [key]: val }));
  const multi = (key: 'goals', val: string) => setSel((s) => {
    const arr = s[key];
    return { ...s, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
  });

  const advance = () => {
    haptic.light();
    if (step < 2) return setStep(step + 1);
    // build sequence
    setBuilding(true);
    const iv = setInterval(() => setBuildLine((l) => (l + 1) % 3), 850);
    intervals.current.push(iv);
    const done = setTimeout(() => {
      clearInterval(iv);
      complete(sel as unknown as OnbAnswers);
      api.saveProfile(
        { sex: sel.sex, age: sel.age, city: sel.city, goals: sel.goals, sleep: sel.sleep, activity: sel.act, smoking: sel.smoke, alcohol: sel.alc },
        token ?? undefined,
      ).catch(() => {});
      router.replace('/(tabs)');
    }, 2700);
    timers.current.push(done);
  };

  if (building) {
    return (
      <Screen>
        <View style={styles.buildWrap}>
          <View style={styles.spinner} />
          <Text variant="h2" center style={{ marginTop: spacing.x2 }}>{t.onboarding.buildLines[buildLine]}</Text>
          <Text variant="body" color="muted" center style={{ marginTop: spacing.sm }}>{t.onboarding.buildSub}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <TopBar variant="back" onBack={() => (step > 0 ? setStep(step - 1) : router.back())} right={<Eyebrow>{fill(t.onboarding.count, { n: step + 1 })}</Eyebrow>} />
      <ProgressBar value={(step + 1) / 3} />

      <View style={{ marginTop: spacing.x2 }}>
        <Text variant="h1">{t.onboarding.titles[step]}</Text>
        <Text variant="bodyLg" color="muted" style={{ marginTop: spacing.sm }}>{t.onboarding.subs[step]}</Text>
      </View>

      <View style={{ marginTop: spacing.x2, gap: spacing.x2 }}>
        {step === 0 && (
          <>
            <Group label={t.onboarding.gSex}>
              <Chip label={t.onboarding.sexM} on={sel.sex === 'm'} onPress={() => one('sex', 'm')} />
              <Chip label={t.onboarding.sexF} on={sel.sex === 'f'} onPress={() => one('sex', 'f')} />
            </Group>
            <Group label={t.onboarding.gAge}>
              {['18–29', '30–39', '40–49', '50+'].map((a) => (
                <Chip key={a} label={a} on={sel.age === a} onPress={() => one('age', a)} />
              ))}
            </Group>
            <Group label={t.onboarding.gCity}>
              {[['almaty', t.onboarding.cityAlmaty], ['astana', t.onboarding.cityAstana], ['shymkent', t.onboarding.cityShymkent]].map(([k, l]) => (
                <Chip key={k} label={l} on={sel.city === k} onPress={() => one('city', k)} />
              ))}
            </Group>
          </>
        )}

        {step === 1 && (
          <View style={styles.wrapChips}>
            {(['energy', 'longevity', 'sleep', 'weight', 'heart', 'stress'] as const).map((g) => (
              <Chip
                key={g}
                label={t.onboarding.goals[g]}
                meta={t.onboarding.goalMeta[g]}
                on={sel.goals.includes(g)}
                onPress={() => multi('goals', g)}
                wide
              />
            ))}
          </View>
        )}

        {step === 2 && (
          <>
            <Group label={t.onboarding.gSleep}>
              {['< 6', '6–7', '7–8', '8+'].map((x) => (
                <Chip key={x} label={x} on={sel.sleep === x} onPress={() => one('sleep', x)} />
              ))}
            </Group>
            <Group label={t.onboarding.gAct}>
              {[['low', t.onboarding.actL], ['mid', t.onboarding.actM], ['high', t.onboarding.actH]].map(([k, l]) => (
                <Chip key={k} label={l} on={sel.act === k} onPress={() => one('act', k)} />
              ))}
            </Group>
            <Group label={t.onboarding.gSmoke}>
              {[['no', t.onboarding.smN], ['some', t.onboarding.smS], ['yes', t.onboarding.smY]].map(([k, l]) => (
                <Chip key={k} label={l} on={sel.smoke === k} onPress={() => one('smoke', k)} />
              ))}
            </Group>
            <Group label={t.onboarding.gAlc}>
              {[['no', t.onboarding.alN], ['rare', t.onboarding.alR], ['often', t.onboarding.alF]].map(([k, l]) => (
                <Chip key={k} label={l} on={sel.alc === k} onPress={() => one('alc', k)} />
              ))}
            </Group>
          </>
        )}
      </View>

      <View style={{ marginTop: spacing.x3 }}>
        <Button label={step === 2 ? t.onboarding.done : t.onboarding.next} onPress={advance} />
      </View>
    </Screen>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Eyebrow>{label}</Eyebrow>
      <View style={styles.wrapChips}>{children}</View>
    </View>
  );
}

function Chip({ label, meta, on, onPress, wide }: { label: string; meta?: string; on: boolean; onPress: () => void; wide?: boolean }) {
  return (
    <Pressable
      onPress={() => { haptic.select(); onPress(); }}
      style={[
        styles.chip,
        wide && { width: '47.5%', flexGrow: 1 },
        on ? styles.chipOn : styles.chipOff,
      ]}
    >
      <Text variant="bodyMd" style={{ color: on ? colors.cream : colors.text2 }}>{label}</Text>
      {meta ? <Text variant="label" style={{ color: on ? 'rgba(246,241,233,0.6)' : colors.faint, marginTop: 2 }}>{meta}</Text> : null}
    </Pressable>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.track}><View style={[styles.fill, { width: `${Math.round(value * 100)}%` }]} /></View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: colors.surfaceHi, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.accent },
  wrapChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  chipOn: { backgroundColor: colors.text, borderColor: colors.text },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.line },
  buildWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  spinner: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 4,
    borderColor: colors.accentSoft, borderTopColor: colors.accent,
  },
});
