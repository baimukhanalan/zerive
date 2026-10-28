// AI — a health assistant grounded in the user's own data. Mocked: chips return
// their authored answer; free text matches a suggestion or falls back.

import { useRef, useState } from 'react';
import { View, TextInput, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Eyebrow } from '@/components/Card';
import { ArrowRight } from '@/components/icons';
import { colors, spacing, radius, fonts } from '@/theme';
import { useT, useL10n, useLang } from '@/i18n';
import { getAi } from '@/data/health';
import { api } from '@/lib/api';
import { useSession } from '@/store/session';
import { haptic } from '@/lib/haptics';

interface Msg { id: string; role: 'user' | 'ai'; text: string }
let seq = 0;
const uid = () => `m${seq++}`;

export default function AI() {
  const t = useT();
  const L = useL10n();
  const ai = getAi();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Msg[]>([{ id: uid(), role: 'ai', text: L(ai.greeting) }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const scrollDown = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);

  const lang = useLang();
  const token = useSession((s) => s.token);

  // Grounded answers from the backend (built from the user's own DB numbers).
  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    haptic.light();
    setMessages((m) => [...m, { id: uid(), role: 'user', text: clean }]);
    setInput(''); setTyping(true); scrollDown();
    try {
      const { answer } = await api.ai(clean, lang, token ?? undefined);
      setTyping(false);
      setMessages((m) => [...m, { id: uid(), role: 'ai', text: answer }]);
    } catch {
      setTyping(false);
      setMessages((m) => [...m, { id: uid(), role: 'ai', text: L(ai.fallback) }]);
    }
    scrollDown();
  };

  const showChips = messages.length <= 1;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, paddingTop: insets.top + spacing.sm }}>
        <View style={styles.head}>
          <Text variant="h2">{t.ai.title}</Text>
          <Text variant="sm" color="muted" style={{ marginTop: 2 }}>{t.ai.sub}</Text>
        </View>

        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          {messages.map((m) => <Bubble key={m.id} msg={m} />)}
          {typing ? <View style={[styles.bubble, styles.ai]}><Text variant="body" color="faint">{t.ai.thinking}</Text></View> : null}

          {showChips && (
            <View style={styles.chips}>
              <Text variant="label" color="faint" style={{ marginBottom: spacing.xs }}>{t.ai.suggestions}</Text>
              {ai.suggestions.map((s) => (
                <Pressable key={s.id} onPress={() => send(L(s.q))} style={styles.chip}>
                  <Text variant="bodyMd" color="text2" style={{ flex: 1 }}>{L(s.q)}</Text>
                  <ArrowRight size={16} color={colors.faint} />
                </Pressable>
              ))}
            </View>
          )}

          <Text variant="label" color="faint" style={styles.disclaimer}>{L(ai.disclaimer)}</Text>
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: (insets.bottom || spacing.sm) + spacing.sm }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={L(ai.placeholder)}
            placeholderTextColor={colors.faint}
            selectionColor={colors.accent}
            style={styles.input}
            multiline
          />
          <Pressable onPress={() => send(input)} style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]} accessibilityRole="button" accessibilityLabel={t.ai.send}>
            <ArrowRight size={20} color={colors.onAccent} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
      <Text variant="body" color={isUser ? 'cream' : 'text'} style={{ lineHeight: 21 }}>{msg.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  messages: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.md },
  bubble: { maxWidth: '88%', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.x2 },
  user: { alignSelf: 'flex-end', backgroundColor: colors.text, borderBottomRightRadius: radius.sm },
  ai: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: radius.sm },
  chips: { marginTop: spacing.sm, gap: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  disclaimer: { marginTop: spacing.lg, textAlign: 'center', lineHeight: 16 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.bg2 },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 12, color: colors.text, fontFamily: fonts.regular, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
