// Language switch — segmented RU / KK / EN backed by the persisted lang store.
// `tone="photo"` sits over a dark hero image; `tone="paper"` sits on the paper UI.

import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radius } from '@/theme';
import { useLangStore, useT, type Lang } from '@/i18n';
import { haptic } from '@/lib/haptics';

const ORDER: Lang[] = ['ru', 'kk', 'en'];

export function LangSwitch({ tone = 'paper' }: { tone?: 'paper' | 'photo' }) {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();
  const photo = tone === 'photo';

  return (
    <View style={[styles.wrap, photo ? styles.wrapPhoto : styles.wrapPaper]}>
      {ORDER.map((code) => {
        const active = lang === code;
        const activeStyle = active ? (photo ? styles.activePhoto : styles.activePaper) : null;
        const textColor = active
          ? (photo ? colors.onAccent : colors.text)
          : (photo ? 'rgba(246,241,233,0.7)' : colors.muted);
        return (
          <Pressable
            key={code}
            onPress={() => { haptic.select(); setLang(code); }}
            style={[styles.seg, activeStyle]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={{ fontFamily: 'IBMPlexMono_500Medium', fontSize: 11, letterSpacing: 0.6, color: textColor }}>
              {t.lang[code]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderRadius: radius.pill, padding: 3, borderWidth: 1 },
  wrapPaper: { backgroundColor: colors.surfaceHi, borderColor: colors.line },
  wrapPhoto: { backgroundColor: 'rgba(16,11,6,0.28)', borderColor: 'rgba(246,241,233,0.24)' },
  seg: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: radius.pill },
  activePaper: { backgroundColor: colors.surface },
  activePhoto: { backgroundColor: colors.accent },
});
