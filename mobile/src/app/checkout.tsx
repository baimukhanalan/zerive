// Checkout — purchase a ZERIVE Check: pick a lab / city / slot, pay (mock), then
// get an order QR. Completing the purchase flips the session to "has report".

import { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card, Eyebrow, Divider } from '@/components/Card';
import { TopBar } from '@/components/TopBar';
import { Check, QR, Card as CardIcon } from '@/components/icons';
import { colors, spacing, radius } from '@/theme';
import { useT } from '@/i18n';
import { useSession } from '@/store/session';
import { useDataStore } from '@/store/data';
import { api } from '@/lib/api';
import { haptic } from '@/lib/haptics';

const LABS = ['INVIVO', 'OLYMP', 'SYNEVO', 'KDL'];
const CITIES = ['Алматы', 'Астана', 'Шымкент'];
const SLOTS = ['08:30', '10:00', '12:30', '15:00'];

export default function Checkout() {
  const t = useT();
  const router = useRouter();
  const purchaseComplete = useSession((s) => s.purchaseComplete);
  const token = useSession((s) => s.token);
  const loadAll = useDataStore((s) => s.loadAll);

  const [lab, setLab] = useState(LABS[0]);
  const [city, setCity] = useState(CITIES[0]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [home, setHome] = useState(false);
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState('');

  const [paying, setPaying] = useState(false);
  const pay = async () => {
    if (paying) return;
    setPaying(true);
    haptic.success();
    const n = 'ZC-' + String(100000 + Math.floor((Date.now() % 900000))).slice(0, 6);
    setOrder(n);
    try {
      await api.checkoutComplete({ lab, city }, token ?? undefined);
      await loadAll(token); // pull the freshly-generated panel
    } catch { /* offline → local demo fallback */ }
    purchaseComplete();
    setDone(true);
    setPaying(false);
  };

  if (done) {
    return (
      <Screen scroll>
        <TopBar variant="close" onBack={() => router.replace('/(tabs)')} />
        <View style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.x2 }}>
          <View style={styles.successOrb}><Check size={40} color={colors.onAccent} /></View>
          <Text variant="h1" center>{t.checkout.successTitle}</Text>
          <Text variant="body" color="text2" center>{t.checkout.successSub}</Text>

          <Card style={styles.qrCard}>
            <View style={styles.qrBox}><QR size={120} color={colors.text} /></View>
            <Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text variant="label" color="text3">{t.checkout.orderNo}</Text>
              <Text variant="bodyMd" style={{ fontFamily: 'IBMPlexMono_600SemiBold' }}>{order}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Text variant="label" color="text3">{t.checkout.chooseLab}</Text>
              <Text variant="bodyMd">{lab} · {city}</Text>
            </View>
          </Card>
        </View>
        <Button label={t.common.done} onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <TopBar variant="close" title={t.checkout.title} />

      <Eyebrow>{t.checkout.eyebrow}</Eyebrow>
      <Text variant="h1" style={{ marginTop: spacing.sm }}>{t.checkout.title}</Text>
      <Text variant="body" color="text2" style={{ marginTop: spacing.sm }}>{t.checkout.sub}</Text>

      {/* Includes */}
      <Card style={{ marginTop: spacing.xl, gap: spacing.md }}>
        <Text variant="h3">{t.checkout.includesTitle}</Text>
        {t.checkout.inc.map((inc) => (
          <View key={inc} style={styles.incRow}>
            <View style={styles.incDot}><Check size={13} color={colors.accent} /></View>
            <Text variant="body" color="text2" style={{ flex: 1 }}>{inc}</Text>
          </View>
        ))}
      </Card>

      {/* Selectors */}
      <ChoiceGroup label={t.checkout.chooseLab} value={lab} options={LABS} onSelect={setLab} />
      <ChoiceGroup label={t.checkout.chooseCity} value={city} options={CITIES} onSelect={setCity} />
      <ChoiceGroup label={t.checkout.chooseDate} value={slot} options={SLOTS} onSelect={setSlot} />

      <Pressable onPress={() => { haptic.select(); setHome(!home); }} style={styles.homeRow}>
        <View style={[styles.checkbox, home && styles.checkboxOn]}>{home ? <Check size={14} color={colors.onAccent} /> : null}</View>
        <Text variant="bodyMd" style={{ flex: 1 }}>{t.checkout.homeDraw}</Text>
      </Pressable>

      {/* Price + pay */}
      <Card style={styles.priceCard}>
        <Text variant="bodyMd" color="text2">{t.checkout.price}</Text>
        <Text variant="h1">{t.checkout.priceValue}</Text>
      </Card>

      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <Button label={t.checkout.payKaspi} onPress={pay} loading={paying} />
        <Button label={t.checkout.payCard} variant="secondary" onPress={pay} loading={paying} icon={<CardIcon size={18} color={colors.text} />} />
      </View>
      <Text variant="label" color="text3" center style={{ marginTop: spacing.md, lineHeight: 16 }}>{t.checkout.securedNote}</Text>
    </Screen>
  );
}

function ChoiceGroup({ label, value, options, onSelect }: { label: string; value: string; options: string[]; onSelect: (v: string) => void }) {
  return (
    <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
      <Eyebrow>{label}</Eyebrow>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {options.map((o) => {
          const active = value === o;
          return (
            <Pressable
              key={o}
              onPress={() => { haptic.select(); onSelect(o); }}
              style={[styles.choice, active && styles.choiceOn]}
            >
              <Text variant="bodyMd" color={active ? 'onAccent' : 'text2'}>{o}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  incRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  incDot: { width: 22, height: 22, borderRadius: radius.pill, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  choice: { paddingHorizontal: spacing.lg, height: 44, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line2, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  choiceOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  homeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  checkbox: { width: 24, height: 24, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.line2, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  priceCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl },
  successOrb: { width: 84, height: 84, borderRadius: radius.x3, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  qrCard: { width: '100%', alignItems: 'center', gap: spacing.lg },
  qrBox: { width: 160, height: 160, borderRadius: radius.lg, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
