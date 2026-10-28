// Sign in — phone number → SMS code (demo: any 4 digits), plus Apple / Google.
// `mode=new` routes to onboarding after auth; `mode=in` enters the app directly.

import { useState } from 'react';
import { View, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Eyebrow, Divider } from '@/components/Card';
import { AppleMark, GoogleMark } from '@/components/icons';
import { colors, spacing, radius, fonts } from '@/theme';
import { useT } from '@/i18n';
import { useSession } from '@/store/session';
import { api, setApiToken } from '@/lib/api';
import { haptic } from '@/lib/haptics';

export default function SignIn() {
  const t = useT();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isNew = mode !== 'in';
  const session = useSession();

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Complete auth via the backend; the API's onboarded/hasReport flags drive
  // routing. Falls back to a local demo session if the API is unreachable.
  const finish = async () => {
    haptic.success();
    const phoneVal = phone.trim() ? '+7 ' + phone.trim() : '+7 701 234 56 78';
    const codeVal = code.length === 4 ? code : '0000';
    try {
      const res = await api.verifyOtp(phoneVal, codeVal);
      setApiToken(res.token);
      session.signIn(phoneVal, res.token);
      session.setFlags(res.onboarded, res.hasReport);
    } catch {
      session.signIn(phoneVal);
      if (!isNew) session.setFlags(true, true);
    }
    router.replace('/');
  };

  const primary = () => {
    if (step === 'phone') {
      if (phone.replace(/\D/g, '').length < 9) return setError(t.auth.errPhone);
      setError(null); haptic.light(); return setStep('code');
    }
    finish();
  };

  return (
    <Screen scroll>
      <TopBar variant="back" onBack={() => (step === 'code' ? setStep('phone') : router.back())} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 'phone' ? (
          <>
            <Text variant="h1">{isNew ? t.auth.titleNew : t.auth.titleIn}</Text>
            <Text variant="bodyLg" color="muted" style={{ marginTop: spacing.sm }}>{t.auth.sub}</Text>

            <View style={styles.phoneRow}>
              <View style={styles.prefix}><Text variant="bodyMd" color="muted">+7</Text></View>
              <TextInput
                value={phone}
                onChangeText={(v) => { setPhone(v.replace(/[^\d\s]/g, '').slice(0, 13)); setError(null); }}
                placeholder={t.auth.phonePlaceholder}
                placeholderTextColor={colors.faint}
                keyboardType="phone-pad"
                selectionColor={colors.accent}
                style={styles.phoneInput}
                autoFocus
              />
            </View>
            {error ? <Text variant="sm" color="high" style={{ marginTop: spacing.xs }}>{error}</Text> : null}

            <View style={{ marginTop: spacing.xl }}>
              <Button label={t.auth.getCode} onPress={primary} />
            </View>

            <View style={styles.orRow}>
              <Divider style={{ flex: 1 }} />
              <Text variant="label" color="faint">{t.common.or}</Text>
              <Divider style={{ flex: 1 }} />
            </View>

            <View style={{ gap: spacing.md }}>
              <Social icon={<AppleMark size={18} color={colors.text} />} label={t.auth.apple} onPress={finish} />
              <Social icon={<GoogleMark size={18} />} label={t.auth.google} onPress={finish} />
            </View>

            <Text variant="sm" color="faint" style={styles.terms}>{t.auth.terms}</Text>
          </>
        ) : (
          <>
            <Eyebrow>{t.auth.otpTitle}</Eyebrow>
            <Text variant="h1" style={{ marginTop: spacing.sm }}>{t.auth.otpTitle}</Text>
            <Text variant="bodyLg" color="muted" style={{ marginTop: spacing.sm }}>
              {t.auth.otpSub} +7 {phone || t.auth.phonePlaceholder}
            </Text>

            <TextInput
              value={code}
              onChangeText={(v) => {
                const digits = v.replace(/\D/g, '').slice(0, 4);
                setCode(digits);
                if (digits.length === 4) setTimeout(finish, 250);
              }}
              placeholder="0000"
              placeholderTextColor={colors.faint}
              keyboardType="number-pad"
              maxLength={4}
              selectionColor={colors.accent}
              style={styles.codeInput}
              autoFocus
            />
            <Text variant="sm" color="faint" center style={{ marginTop: spacing.md }}>{t.auth.hint}</Text>

            <View style={styles.otpLinks}>
              <Pressable onPress={() => { haptic.light(); }}><Text variant="label" color="accent">{t.auth.resend}</Text></Pressable>
              <Pressable onPress={() => setStep('phone')}><Text variant="label" color="muted">{t.auth.change}</Text></Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Social({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => { haptic.light(); onPress(); }}
      style={({ pressed }) => [styles.social, { opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
    >
      {icon}
      <Text variant="bodyMd">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  prefix: {
    height: 54, paddingHorizontal: spacing.lg, borderRadius: radius.lg,
    backgroundColor: colors.surfaceHi, borderWidth: 1, borderColor: colors.line2,
    alignItems: 'center', justifyContent: 'center',
  },
  phoneInput: {
    flex: 1, height: 54, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line2,
    backgroundColor: colors.surface, paddingHorizontal: spacing.lg,
    color: colors.text, fontFamily: fonts.medium, fontSize: 17, letterSpacing: 0.5,
  },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.x2 },
  social: {
    height: 54, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line2, backgroundColor: colors.surface,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md,
  },
  terms: { marginTop: spacing.xl, textAlign: 'center', lineHeight: 18 },
  codeInput: {
    marginTop: spacing.x2, height: 72, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line2,
    backgroundColor: colors.surface, textAlign: 'center',
    color: colors.text, fontFamily: fonts.monoSb, fontSize: 34, letterSpacing: 16,
  },
  otpLinks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
});
