// Profile — identity, membership, settings, language, upload and sign out.

import { type ReactNode, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card, Eyebrow, Divider } from '@/components/Card';
import { LangSwitch } from '@/components/LangSwitch';
import { useToast } from '@/components/Toast';
import { Beaker, Card as CardIcon, Lock, Upload, ChevronRight, Bell } from '@/components/icons';
import { colors, spacing, radius } from '@/theme';
import { useT } from '@/i18n';
import { USER } from '@/data/health';
import { useSession } from '@/store/session';
import { haptic } from '@/lib/haptics';

export default function Profile() {
  const t = useT();
  const router = useRouter();
  const session = useSession();
  const name = session.profile.name || USER.name;
  const [notif, setNotif] = useState(true);
  const showToast = useToast((s) => s.show);
  const demo = () => showToast(t.common.demoToast);

  return (
    <Screen scroll>
      <Text variant="h1" style={{ marginBottom: spacing.xl }}>{t.profile.title}</Text>

      {/* Identity */}
      <View style={styles.identity}>
        <View style={styles.avatar}><Text variant="h1" color="onAccent">{name.charAt(0).toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text variant="h2">{name}</Text>
          <Text variant="sm" color="muted" style={{ marginTop: 2 }}>{t.profile.meta}</Text>
        </View>
      </View>

      {/* Membership */}
      <Card style={{ marginTop: spacing.xl, gap: spacing.sm }}>
        <View style={styles.rowBetween}>
          <Text style={{ fontFamily: 'Manrope_800ExtraBold', fontSize: 18, letterSpacing: -0.4 }}>
            ZER<Text style={{ color: colors.accent }}>I</Text>VE · Complete
          </Text>
          <View style={styles.memberDot} />
        </View>
        <Text variant="bodyMd" color="muted">{t.profile.memLine}</Text>
        <Text variant="label" color="faint">{t.profile.memMeta}</Text>
      </Card>

      {/* Documents / upload */}
      <Pressable onPress={() => router.push('/upload')} style={[styles.uploadRow]}>
        <View style={styles.uploadIcon}><Upload size={20} color={colors.accent} /></View>
        <Text variant="bodyMd" color="accent" style={{ flex: 1 }}>{t.profile.uploadResults}</Text>
        <ChevronRight size={18} color={colors.faint} />
      </Pressable>

      {/* Settings */}
      <SectionTitle>{t.profile.settTitle}</SectionTitle>
      <Card padded={false} style={{ overflow: 'hidden' }}>
        <SettingRow icon={<Beaker size={20} color={colors.muted} />} label={t.profile.labLabel} detail={t.profile.labDetail} onPress={demo} />
        <Divider style={{ marginHorizontal: spacing.lg }} />
        <SettingRow icon={<CardIcon size={20} color={colors.muted} />} label={t.profile.payLabel} detail={t.profile.payDetail} onPress={demo} />
        <Divider style={{ marginHorizontal: spacing.lg }} />
        <SettingRow icon={<Lock size={20} color={colors.muted} />} label={t.profile.privLabel} onPress={demo} />
        <Divider style={{ marginHorizontal: spacing.lg }} />
        {/* Notifications toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Bell size={20} color={colors.muted} />
            <Text variant="bodyMd" style={{ flex: 1 }}>{t.profile.notifLabel}</Text>
          </View>
          <Pressable
            onPress={() => { haptic.select(); setNotif(!notif); }}
            style={[styles.toggle, { backgroundColor: notif ? colors.optimal : colors.line2 }]}
            accessibilityRole="switch"
            accessibilityState={{ checked: notif }}
            accessibilityLabel={t.profile.notifLabel}
          >
            <View style={[styles.knob, { transform: [{ translateX: notif ? 18 : 0 }] }]} />
          </Pressable>
        </View>
      </Card>

      {/* Language */}
      <SectionTitle>{t.profile.langLabel}</SectionTitle>
      <Card style={styles.rowBetween}>
        <Text variant="bodyMd" color="muted">{t.lang.label}</Text>
        <LangSwitch tone="paper" />
      </Card>

      {/* Sign out */}
      <Pressable onPress={() => { session.signOut(); router.replace('/'); }} style={styles.signout} accessibilityRole="button">
        <Text variant="bodyMd" style={{ color: colors.high }}>{t.profile.signout}</Text>
      </Pressable>

      <Text variant="label" color="faint" center style={{ marginTop: spacing.lg }}>{t.profile.version}</Text>
    </Screen>
  );
}

function SettingRow({ icon, label, detail, onPress }: { icon: ReactNode; label: string; detail?: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.settingRow, { backgroundColor: pressed ? colors.surfaceHi : 'transparent' }]}
    >
      <View style={styles.settingLeft}>
        {icon}
        <Text variant="bodyMd">{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {detail ? <Text variant="label" color="faint">{detail}</Text> : null}
        <ChevronRight size={18} color={colors.faint} />
      </View>
    </Pressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <View style={{ marginTop: spacing.x2, marginBottom: spacing.sm }}><Eyebrow>{children}</Eyebrow></View>;
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 64, height: 64, borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  memberDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.optimal },
  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg },
  uploadIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  bell: { width: 20, height: 20 },
  toggle: { width: 42, height: 24, borderRadius: 12, padding: 3, justifyContent: 'center' },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.white },
  signout: { marginTop: spacing.xl, height: 52, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
});
