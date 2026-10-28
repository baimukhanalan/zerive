// ZERIVE UI internationalization — RU (source of truth) + KK (Kazakh) + EN.
// Copy mirrors the approved app design. `ru` is authored first; its shape is the
// `Catalog` type, so `kk`/`en` are compile-checked to match (tsc fails on drift).

import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { L10n, Lang } from '@/data/types';

export type { Lang } from '@/data/types';

const ru = {
  common: {
    next: 'Продолжить', back: 'Назад', done: 'Готово', skip: 'Пропустить', cancel: 'Отмена',
    save: 'Сохранить', seeAll: 'все данные', soon: 'скоро', beta: 'BETA', of: 'из', retry: 'Повторить', or: 'или',
    demoToast: 'Демо-прототип',
  },
  lang: { label: 'Язык', ru: 'РУ', kk: 'ҚАЗ', en: 'EN' },
  tabs: { home: 'Главная', data: 'Данные', plan: 'План', ai: 'AI', profile: 'Профиль' },

  welcome: {
    eyebrow: 'превентивное здоровье · казахстан',
    title: 'Знай, что происходит внутри',
    sub: 'Один забор крови. 70+ биомаркеров. Понятная картина здоровья и план действий.',
    cta: 'Начать',
    skip: '[ у меня уже есть аккаунт ]',
    partners: 'INVIVO · OLYMP · SYNEVO · KDL',
  },

  auth: {
    titleNew: 'Создайте аккаунт',
    titleIn: 'С возвращением',
    sub: 'Номер телефона — это ваш логин',
    getCode: 'Получить код',
    apple: 'Продолжить с Apple',
    google: 'Продолжить с Google',
    terms: 'Продолжая, вы принимаете условия сервиса и политику медицинских данных',
    otpTitle: 'Код из SMS',
    otpSub: 'Отправили на',
    hint: 'введите любые 4 цифры — это прототип',
    resend: 'отправить ещё раз',
    change: 'изменить номер',
    phonePlaceholder: '701 234 56 78',
    errPhone: 'Введите номер телефона',
  },

  onboarding: {
    titles: ['О вас', 'Ваши цели', 'Образ жизни'],
    subs: ['Пара базовых параметров', 'Выберите всё подходящее', 'Последний шаг — привычки'],
    next: 'Продолжить',
    done: 'Создать профиль',
    count: '{n} / 3',
    gSex: 'Пол', gAge: 'Возраст', gCity: 'Город', gSleep: 'Сон, часов', gAct: 'Активность', gSmoke: 'Курение', gAlc: 'Алкоголь',
    sexM: 'Мужской', sexF: 'Женский',
    actL: 'Низкая', actM: 'Средняя', actH: 'Высокая',
    smN: 'Нет', smS: 'Иногда', smY: 'Да',
    alN: 'Нет', alR: 'Редко', alF: 'Часто',
    cityAlmaty: 'Алматы', cityAstana: 'Астана', cityShymkent: 'Шымкент',
    goals: { energy: 'Энергия', longevity: 'Долголетие', sleep: 'Сон', weight: 'Вес', heart: 'Сердце', stress: 'Стресс' },
    goalMeta: { energy: 'усталость, тонус', longevity: 'биовозраст', sleep: 'качество сна', weight: 'состав тела', heart: 'липиды, риски', stress: 'кортизол' },
    buildLines: ['Анализируем анкету…', 'Готовим панель биомаркеров…', 'Собираем ваш дашборд…'],
    buildSub: 'обычно меньше минуты',
    buildDone: 'Профиль готов',
  },

  home: {
    greets: ['Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'],
    date: 'воскресенье · 9 августа',
    scoreLabel: 'ZERIVE SCORE',
    updated: 'обновлён 6 авг',
    sinceTest: '+4 с прошлого теста',
    legOpt: 'Оптимально', legNorm: 'Норма', legAtt: 'Внимание',
    bioEyebrow: 'биологический возраст',
    bioUnit: 'года',
    bioLine: 'к паспортным 34',
    bodyTitle: 'Ваше тело',
    prioTitle: 'Требуют внимания',
    retestTitle: 'Пересдача в ноябре',
    retestSub: '12 маркеров · 1 визит · 20 минут',
    retestBtn: 'запланировать',
  },

  data: {
    title: 'Данные',
    segMarkers: 'маркеры', segDocs: 'документы',
    fAll: 'Все',
    note: 'все показатели вашей панели, сгруппированы по системам',
    searchPlaceholder: 'Поиск показателя…',
    empty: 'Ничего не найдено',
    docProc: 'Распознаём документ…',
    docNew: 'Скан анализа', docNewMeta: 'сегодня · +24 показателя',
    upDone: '24 показателя добавлены',
    privacyNote: 'зашифровано · данные видите только вы',
    stProc: 'обработка', stOk: 'готово',
  },

  status: { optimal: 'Оптимально', normal: 'Норма', attention: 'Внимание', high: 'Приоритет' },

  biomarker: {
    what: 'Что это', why: 'Почему важно', act: 'Что делать', hist: 'История и связанные',
    lab: 'Диапазон', opt: 'оптимум', ask: 'спросить zerive ai', doc: 'С врачом:',
    noOpt: 'оптимум уточняется',
  },

  plan: {
    title: 'План действий',
    intro: 'Безопасные шаги под вашу биологию. Отмечайте выполненное.',
    done: 'выполнено',
    retestEyebrow: 'следующий шаг',
    retestLine: 'Пересдача — ноябрь 2026',
    note: 'Медикаменты — только после консультации врача. Zerive не назначает лечение.',
    doctor: 'обсудить с врачом',
    goal: 'Цель',
    kinds: { diet: 'Питание', lifestyle: 'Образ жизни', activity: 'Активность', supplement: 'Добавка', retest: 'Ретест', discuss: 'К врачу' },
  },

  ai: {
    title: 'Zerive AI',
    sub: 'знает ваши 72 маркера и анкету',
    placeholder: 'Спросите о результатах…',
    disclaimer: 'не заменяет консультацию врача',
    hello: 'Я изучил ваш чек-ап от 6 августа. Спросите про любой показатель — отвечу по вашим цифрам.',
    send: 'Отправить',
    suggestions: 'Популярные вопросы',
    thinking: 'печатает…',
  },

  profile: {
    title: 'Профиль',
    meta: 'Мужчина · 34 · Алматы',
    memLine: '1 чек-ап в год · AI · план · тренды',
    memMeta: 'активен до янв 2027',
    settTitle: 'Настройки',
    langLabel: 'Язык', notifLabel: 'Уведомления', labLabel: 'Лаборатория', payLabel: 'Оплата', privLabel: 'Приватность',
    signout: 'Выйти из аккаунта',
    labDetail: 'INVIVO · Алматы', payDetail: '•• 4821',
    vault: 'Мои документы',
    uploadResults: 'Загрузить анализы',
    version: 'ZERIVE · v0.1.0 · Almaty',
  },

  upload: {
    title: 'Загрузить анализы',
    sub: 'PDF или фото — Zerive распознает 4000+ обозначений',
    sheetSub: 'результаты добавятся в вашу историю',
    pdf: 'PDF файл', photo: 'Фото анализа', manual: 'Ввести вручную',
    cancel: 'Отмена',
    processing: 'Распознаём показатели…',
    addedTitle: 'Добавлено', addedSub: '24 показателя добавлены в вашу историю.',
  },

  checkout: {
    eyebrow: 'zerive check · превентивный чек-ап',
    title: 'ZERIVE Complete',
    sub: 'Один забор крови. 70+ показателей. Понятная картина здоровья, план и ретест.',
    includesTitle: 'Что входит',
    inc: [
      'Расширенная лабораторная панель',
      'ZERIVE Score и биовозраст',
      '70+ биомаркеров с расшифровкой',
      'Персональный план действий',
      'AI-ассистент по вашим данным',
      'Хранение и динамика показателей',
    ],
    chooseLab: 'Лаборатория', chooseCity: 'Город', chooseDate: 'Дата и время',
    homeDraw: 'Забор на дому',
    price: 'Цена', priceValue: '99 000 ₸',
    payKaspi: 'Оплатить · Kaspi', payCard: 'Оплатить картой',
    securedNote: 'Оплата защищена. Отмена в любой момент до забора крови.',
    successTitle: 'Заказ оформлен',
    successSub: 'Покажите QR в лаборатории — кровь возьмут за один визит.',
    orderNo: 'Номер заказа',
  },
};

export type Catalog = typeof ru;

const kk: Catalog = {
  common: {
    next: 'Жалғастыру', back: 'Артқа', done: 'Дайын', skip: 'Өткізу', cancel: 'Бас тарту',
    save: 'Сақтау', seeAll: 'барлық деректер', soon: 'жақында', beta: 'BETA', of: '/', retry: 'Қайталау', or: 'немесе',
    demoToast: 'Демо прототип',
  },
  lang: { label: 'Тіл', ru: 'РУ', kk: 'ҚАЗ', en: 'EN' },
  tabs: { home: 'Басты', data: 'Деректер', plan: 'Жоспар', ai: 'AI', profile: 'Профиль' },

  welcome: {
    eyebrow: 'превентивті денсаулық · қазақстан',
    title: 'Денеңде не болып жатқанын біл',
    sub: 'Бір қан тапсыру. 70+ биомаркер. Түсінікті денсаулық көрінісі және әрекет жоспары.',
    cta: 'Бастау',
    skip: '[ менде аккаунт бар ]',
    partners: 'INVIVO · OLYMP · SYNEVO · KDL',
  },

  auth: {
    titleNew: 'Аккаунт құру',
    titleIn: 'Қош келдіңіз',
    sub: 'Телефон нөмірі — сіздің логиніңіз',
    getCode: 'Код алу',
    apple: 'Apple арқылы жалғастыру',
    google: 'Google арқылы жалғастыру',
    terms: 'Жалғастыра отырып, қызмет шарттары мен медициналық деректер саясатын қабылдайсыз',
    otpTitle: 'SMS-тегі код',
    otpSub: 'Жіберілді:',
    hint: 'кез келген 4 сан енгізіңіз — бұл прототип',
    resend: 'қайта жіберу',
    change: 'нөмірді өзгерту',
    phonePlaceholder: '701 234 56 78',
    errPhone: 'Телефон нөмірін енгізіңіз',
  },

  onboarding: {
    titles: ['Сіз туралы', 'Мақсаттарыңыз', 'Өмір салты'],
    subs: ['Бірнеше негізгі параметр', 'Барлық сәйкесін таңдаңыз', 'Соңғы қадам — әдеттер'],
    next: 'Жалғастыру',
    done: 'Профиль құру',
    count: '{n} / 3',
    gSex: 'Жыныс', gAge: 'Жас', gCity: 'Қала', gSleep: 'Ұйқы, сағат', gAct: 'Белсенділік', gSmoke: 'Темекі', gAlc: 'Алкоголь',
    sexM: 'Ер', sexF: 'Әйел',
    actL: 'Төмен', actM: 'Орташа', actH: 'Жоғары',
    smN: 'Жоқ', smS: 'Кейде', smY: 'Иә',
    alN: 'Жоқ', alR: 'Сирек', alF: 'Жиі',
    cityAlmaty: 'Алматы', cityAstana: 'Астана', cityShymkent: 'Шымкент',
    goals: { energy: 'Қуат', longevity: 'Ұзақ өмір', sleep: 'Ұйқы', weight: 'Салмақ', heart: 'Жүрек', stress: 'Стресс' },
    goalMeta: { energy: 'шаршау, тонус', longevity: 'биожас', sleep: 'ұйқы сапасы', weight: 'дене құрамы', heart: 'липидтер', stress: 'кортизол' },
    buildLines: ['Сауалнаманы талдаудамыз…', 'Биомаркер панелін дайындаудамыз…', 'Дашбордыңызды құрастырудамыз…'],
    buildSub: 'әдетте бір минуттан аз',
    buildDone: 'Профиль дайын',
  },

  home: {
    greets: ['Қайырлы түн', 'Қайырлы таң', 'Қайырлы күн', 'Қайырлы кеш'],
    date: 'жексенбі · 9 тамыз',
    scoreLabel: 'ZERIVE SCORE',
    updated: '6 там жаңартылды',
    sinceTest: 'өткен тесттен +4',
    legOpt: 'Оптималды', legNorm: 'Қалыпты', legAtt: 'Назар',
    bioEyebrow: 'биологиялық жас',
    bioUnit: 'жас',
    bioLine: 'паспорттағы 34-ке',
    bodyTitle: 'Сіздің денеңіз',
    prioTitle: 'Назар қажет',
    retestTitle: 'Қарашада қайта тапсыру',
    retestSub: '12 маркер · 1 келу · 20 минут',
    retestBtn: 'жоспарлау',
  },

  data: {
    title: 'Деректер',
    segMarkers: 'маркерлер', segDocs: 'құжаттар',
    fAll: 'Барлығы',
    note: 'панеліңіздің барлық көрсеткіштері, жүйелер бойынша',
    searchPlaceholder: 'Көрсеткішті іздеу…',
    empty: 'Ештеңе табылмады',
    docProc: 'Құжатты танудамыз…',
    docNew: 'Талдау сканы', docNewMeta: 'бүгін · +24 көрсеткіш',
    upDone: '24 көрсеткіш қосылды',
    privacyNote: 'шифрланған · деректерді тек сіз көресіз',
    stProc: 'өңделуде', stOk: 'дайын',
  },

  status: { optimal: 'Оптималды', normal: 'Қалыпты', attention: 'Назар', high: 'Басымдық' },

  biomarker: {
    what: 'Бұл не', why: 'Неге маңызды', act: 'Не істеу керек', hist: 'Тарих және байланысты',
    lab: 'Диапазон', opt: 'оптимум', ask: 'zerive ai-дан сұрау', doc: 'Дәрігермен:',
    noOpt: 'оптимум нақтылануда',
  },

  plan: {
    title: 'Әрекет жоспары',
    intro: 'Биологияңызға сай қауіпсіз қадамдар. Орындалғанын белгілеңіз.',
    done: 'орындалды',
    retestEyebrow: 'келесі қадам',
    retestLine: 'Қайта тапсыру — қараша 2026',
    note: 'Дәрі-дәрмек — тек дәрігер кеңесінен кейін. Zerive ем тағайындамайды.',
    doctor: 'дәрігермен талқылау',
    goal: 'Мақсат',
    kinds: { diet: 'Тамақтану', lifestyle: 'Өмір салты', activity: 'Белсенділік', supplement: 'Қосымша', retest: 'Ретест', discuss: 'Дәрігерге' },
  },

  ai: {
    title: 'Zerive AI',
    sub: '72 маркеріңіз бен сауалнамаңызды біледі',
    placeholder: 'Нәтижелер туралы сұраңыз…',
    disclaimer: 'дәрігер кеңесін алмастырмайды',
    hello: '6 тамыздағы чек-апыңызды зерттедім. Кез келген көрсеткіш туралы сұраңыз — сіздің сандарыңызбен жауап беремін.',
    send: 'Жіберу',
    suggestions: 'Танымал сұрақтар',
    thinking: 'теруде…',
  },

  profile: {
    title: 'Профиль',
    meta: 'Ер · 34 · Алматы',
    memLine: 'жылына 1 чек-ап · AI · жоспар · трендтер',
    memMeta: 'қаң 2027 дейін белсенді',
    settTitle: 'Баптаулар',
    langLabel: 'Тіл', notifLabel: 'Хабарламалар', labLabel: 'Зертхана', payLabel: 'Төлем', privLabel: 'Құпиялылық',
    signout: 'Аккаунттан шығу',
    labDetail: 'INVIVO · Алматы', payDetail: '•• 4821',
    vault: 'Менің құжаттарым',
    uploadResults: 'Талдау жүктеу',
    version: 'ZERIVE · v0.1.0 · Almaty',
  },

  upload: {
    title: 'Талдау жүктеу',
    sub: 'PDF немесе фото — Zerive 4000+ белгіні таниды',
    sheetSub: 'нәтижелер тарихыңызға қосылады',
    pdf: 'PDF файл', photo: 'Талдау фотосы', manual: 'Қолмен енгізу',
    cancel: 'Бас тарту',
    processing: 'Көрсеткіштерді танудамыз…',
    addedTitle: 'Қосылды', addedSub: '24 көрсеткіш тарихыңызға қосылды.',
  },

  checkout: {
    eyebrow: 'zerive check · превентивті чек-ап',
    title: 'ZERIVE Complete',
    sub: 'Бір қан тапсыру. 70+ көрсеткіш. Түсінікті денсаулық көрінісі, жоспар және ретест.',
    includesTitle: 'Не кіреді',
    inc: [
      'Кеңейтілген зертханалық панель',
      'ZERIVE Score және биожас',
      '70+ биомаркер талдауымен',
      'Жеке әрекет жоспары',
      'Деректеріңізге негізделген AI-ассистент',
      'Көрсеткіштерді сақтау және динамика',
    ],
    chooseLab: 'Зертхана', chooseCity: 'Қала', chooseDate: 'Күні мен уақыты',
    homeDraw: 'Үйден қан алу',
    price: 'Баға', priceValue: '99 000 ₸',
    payKaspi: 'Kaspi арқылы төлеу', payCard: 'Картамен төлеу',
    securedNote: 'Төлем қорғалған. Қан алғанға дейін кез келген уақытта болдырмауға болады.',
    successTitle: 'Тапсырыс рәсімделді',
    successSub: 'Зертханада QR көрсетіңіз — қанды бір келуде алады.',
    orderNo: 'Тапсырыс нөмірі',
  },
};

const en: Catalog = {
  common: {
    next: 'Continue', back: 'Back', done: 'Done', skip: 'Skip', cancel: 'Cancel',
    save: 'Save', seeAll: 'all data', soon: 'soon', beta: 'BETA', of: 'of', retry: 'Retry', or: 'or',
    demoToast: 'Prototype demo',
  },
  lang: { label: 'Language', ru: 'РУ', kk: 'ҚАЗ', en: 'EN' },
  tabs: { home: 'Home', data: 'Data', plan: 'Plan', ai: 'AI', profile: 'Profile' },

  welcome: {
    eyebrow: 'preventive health · kazakhstan',
    title: 'Know what is happening inside',
    sub: 'One blood draw. 70+ biomarkers. A clear picture of your health and a plan of action.',
    cta: 'Get started',
    skip: '[ i already have an account ]',
    partners: 'INVIVO · OLYMP · SYNEVO · KDL',
  },

  auth: {
    titleNew: 'Create account',
    titleIn: 'Welcome back',
    sub: 'Your phone number is your login',
    getCode: 'Get code',
    apple: 'Continue with Apple',
    google: 'Continue with Google',
    terms: 'By continuing you accept the terms of service and the medical data policy',
    otpTitle: 'SMS code',
    otpSub: 'Sent to',
    hint: 'type any 4 digits — this is a prototype',
    resend: 'resend code',
    change: 'change number',
    phonePlaceholder: '701 234 56 78',
    errPhone: 'Enter your phone number',
  },

  onboarding: {
    titles: ['About you', 'Your goals', 'Lifestyle'],
    subs: ['A few basics', 'Pick all that apply', 'Last step — habits'],
    next: 'Continue',
    done: 'Create profile',
    count: '{n} / 3',
    gSex: 'Sex', gAge: 'Age', gCity: 'City', gSleep: 'Sleep, hours', gAct: 'Activity', gSmoke: 'Smoking', gAlc: 'Alcohol',
    sexM: 'Male', sexF: 'Female',
    actL: 'Low', actM: 'Medium', actH: 'High',
    smN: 'No', smS: 'Sometimes', smY: 'Yes',
    alN: 'No', alR: 'Rarely', alF: 'Often',
    cityAlmaty: 'Almaty', cityAstana: 'Astana', cityShymkent: 'Shymkent',
    goals: { energy: 'Energy', longevity: 'Longevity', sleep: 'Sleep', weight: 'Weight', heart: 'Heart', stress: 'Stress' },
    goalMeta: { energy: 'fatigue, tone', longevity: 'bio age', sleep: 'sleep quality', weight: 'body comp', heart: 'lipids, risk', stress: 'cortisol' },
    buildLines: ['Analyzing your answers…', 'Preparing your biomarker panel…', 'Building your dashboard…'],
    buildSub: 'usually under a minute',
    buildDone: 'Profile ready',
  },

  home: {
    greets: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
    date: 'sunday · august 9',
    scoreLabel: 'ZERIVE SCORE',
    updated: 'updated aug 6',
    sinceTest: '+4 since your last test',
    legOpt: 'Optimal', legNorm: 'Normal', legAtt: 'Attention',
    bioEyebrow: 'biological age',
    bioUnit: 'years',
    bioLine: 'vs your actual 34',
    bodyTitle: 'Your body',
    prioTitle: 'Needs attention',
    retestTitle: 'Retest in November',
    retestSub: '12 markers · 1 visit · 20 minutes',
    retestBtn: 'schedule',
  },

  data: {
    title: 'Data',
    segMarkers: 'markers', segDocs: 'documents',
    fAll: 'All',
    note: 'all your panel markers, grouped by system',
    searchPlaceholder: 'Search a marker…',
    empty: 'Nothing found',
    docProc: 'Processing document…',
    docNew: 'Lab scan', docNewMeta: 'today · +24 markers',
    upDone: '24 markers added',
    privacyNote: 'encrypted · only you can see your data',
    stProc: 'processing', stOk: 'done',
  },

  status: { optimal: 'Optimal', normal: 'Normal', attention: 'Attention', high: 'Priority' },

  biomarker: {
    what: 'What it is', why: 'Why it matters', act: 'What to do', hist: 'History & related',
    lab: 'Range', opt: 'optimal', ask: 'ask zerive ai', doc: 'With a doctor:',
    noOpt: 'optimal to be defined',
  },

  plan: {
    title: 'Action Plan',
    intro: 'Safe steps tuned to your biology. Check off what’s done.',
    done: 'done',
    retestEyebrow: 'next step',
    retestLine: 'Retest — November 2026',
    note: 'Medication — only after seeing a doctor. Zerive does not prescribe treatment.',
    doctor: 'discuss with a doctor',
    goal: 'Goal',
    kinds: { diet: 'Nutrition', lifestyle: 'Lifestyle', activity: 'Activity', supplement: 'Supplement', retest: 'Retest', discuss: 'Doctor' },
  },

  ai: {
    title: 'Zerive AI',
    sub: 'knows your 72 markers and intake',
    placeholder: 'Ask about your results…',
    disclaimer: 'not a substitute for medical advice',
    hello: 'I have reviewed your Aug 6 check-up. Ask about any marker — I answer with your numbers.',
    send: 'Send',
    suggestions: 'Popular questions',
    thinking: 'typing…',
  },

  profile: {
    title: 'Profile',
    meta: 'Male · 34 · Almaty',
    memLine: '1 check-up / year · AI · plan · trends',
    memMeta: 'active until jan 2027',
    settTitle: 'Settings',
    langLabel: 'Language', notifLabel: 'Notifications', labLabel: 'Laboratory', payLabel: 'Payment', privLabel: 'Privacy',
    signout: 'Sign out',
    labDetail: 'INVIVO · Almaty', payDetail: '•• 4821',
    vault: 'My documents',
    uploadResults: 'Upload results',
    version: 'ZERIVE · v0.1.0 · Almaty',
  },

  upload: {
    title: 'Upload results',
    sub: 'PDF or photo — Zerive reads 4,000+ marker names',
    sheetSub: 'results are added to your history',
    pdf: 'PDF file', photo: 'Photo of results', manual: 'Enter manually',
    cancel: 'Cancel',
    processing: 'Recognizing markers…',
    addedTitle: 'Added', addedSub: '24 markers added to your history.',
  },

  checkout: {
    eyebrow: 'zerive check · preventive check-up',
    title: 'ZERIVE Complete',
    sub: 'One blood draw. 70+ markers. A clear health picture, a plan and a retest.',
    includesTitle: 'What’s included',
    inc: [
      'Extended lab panel',
      'ZERIVE Score & biological age',
      '70+ biomarkers explained',
      'Personal action plan',
      'AI assistant over your data',
      'Storage & trends of your markers',
    ],
    chooseLab: 'Laboratory', chooseCity: 'City', chooseDate: 'Date & time',
    homeDraw: 'Home blood draw',
    price: 'Price', priceValue: '99,000 ₸',
    payKaspi: 'Pay with Kaspi', payCard: 'Pay by card',
    securedNote: 'Payment is secure. Cancel any time before the blood draw.',
    successTitle: 'Order placed',
    successSub: 'Show the QR at the lab — your blood is drawn in a single visit.',
    orderNo: 'Order number',
  },
};

export const STRINGS: Record<Lang, Catalog> = { ru, kk, en };

/* ── persisted language store ──────────────────────────────────────────────── */

const memoryStorage: StateStorage = (() => {
  const mem = new Map<string, string>();
  return {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => { mem.set(k, v); },
    removeItem: (k) => { mem.delete(k); },
  };
})();

const backingStore: StateStorage =
  Platform.OS === 'web' && typeof window === 'undefined' ? memoryStorage : AsyncStorage;

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({ lang: 'ru', setLang: (lang) => set({ lang }) }),
    {
      name: 'zerive.lang',
      storage: createJSONStorage(() => backingStore),
      partialize: (s) => ({ lang: s.lang }),
    },
  ),
);

/* ── hooks & helpers ───────────────────────────────────────────────────────── */

export function useT(): Catalog {
  return STRINGS[useLangStore((s) => s.lang)];
}

export function useLang(): Lang {
  return useLangStore((s) => s.lang);
}

export function pick(l10n: L10n, lang: Lang): string {
  return l10n[lang] ?? l10n.ru;
}

export function useL10n(): (l10n: L10n) => string {
  const lang = useLang();
  return (l10n: L10n) => pick(l10n, lang);
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
