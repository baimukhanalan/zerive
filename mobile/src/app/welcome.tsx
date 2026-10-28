// Welcome / hero — full-bleed daily photo with a dark scrim and the intro copy.
// "Начать" → create account; the skip link → sign in to an existing account.

import { View, ImageBackground, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Wordmark } from '@/components/Wordmark';
import { LangSwitch } from '@/components/LangSwitch';
import { colors, spacing } from '@/theme';
import { useT } from '@/i18n';
import { heroPhoto } from '@/lib/photos';
import { haptic } from '@/lib/haptics';

export default function Welcome() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground source={heroPhoto()} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={['rgba(16,11,6,0.10)', 'rgba(16,11,6,0.35)', 'rgba(16,11,6,0.92)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <Wordmark color={colors.cream} />
        <LangSwitch tone="photo" />
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.x2 }]}>
        <View style={styles.eyebrowRow}>
          <View style={styles.dot} />
          <Text style={styles.eyebrow}>{t.welcome.eyebrow.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{t.welcome.title}</Text>
        <Text style={styles.sub}>{t.welcome.sub}</Text>

        <View style={{ marginTop: spacing.x2, gap: spacing.sm }}>
          <Button label={t.welcome.cta} onPress={() => router.push('/(auth)/sign-in?mode=new')} />
          <Pressable
            onPress={() => { haptic.light(); router.push('/(auth)/sign-in?mode=in'); }}
            style={styles.skip}
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>{t.welcome.skip}</Text>
          </Pressable>
        </View>

        <Text style={styles.partners}>{t.welcome.partners}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink0 },
  top: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  bottom: { marginTop: 'auto', paddingHorizontal: spacing.xl },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  eyebrow: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 11, letterSpacing: 1.4, color: 'rgba(246,241,233,0.82)' },
  title: { fontFamily: 'Manrope_800ExtraBold', fontSize: 40, lineHeight: 42, letterSpacing: -1.2, color: colors.cream },
  sub: { fontFamily: 'Manrope_400Regular', fontSize: 16, lineHeight: 24, color: 'rgba(246,241,233,0.82)', marginTop: spacing.md },
  skip: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 12.5, letterSpacing: 0.4, color: 'rgba(246,241,233,0.7)' },
  partners: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, letterSpacing: 0.8, color: 'rgba(246,241,233,0.5)', textAlign: 'center', marginTop: spacing.lg },
});
