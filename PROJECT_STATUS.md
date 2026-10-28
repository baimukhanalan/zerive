# ZERIVE — статус проекта и хендофф

_Последнее обновление: 2026-08-10_

Полная сводка по проекту: что это, что сделано, как устроено, где остановились
и куда двигаемся дальше.

---

## 1. Что это

**ZERIVE** — приложение превентивного здоровья для Казахстана.
Модель: **Superpower (бизнес) + Ornament (data/UX)**, локализовано под KZ.

Ядро продукта:
> Сдал кровь → понял организм (ZERIVE Score, биовозраст, 70+ биомаркеров) →
> получил персональный план → пересдал → увидел прогресс.

Пользовательский цикл: **вход → онбординг → покупка Check → свой дашборд →
план → пересдача (тренды)**.

---

## 2. Живые ссылки

| Что | URL |
|---|---|
| **Приложение (web + PWA + API)** | **https://zerive-app.vercel.app** |
| Лендинг (отдельный проект) | https://zerive.vercel.app |

- PWA ставится на iOS (Поделиться → «На экран „Домой“») и Android (меню → «Установить»).
- **Android `.apk`** собран локально и отдан пользователю (v0.1.0, ~108 МБ, debug-подпись, сайдлоад).
- **iOS `.ipa`** — не собран: нужен Apple Developer-аккаунт для подписи (правило Apple).

Демо-вход: номер `701 234 56 78`, код — **любые 4 цифры** → реальные данные
пользователя **Alan** из Neon. Другой номер → новый пустой юзер (после покупки
Check получает свои данные).

---

## 3. Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│  Один Vercel-проект: zerive-app                              │
│                                                              │
│  Статика (Expo Web / PWA)        /api/*  (Node serverless)   │
│  index.html, _expo/, assets/  →  auth, report, biomarkers,   │
│  manifest.json, sw.js, icons     plan, checkout/complete, ai │
│                                        │                     │
└────────────────────────────────────────┼─────────────────────┘
                                         │  pg / SQL
                                         ▼
                                 ┌───────────────┐
                                 │ Neon Postgres │  (DATABASE_URL в env)
                                 └───────────────┘

Один кодбейс Expo (mobile/) → iOS + Android (native) + Web/PWA.
```

**Стек:**
- **Клиент:** Expo SDK 57, React 19.2, React Native 0.86, Expo Router, TypeScript, Hermes.
- **Бэкенд:** Vercel Node serverless functions (`/api/*`), `pg` + `@neondatabase/serverless`.
- **БД:** Neon Postgres (подключён через Vercel Storage → Neon).
- **Дизайн:** тёплая бумага + оранжевый (Superpower-эстетика), шрифты Manrope + IBM Plex Mono. Всё на дизайн-токенах (`mobile/src/theme/tokens.ts`).
- **i18n:** RU (источник) / KK / EN, типобезопасный каталог на zustand + persist.

---

## 4. Что сделано ✅

### 4.1 Мобильное приложение (`mobile/`)
- 5 вкладок: **Главная** (ZERIVE Score, биовозраст, системы-прогресс-бары, приоритеты, ретест) · **Данные** (сегменты маркеры/документы, фильтры, 73 маркера, группировка по системам) · **План** (чек-лист, прогресс) · **AI** (чат) · **Профиль** (membership, настройки, язык, выход).
- Флоу: welcome (фото-hero) → вход (телефон+SMS / Apple / Google) → онбординг (3 шага + экран сборки) → checkout (лаборатория/город/дата → QR) → загрузка результатов (PDF/фото/вручную).
- Детальный экран биомаркера: range-track с оптимум-полосой, тренд, что/почему/что делать, связанные.
- Полностью перекрашено под присланный дизайн; `tsc` чистый; собирается в web и native.
- Пройден полный аудит (код + функции + визуал): контраст WCAG AA, a11y-лейблы, тосты для демо-кнопок, уникальные SVG-id, убран мёртвый код.

### 4.2 Дизайн-система
- Единая светлая тема на токенах (`tokens.ts`) — перекрашивается из одного файла.
- Брендовая иконка (оранжевый квадрат, **чёрная «z»**) во всех размерах + PWA (192/512/apple-touch/maskable).

### 4.3 Бэкенд + БД (`server/`) — **ЖИВОЙ**
- **Схема** (`server/schema.sql`): users, profiles, sessions, otp_codes, checkups, biomarker_catalog, biomarker_results, system_scores, body_systems, documents, plan_priorities, plan_steps, plan_progress, ai_messages.
- **Сид** (`gen-seed.mjs` → `seed.sql`): 8 систем, **73 биомаркера**, демо-юзер Alan с 3 чек-апами (для трендов). Контент трёхъязычный, берётся из того же датасета, что и офлайн-фолбэк приложения.
- **Мультиюзерность (реальная):** каждый номер = свой изолированный аккаунт; `POST /api/checkout/complete` (`server/lib/generate.js`) генерит персональную панель по детерминированному RNG от `user_id` — первый чек-ап создаёт 3 замера (сразу с трендами), считает статусы/score/биовозраст, персональный план из слабых маркеров и документ. Проверено: два юзера получают разные данные.
- **Grounded AI** (`server/api/ai.js`): отвечает по **реальным цифрам** юзера (rule-based, без LLM) — распознаёт конкретный маркер / «что изменилось» / усталость / приоритеты; RU/KK/EN.
- Аутентификация: телефон → OTP (демо: любой 4-значный код) → сессионный токен (sha256 в `sessions`).

### 4.4 Интеграция приложение ↔ API
- API-клиент (`mobile/src/lib/api.ts`), стор данных (`mobile/src/store/data.ts`), токен в персистентной сессии.
- Селекторы `mobile/src/data/health.ts` берут данные из API, офлайн — из статического `dataset.ts`.
- Loading-gate в `(tabs)/_layout.tsx`; checkout вызывает генерацию данных; план тоглится через API.
- **Проверено end-to-end:** приложение на загрузке дёргает `/api/report·biomarkers·plan·documents` (200), рендерит данные из Postgres, запись (тогл плана) персистентна, без токена 401, консоль чистая.

---

## 5. Модель данных (кратко)

- `body_systems` (8) → `biomarker_catalog` (73, трёхъязычный, диапазоны + what/why/actions).
- `users` → `profiles` (анкета), `sessions`, `checkups` → `biomarker_results` (значение+статус на маркер на чек-ап; **тренд = маркер по нескольким чек-апам**) + `system_scores`.
- `documents` (Health Vault), `plan_priorities` → `plan_steps` → `plan_progress` (done per user).

## 6. API-эндпоинты (12 — лимит Vercel Hobby)

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/api/auth/request-otp` | запрос кода (демо) |
| POST | `/api/auth/verify-otp` | вход, создаёт юзера + токен |
| GET | `/api/me` | профиль + флаги |
| PUT | `/api/profile` | сохранить анкету |
| GET | `/api/report` | дашборд (score, системы, counts) |
| GET | `/api/biomarkers` | все маркеры юзера с трендами |
| GET | `/api/biomarker/[id]` | один маркер |
| GET | `/api/plan` | план + шаги + done |
| POST | `/api/plan/toggle` | тогл шага |
| GET | `/api/documents` | Health Vault |
| POST | `/api/checkout/complete` | сгенерить персональный чек-ап |
| POST | `/api/ai` | grounded-ответ по данным юзера |

> Диагностический `/api/health` убран (упирались в лимит 12 функций).

---

## 7. Что замокано / НЕ сделано ⏳

Всё это требует **внешних аккаунтов/ключей пользователя** (добавляются как env-переменные
в Vercel — функции читают их в рантайме, секрет ассистенту не виден):

| Функция | Что нужно | env |
|---|---|---|
| Реальная SMS-OTP | провайдер Mobizon/SMSC (KZ) | `MOBIZON_API_KEY` (сейчас проходит любой 4-значный код) |
| Вход Apple / Google | client id/secret из консолей | `APPLE_*`, `GOOGLE_*` |
| Оплата (Kaspi/карта) | мерчант-аккаунт | ключи провайдера |
| AI на настоящем LLM (опц.) | ключ | `OPENAI_API_KEY` / Anthropic (сейчас rule-based grounded) |

Прочее из бэклога:
- Онбординг НЕ создаёт чек-ап (по дизайну данные появляются после покупки Check).
- Апы: пуш-уведомления, wearables, маркетплейс, семейные аккаунты — вне текущего MVP.

---

## 8. Куда двигаемся дальше 🚀

**Ближайшее (можно без внешних ключей):**
1. Реальная загрузка анализов: `/api/documents` (POST) — парсинг PDF/фото → строки `biomarker_results`.
2. История чек-апов в Профиле (список + переключение между тестами).
3. Ретест: повторный `checkout/complete` уже добавляет замер — довести UX «пересдачи» и сравнение.
4. Пуш «пора пересдать» (Expo Notifications).

**Требует ключей пользователя:**
5. Реальная SMS-OTP (Mobizon/SMSC).
6. Apple/Google вход.
7. Приём оплаты (Kaspi).
8. LLM-AI (по желанию) — заменить rule-based на настоящую модель.

**Прод-готовность:**
9. **Ротация пароля Neon** (после демо-доступов).
10. При росте числа функций — объединить роуты или перейти на Vercel **Pro** (лимит Hobby = 12 функций).
11. Реальная подпись Android (upload keystore) + сборка **iOS `.ipa`** (нужен Apple Developer, $99/год) через `eas build`.
12. Разделить фронт/бэк-репозитории и завести git (сейчас `ZERIVE/` — не git-репозиторий).

---

## 9. Как запускать / собирать / деплоить

### Локально (приложение)
```bash
cd mobile
npm install
npx tsc --noEmit          # проверка типов
npx expo start            # i / a / --web
```

### Деплой (web + API на Vercel, проект zerive-app)
```bash
cd mobile
npx expo export --platform web
node scripts/patch-web.mjs      # PWA-мета + фикс шрифтов (assets/node_modules → assets/deps)
# собрать деплой-папку: dist/ + server/api + server/lib + server/package.json + server/vercel.json
# из линкованной папки:  vercel deploy --prod --yes
```
**Подводные камни Vercel (зашиты в `patch-web.mjs` / процесс):**
- `output:"single"` игнорит `+html.tsx` → PWA-теги + регистрация SW инжектятся в `dist/index.html` пост-скриптом.
- Vercel **вырезает любые папки `node_modules`** из статик-деплоя → шрифты переименованы в `assets/deps`.
- `vercel.json`: `buildCommand:"echo …"` чтобы Vercel НЕ пересобирал уже готовый фронт; SPA-rewrite исключает `/api`.
- Лимит **12 serverless-функций** на Hobby.

### БД (миграция/сид — разово)
Схема уже накатана. При необходимости пересоздать:
`server/schema.sql` + `server/seed.sql` через прямое (unpooled) подключение
(миграция гоняли через временный key-protected `/api/admin/migrate`, вынесен в `server/_offline/`).

### Native .apk (локально, без EAS)
Ставился Temurin JDK + Android SDK/NDK → `expo prebuild -p android` → `gradle assembleRelease`.
Для прод-дистрибуции лучше `eas build -p android --profile preview` (нужен Expo-аккаунт).

---

## 10. Карта файлов

```
ZERIVE/
├─ PROJECT_STATUS.md          ← этот файл
├─ landing/                   лендинг (отдельный Vercel-проект)
├─ mobile/                    Expo-приложение (iOS + Android + Web/PWA)
│  ├─ src/app/                роуты (welcome, (auth), onboarding, (tabs), biomarker/[id], checkout, upload)
│  ├─ src/theme/tokens.ts     дизайн-токены (перекраска отсюда)
│  ├─ src/i18n/               RU/KK/EN каталог
│  ├─ src/data/               types.ts · dataset.ts (сгенерён) · health.ts (селекторы, API↔static)
│  ├─ src/store/              session (токен) · data (кэш API) · plan
│  ├─ src/lib/api.ts          API-клиент
│  ├─ src/components/         UI-кит
│  ├─ scripts/patch-web.mjs   пост-обработка web-сборки
│  ├─ public/                 manifest.json, sw.js, icons/
│  └─ eas.json                профили сборки (apk/ipa)
└─ server/                    бэкенд (деплоится вместе со статикой в zerive-app)
   ├─ schema.sql · gen-seed.mjs → seed.sql
   ├─ api/                    12 serverless-функций
   ├─ lib/                    db · http · markers · generate · sql
   └─ vercel.json · package.json
```

---

## 11. Безопасность / заметки
- **Сменить пароль Neon** после демо-доступов (пользователь планировал ротацию).
- Секреты БД лежат только в Vercel env (encrypted) — ассистент их значения не видел; миграции гонялись через прямое подключение и через серверные функции.
- OTP сейчас демо (любой код) — до подключения SMS-провайдера не считать защищённым.
- Токены сессии хранятся хэшированными (`sessions.token_hash`), TTL 90 дней.
