// Upload — import past labs into the Health Vault. PDF / photo pickers are wired
// to the OS; recognition is mocked (idle → processing → added).

import { useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TopBar } from '@/components/TopBar';
import { Upload as UploadIcon, Camera, Doc, Check } from '@/components/icons';
import { colors, spacing, radius } from '@/theme';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';

type Phase = 'idle' | 'processing' | 'done';

export default function UploadScreen() {
  const t = useT();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');

  const process = () => {
    setPhase('processing');
    setTimeout(() => { haptic.success(); setPhase('done'); }, 1400);
  };

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
      if (!res.canceled) process();
    } catch { /* ignore picker errors */ }
  };

  const pickPhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
      if (!res.canceled) process();
    } catch { /* ignore picker errors */ }
  };

  if (phase === 'processing') {
    return (
      <Screen>
        <TopBar variant="close" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text variant="h3" color="text2" style={{ marginTop: spacing.lg }}>{t.upload.processing}</Text>
        </View>
      </Screen>
    );
  }

  if (phase === 'done') {
    return (
      <Screen>
        <TopBar variant="close" onBack={() => router.back()} />
        <View style={styles.center}>
          <View style={styles.orb}><Check size={40} color={colors.onAccent} /></View>
          <Text variant="h1" center style={{ marginTop: spacing.lg }}>{t.upload.addedTitle}</Text>
          <Text variant="body" color="text2" center style={{ marginTop: spacing.sm }}>{t.upload.addedSub}</Text>
        </View>
        <Button label={t.common.done} onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <TopBar variant="close" />
      <Text variant="h1">{t.upload.title}</Text>
      <Text variant="body" color="muted" style={{ marginTop: spacing.sm }}>{t.upload.sub}</Text>

      <View style={{ gap: spacing.md, marginTop: spacing.x2 }}>
        <Option icon={<Doc size={24} color={colors.accent} />} title={t.upload.pdf} onPress={pickPdf} />
        <Option icon={<Camera size={24} color={colors.accent} />} title={t.upload.photo} onPress={pickPhoto} />
        <Option icon={<UploadIcon size={24} color={colors.accent} />} title={t.upload.manual} onPress={process} />
      </View>
      <Text variant="label" color="faint" center style={{ marginTop: spacing.xl }}>{t.upload.sheetSub}</Text>
    </Screen>
  );
}

function Option({ icon, title, onPress }: { icon: React.ReactNode; title: string; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={styles.option}>
      <View style={styles.optionIcon}>{icon}</View>
      <Text variant="h3" style={{ flex: 1 }}>{title}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orb: { width: 84, height: 84, borderRadius: radius.x3, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  optionIcon: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
});
