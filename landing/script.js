(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     i18n catalog — every visible string on the page (RU / KK / EN)
     ───────────────────────────────────────────────────────────── */
  var I18N = {
    ru: {
      'meta.title': 'ZERIVE — здоровье твоя суперсила',
      'meta.description': 'ZERIVE — здоровье по подписке. 100+ биомаркеров за один забор крови, биовозраст, персональный план и ИИ-врач. Впервые в Казахстане.',

      'nav.signup': '[ Получить доступ ]',
      'rail.aria': 'Разделы страницы',

      'rail.01': '01 · Начало', 'rail.02': '02 · Проблема', 'rail.03': '03 · Тело',
      'rail.04': '04 · 100+', 'rail.05': '05 · Тест', 'rail.06': '06 · Приложение',
      'rail.07': '07 · Долголетие', 'rail.08': '08 · Энергия', 'rail.09': '09 · Маркет',
      'rail.10': '10 · Отзывы', 'rail.11': '11 · Приложение', 'rail.12': '12 · Тарифы',

      'hero.eyebrow': 'zerive · здоровье по подписке',
      'hero.h1': 'Здоровье — твоя суперсила',
      'hero.lead': 'Загляни внутрь своего тела по 100+ биомаркерам. Биовозраст, персональный план и врач-консьерж — впервые в Казахстане.',
      'hero.cta': '[ Ранний доступ ]',
      'hero.scroll': 'Листай',

      'problem.eyebrow': 'почему это важно',
      'problem.h2': 'Мы узнаём о болезни, когда уже поздно.',
      'problem.lead': 'Обычный чек-ап — это 20–30 показателей раз в год. Тело подаёт сигналы задолго до диагноза. Их просто никто не читает.',

      'body.eyebrow': 'твоя биология',
      'body.h2': 'Твоё тело говорит на языке данных',
      'body.lead': 'ZERIVE переводит его на человеческий: понятные показатели вместо непонятных простыней анализов.',

      'num.eyebrow': 'один забор крови',
      'num.h2': 'биомаркеров за один тест',
      'num.lead': 'Сердце, печень, почки, гормоны, метаболизм, витамины и воспаление — в 10 раз глубже обычного анализа.',

      'test.eyebrow': 'шаг 01',
      'test.h2': 'Сдай тест — дома или в лаборатории',
      'test.lead': 'Один забор крови в партнёрской лаборатории или с выездом на дом. Результаты — за 5–7 дней.',
      'test.labs_more': '+ 40 городов',

      'app.eyebrow': 'приложение zerive',
      'app.h2': 'Расшифруй свои результаты',
      'app.lead': 'Чистая панель со скорами здоровья и биовозрастом — вместо непонятных лабораторных таблиц.',

      'phone.title': 'Мой отчёт',
      'phone.date': '6 окт',
      'phone.score_value': 'Отлично',
      'phone.bioage_label': 'Биовозраст',
      'phone.bioage_delta': '−3 года',
      'phone.cat_heart': 'Сердце',
      'phone.cat_liver': 'Печень',
      'phone.cat_metabolism': 'Метаболизм',
      'phone.cat_kidneys': 'Почки',

      'long.eyebrow': 'биовозраст',
      'long.h2': 'Замедли свои биологические часы',
      'long.lead': 'Узнай, насколько твоё тело моложе или старше паспорта — и как это изменить с персональным планом.',

      'vita.h2': 'Живи дольше. Живи ярче.',
      'vita.lead': 'Не просто дожить — прожить эти годы сильным, ясным и полным энергии.',

      'market.eyebrow': 'маркетплейс здоровья',
      'market.h2': 'Добавки из твоего плана — со скидкой участника',
      'market.lead': 'Проверенные добавки, диагностика и препараты. −25% для участников ZERIVE, доставка по Казахстану.',

      'reviews.eyebrow': 'отзывы',
      'reviews.aria': 'Отзывы участников ZERIVE',
      'reviews.h2': 'Что говорят участники',
      'reviews.lead': 'Реальные истории тех, кто уже заглянул внутрь себя.',
      'city.almaty': 'Алматы', 'city.astana': 'Астана', 'city.shymkent': 'Шымкент',
      'city.karaganda': 'Караганда', 'city.aktobe': 'Актобе',
      'reviews.r1': '«Впервые увидела своё здоровье в цифрах, а не в ощущениях. Биовозраст оказался на 4 года меньше — приятно.»',
      'reviews.r2': '«Сдал кровь один раз и получил 100+ показателей. Врач-консьерж всё объяснил простыми словами.»',
      'reviews.r3': '«Нашли дефицит витамина D и железа, о которых я даже не подозревала. Через три месяца — совсем другая энергия.»',
      'reviews.r4': '«План здоровья в приложении реально работает. Холестерин пришёл в норму без лишней паники.»',
      'reviews.r5': '«Раньше чек-ап был стрессом. Здесь всё понятно: скор, биовозраст и чёткие шаги, что делать дальше.»',
      'reviews.r6': '«Забор крови дома, результаты в телефоне за неделю. Это тот сервис, которого не хватало в Казахстане.»',
      'reviews.r7': '«Отслеживаю метаболизм и гормоны каждые три месяца. Наконец-то вижу, что мои привычки правда меняют цифры.»',
      'reviews.r8': '«Думал, что здоров, пока не увидел маркеры воспаления. Вовремя скорректировал — спасибо ZERIVE.»',

      'dl.eyebrow': 'приложение',
      'dl.h2': 'Скачай приложение ZERIVE',
      'dl.sub': 'Твой отчёт, план и ИИ-врач — всегда в кармане.',
      'dl.appstore_small': 'Загрузите в',
      'dl.play_small': 'Доступно в',

      'pricing.eyebrow': 'тарифы',
      'pricing.title': 'Выбери свой уровень заботы',
      'pricing.lead': 'Три подписки — от базового чек-апа до максимального контроля здоровья. Без обязательств, отмена в любой момент.',
      'pricing.price': 'Ранняя цена — для первых участников',
      'pricing.btn_request': '[ Оставить заявку ]',
      'pricing.btn_early': '[ Ранний доступ ]',
      'pricing.t1.name': 'Базовый', 'pricing.t1.tag': 'старт',
      'pricing.t1.desc': 'Ежегодный чек-ап и понятная картина здоровья.',
      'pricing.t1.f1': '100+ биомаркеров · 1 раз в год',
      'pricing.t1.f2': 'Биовозраст и ZERIVE Score',
      'pricing.t1.f3': 'Приложение и история данных',
      'pricing.t2.name': 'Оптимальный', 'pricing.t2.tag': 'выбор',
      'pricing.t2.desc': 'Полный контроль: план, врач и ретесты.',
      'pricing.t2.f1': 'Всё из «Базового»',
      'pricing.t2.f2': 'Персональный план здоровья',
      'pricing.t2.f3': 'ИИ-врач и команда заботы 24/7',
      'pricing.t2.f4': '−25% на маркетплейс',
      'pricing.t3.name': 'Максимум', 'pricing.t3.tag': 'premium',
      'pricing.t3.desc': 'Расширенные панели и приоритетная забота.',
      'pricing.t3.f1': 'Всё из «Оптимального»',
      'pricing.t3.f2': 'Расширенные и специальные панели',
      'pricing.t3.f3': 'Ретесты каждые 3 месяца',
      'pricing.t3.f4': 'Персональный менеджер',
      'pricing.strip': 'Во всех тарифах: забор крови в 40+ городах · оплата Kaspi / картой · доставка по Казахстану',

      'cta.h2': 'Начни с ZERIVE',
      'cta.lead': 'Оставь почту — откроем ранний доступ первым в Казахстане.',
      'cta.placeholder': 'твоя почта',
      'cta.btn': '[ Записаться ]',
      'cta.fine': 'оплата Kaspi / картой · результаты за 5–7 дней · отмена в любой момент',
      'cta.consent': 'Кнопка откроет твой почтовый клиент с готовым письмом — оно уйдёт, только когда ты сам нажмёшь «Отправить». Адрес нужен нам лишь для приглашения в ранний доступ, мы не передаём его третьим лицам. Вопросы:',
      'cta.mail_subject': 'Ранний доступ ZERIVE',
      'cta.mail_body': 'Привет! Хочу в ранний доступ ZERIVE.\nМоя почта: ',
      'cta.status_ok': 'Открываем почтовый клиент — письмо на hello@zerive.kz уже готово, осталось нажать «Отправить».',
      'cta.status_bad': 'Проверь адрес почты — кажется, в нём опечатка.',

      'foot.copy': '© 2026 ZERIVE · Almaty · Astana · Shymkent · и расширяемся',
      'foot.link1': 'Тарифы', 'foot.link2': 'Лаборатории', 'foot.link3': 'Ранний доступ'
    },

    kk: {
      'meta.title': 'ZERIVE — денсаулық сенің суперкүшің',
      'meta.description': 'ZERIVE — жазылым бойынша денсаулық. Бір рет қан тапсырып 100-ден астам биомаркер, биологиялық жас, жеке жоспар және ЖИ-дәрігер. Қазақстанда алғаш рет.',

      'nav.signup': '[ Қол жеткізу ]',
      'rail.aria': 'Бет бөлімдері',

      'rail.01': '01 · Бастау', 'rail.02': '02 · Мәселе', 'rail.03': '03 · Дене',
      'rail.04': '04 · 100+', 'rail.05': '05 · Тест', 'rail.06': '06 · Қосымша',
      'rail.07': '07 · Ұзақ өмір', 'rail.08': '08 · Энергия', 'rail.09': '09 · Маркет',
      'rail.10': '10 · Пікірлер', 'rail.11': '11 · Қосымша', 'rail.12': '12 · Тарифтер',

      'hero.eyebrow': 'zerive · жазылым бойынша денсаулық',
      'hero.h1': 'Денсаулық — сенің суперкүшің',
      'hero.lead': 'Денеңнің ішіне 100-ден астам биомаркермен үңіл. Биологиялық жас, жеке жоспар және дәрігер-консьерж — Қазақстанда алғаш рет.',
      'hero.cta': '[ Ерте қол жеткізу ]',
      'hero.scroll': 'Төмен қарай',

      'problem.eyebrow': 'неге маңызды',
      'problem.h2': 'Ауру туралы кеш білеміз.',
      'problem.lead': 'Кәдімгі тексеру — жылына бар болғаны 20–30 көрсеткіш. Дене диагноздан әлдеқашан бұрын белгі береді. Оны жай ғана ешкім оқымайды.',

      'body.eyebrow': 'сенің биологияң',
      'body.h2': 'Денең деректер тілінде сөйлейді',
      'body.lead': 'ZERIVE оны адам тіліне аударады: түсініксіз талдау парақтарының орнына айқын көрсеткіштер.',

      'num.eyebrow': 'бір рет қан алу',
      'num.h2': 'биомаркер бір тестте',
      'num.lead': 'Жүрек, бауыр, бүйрек, гормондар, метаболизм, дәрумендер және қабыну — кәдімгі талдаудан 10 есе тереңірек.',

      'test.eyebrow': '01-қадам',
      'test.h2': 'Тесттен өт — үйде немесе зертханада',
      'test.lead': 'Серіктес зертханада немесе үйге шақыртып бір рет қан тапсыр. Нәтижесі — 5–7 күнде.',
      'test.labs_more': '+ 40 қала',

      'app.eyebrow': 'zerive қосымшасы',
      'app.h2': 'Нәтижелеріңді түсін',
      'app.lead': 'Түсініксіз зертханалық кестелердің орнына — денсаулық баллдары мен биологиялық жасы бар таза панель.',

      'phone.title': 'Менің есебім',
      'phone.date': '6 қаз',
      'phone.score_value': 'Өте жақсы',
      'phone.bioage_label': 'Биожас',
      'phone.bioage_delta': '−3 жыл',
      'phone.cat_heart': 'Жүрек',
      'phone.cat_liver': 'Бауыр',
      'phone.cat_metabolism': 'Метаболизм',
      'phone.cat_kidneys': 'Бүйрек',

      'long.eyebrow': 'биологиялық жас',
      'long.h2': 'Биологиялық сағатыңды баяулат',
      'long.lead': 'Денең паспорттағы жасыңнан қаншалықты жас не үлкен екенін біл — және оны жеке жоспармен қалай өзгертуге болатынын.',

      'vita.h2': 'Ұзақ өмір сүр. Жарқын өмір сүр.',
      'vita.lead': 'Жай ғана өмір сүру емес — сол жылдарды күшті, сергек және қуатқа толы өткізу.',

      'market.eyebrow': 'денсаулық маркетплейсі',
      'market.h2': 'Жоспарыңдағы қоспалар — қатысушы жеңілдігімен',
      'market.lead': 'Тексерілген қоспалар, диагностика және препараттар. ZERIVE қатысушыларына −25%, Қазақстан бойынша жеткізу.',

      'reviews.eyebrow': 'пікірлер',
      'reviews.aria': 'ZERIVE қатысушыларының пікірлері',
      'reviews.h2': 'Қатысушылар не дейді',
      'reviews.lead': 'Өз ішіне үңіліп үлгергендердің шынайы әңгімелері.',
      'city.almaty': 'Алматы', 'city.astana': 'Астана', 'city.shymkent': 'Шымкент',
      'city.karaganda': 'Қарағанды', 'city.aktobe': 'Ақтөбе',
      'reviews.r1': '«Денсаулығымды алғаш рет сезім арқылы емес, нақты сандармен көрдім. Биологиялық жасым 4 жасқа кіші болып шықты — қуаныштымын.»',
      'reviews.r2': '«Бір рет қан тапсырып, 100-ден астам көрсеткіш алдым. Дәрігер-консьерж бәрін қарапайым тілмен түсіндірді.»',
      'reviews.r3': '«Өзім білмеген D дәрумені мен темір тапшылығын анықтап берді. Үш айдан кейін энергиям мүлде басқаша.»',
      'reviews.r4': '«Қосымшадағы денсаулық жоспары шынымен жұмыс істейді. Холестерин артық дүрбелеңсіз қалыпқа келді.»',
      'reviews.r5': '«Бұрын тексерілу — стресс еді. Мұнда бәрі түсінікті: балл, биологиялық жас және келесі нақты қадамдар.»',
      'reviews.r6': '«Қанды үйден тапсырдым, нәтижесі бір аптада телефонымда. Қазақстанда осындай сервис жетіспей тұр еді.»',
      'reviews.r7': '«Метаболизм мен гормондарымды әр үш айда бақылаймын. Әдеттерім сандарды шынымен өзгертетінін ақыры көрдім.»',
      'reviews.r8': '«Қабыну маркерлерін көргенше өзімді сау деп ойладым. Уақытында түзедім — ZERIVE-ге рахмет.»',

      'dl.eyebrow': 'қосымша',
      'dl.h2': 'ZERIVE қосымшасын жүктеп ал',
      'dl.sub': 'Есебің, жоспарың және ЖИ-дәрігерің — әрқашан қалтаңда.',
      'dl.appstore_small': 'Жүктеп алыңыз',
      'dl.play_small': 'Қолжетімді',

      'pricing.eyebrow': 'тарифтер',
      'pricing.title': 'Қамқорлық деңгейіңді таңда',
      'pricing.lead': 'Үш жазылым — базалық тексеруден денсаулықты барынша бақылауға дейін. Міндеттемесіз, кез келген уақытта бас тартуға болады.',
      'pricing.price': 'Ерте баға — алғашқы қатысушыларға',
      'pricing.btn_request': '[ Өтінім қалдыру ]',
      'pricing.btn_early': '[ Ерте қол жеткізу ]',
      'pricing.t1.name': 'Базалық', 'pricing.t1.tag': 'старт',
      'pricing.t1.desc': 'Жыл сайынғы тексеру және денсаулықтың айқын бейнесі.',
      'pricing.t1.f1': '100+ биомаркер · жылына 1 рет',
      'pricing.t1.f2': 'Биологиялық жас және ZERIVE Score',
      'pricing.t1.f3': 'Қосымша және деректер тарихы',
      'pricing.t2.name': 'Оңтайлы', 'pricing.t2.tag': 'таңдау',
      'pricing.t2.desc': 'Толық бақылау: жоспар, дәрігер және қайта тесттер.',
      'pricing.t2.f1': '«Базалықтағы» барлығы',
      'pricing.t2.f2': 'Жеке денсаулық жоспары',
      'pricing.t2.f3': 'ЖИ-дәрігер және қамқорлық командасы 24/7',
      'pricing.t2.f4': 'Маркетплейске −25%',
      'pricing.t3.name': 'Максимум', 'pricing.t3.tag': 'premium',
      'pricing.t3.desc': 'Кеңейтілген панельдер және басым қамқорлық.',
      'pricing.t3.f1': '«Оңтайлыдағы» барлығы',
      'pricing.t3.f2': 'Кеңейтілген және арнайы панельдер',
      'pricing.t3.f3': 'Әр 3 айда қайта тест',
      'pricing.t3.f4': 'Жеке менеджер',
      'pricing.strip': 'Барлық тарифтерде: 40+ қалада қан алу · Kaspi / картамен төлеу · Қазақстан бойынша жеткізу',

      'cta.h2': 'ZERIVE-пен баста',
      'cta.lead': 'Поштаңды қалдыр — Қазақстанда алғашқылардың бірі болып ерте қол жеткіз.',
      'cta.placeholder': 'поштаң',
      'cta.btn': '[ Тіркелу ]',
      'cta.fine': 'Kaspi / картамен төлеу · нәтиже 5–7 күнде · кез келген уақытта бас тарту',
      'cta.consent': 'Түйме пошта қосымшаңды дайын хатпен ашады — хат сен «Жіберу» дегенде ғана кетеді. Мекенжайың бізге тек ерте қол жеткізуге шақыру үшін қажет, оны үшінші тұлғаларға бермейміз. Сұрақтар:',
      'cta.mail_subject': 'ZERIVE ерте қол жеткізу',
      'cta.mail_body': 'Сәлем! ZERIVE ерте қол жеткізуіне қосылғым келеді.\nПоштам: ',
      'cta.status_ok': 'Пошта қосымшаң ашылады — hello@zerive.kz мекенжайына хат дайын, «Жіберу» түймесін басу ғана қалды.',
      'cta.status_bad': 'Пошта мекенжайын тексер — қате бар сияқты.',

      'foot.copy': '© 2026 ZERIVE · Almaty · Astana · Shymkent · және кеңейіп келеміз',
      'foot.link1': 'Тарифтер', 'foot.link2': 'Зертханалар', 'foot.link3': 'Ерте қол жеткізу'
    },

    en: {
      'meta.title': 'ZERIVE — health is your superpower',
      'meta.description': 'ZERIVE — health by subscription. 100+ biomarkers from a single blood draw, bio-age, a personal plan and an AI doctor. A first for Kazakhstan.',

      'nav.signup': '[ Get access ]',
      'rail.aria': 'Page sections',

      'rail.01': '01 · Start', 'rail.02': '02 · Problem', 'rail.03': '03 · Body',
      'rail.04': '04 · 100+', 'rail.05': '05 · Test', 'rail.06': '06 · App',
      'rail.07': '07 · Longevity', 'rail.08': '08 · Energy', 'rail.09': '09 · Market',
      'rail.10': '10 · Reviews', 'rail.11': '11 · App', 'rail.12': '12 · Pricing',

      'hero.eyebrow': 'zerive · health by subscription',
      'hero.h1': 'Health is your superpower',
      'hero.lead': 'Look inside your body through 100+ biomarkers. Bio-age, a personal plan and a concierge doctor — a first for Kazakhstan.',
      'hero.cta': '[ Early access ]',
      'hero.scroll': 'Scroll',

      'problem.eyebrow': 'why it matters',
      'problem.h2': 'We learn about illness once it is already too late.',
      'problem.lead': 'A typical check-up is 20–30 markers once a year. The body sends signals long before a diagnosis. No one is simply reading them.',

      'body.eyebrow': 'your biology',
      'body.h2': 'Your body speaks the language of data',
      'body.lead': 'ZERIVE translates it into plain language: clear metrics instead of confusing lab printouts.',

      'num.eyebrow': 'one blood draw',
      'num.h2': 'biomarkers in a single test',
      'num.lead': 'Heart, liver, kidneys, hormones, metabolism, vitamins and inflammation — 10× deeper than a standard test.',

      'test.eyebrow': 'step 01',
      'test.h2': 'Take the test — at home or in a lab',
      'test.lead': 'One blood draw at a partner lab or with a home visit. Results in 5–7 days.',
      'test.labs_more': '+ 40 cities',

      'app.eyebrow': 'the zerive app',
      'app.h2': 'Make sense of your results',
      'app.lead': 'A clean dashboard with health scores and bio-age — instead of confusing lab tables.',

      'phone.title': 'My report',
      'phone.date': 'Oct 6',
      'phone.score_value': 'Excellent',
      'phone.bioage_label': 'Bio-age',
      'phone.bioage_delta': '−3 years',
      'phone.cat_heart': 'Heart',
      'phone.cat_liver': 'Liver',
      'phone.cat_metabolism': 'Metabolism',
      'phone.cat_kidneys': 'Kidneys',

      'long.eyebrow': 'bio-age',
      'long.h2': 'Slow down your biological clock',
      'long.lead': 'Find out how much younger or older your body is than your passport — and how to change it with a personal plan.',

      'vita.h2': 'Live longer. Live brighter.',
      'vita.lead': 'Not just to live longer — to live those years strong, sharp and full of energy.',

      'market.eyebrow': 'health marketplace',
      'market.h2': 'Supplements from your plan — at a member’s discount',
      'market.lead': 'Vetted supplements, diagnostics and medicines. −25% for ZERIVE members, delivery across Kazakhstan.',

      'reviews.eyebrow': 'reviews',
      'reviews.aria': 'ZERIVE member reviews',
      'reviews.h2': 'What our members say',
      'reviews.lead': 'Real stories from people who have already looked inside.',
      'city.almaty': 'Almaty', 'city.astana': 'Astana', 'city.shymkent': 'Shymkent',
      'city.karaganda': 'Karaganda', 'city.aktobe': 'Aktobe',
      'reviews.r1': '“For the first time I saw my health in numbers, not just feelings. My bio-age came out four years younger — a nice surprise.”',
      'reviews.r2': '“One blood draw and I got 100+ markers back. The concierge doctor explained everything in plain language.”',
      'reviews.r3': '“They caught a vitamin D and iron deficiency I had no idea about. Three months on, my energy is completely different.”',
      'reviews.r4': '“The health plan in the app actually works. My cholesterol came back to normal without any panic.”',
      'reviews.r5': '“Check-ups used to stress me out. Here it’s all clear: a score, a bio-age and exact next steps.”',
      'reviews.r6': '“Blood drawn at home, results on my phone within a week. This is the service Kazakhstan was missing.”',
      'reviews.r7': '“I track my metabolism and hormones every three months. I can finally see my habits moving the numbers.”',
      'reviews.r8': '“I thought I was healthy until I saw my inflammation markers. Fixed it in time — thank you, ZERIVE.”',

      'dl.eyebrow': 'app',
      'dl.h2': 'Download the ZERIVE app',
      'dl.sub': 'Your report, plan and AI doctor — always in your pocket.',
      'dl.appstore_small': 'Download on the',
      'dl.play_small': 'GET IT ON',

      'pricing.eyebrow': 'pricing',
      'pricing.title': 'Choose your level of care',
      'pricing.lead': 'Three subscriptions — from a basic check-up to maximum health control. No commitment, cancel anytime.',
      'pricing.price': 'Early pricing — for our first members',
      'pricing.btn_request': '[ Request access ]',
      'pricing.btn_early': '[ Early access ]',
      'pricing.t1.name': 'Basic', 'pricing.t1.tag': 'start',
      'pricing.t1.desc': 'An annual check-up and a clear picture of your health.',
      'pricing.t1.f1': '100+ biomarkers · once a year',
      'pricing.t1.f2': 'Bio-age and ZERIVE Score',
      'pricing.t1.f3': 'The app and your data history',
      'pricing.t2.name': 'Optimal', 'pricing.t2.tag': 'popular',
      'pricing.t2.desc': 'Full control: a plan, a doctor and retests.',
      'pricing.t2.f1': 'Everything in Basic',
      'pricing.t2.f2': 'A personal health plan',
      'pricing.t2.f3': 'AI doctor and care team 24/7',
      'pricing.t2.f4': '−25% on the marketplace',
      'pricing.t3.name': 'Maximum', 'pricing.t3.tag': 'premium',
      'pricing.t3.desc': 'Extended panels and priority care.',
      'pricing.t3.f1': 'Everything in Optimal',
      'pricing.t3.f2': 'Extended and specialty panels',
      'pricing.t3.f3': 'Retests every 3 months',
      'pricing.t3.f4': 'A personal manager',
      'pricing.strip': 'In every plan: blood draw in 40+ cities · pay with Kaspi / card · delivery across Kazakhstan',

      'cta.h2': 'Start with ZERIVE',
      'cta.lead': 'Leave your email — we’ll open early access to the first in Kazakhstan.',
      'cta.placeholder': 'your email',
      'cta.btn': '[ Sign up ]',
      'cta.fine': 'pay with Kaspi / card · results in 5–7 days · cancel anytime',
      'cta.consent': 'The button opens your mail app with a ready-made message — nothing is sent until you press Send yourself. We use your address only to invite you to early access and never pass it on. Questions:',
      'cta.mail_subject': 'ZERIVE early access',
      'cta.mail_body': 'Hi! I’d like to join ZERIVE early access.\nMy email: ',
      'cta.status_ok': 'Opening your mail app — the message to hello@zerive.kz is ready, just press Send.',
      'cta.status_bad': 'Check the email address — it looks like there’s a typo.',

      'foot.copy': '© 2026 ZERIVE · Almaty · Astana · Shymkent · and expanding',
      'foot.link1': 'Pricing', 'foot.link2': 'Labs', 'foot.link3': 'Early access'
    }
  };

  var STORE_KEY = 'zerive.lang';
  function getLang() {
    var s = null;
    try { s = localStorage.getItem(STORE_KEY); } catch (e) {}
    return (s && I18N[s]) ? s : 'ru';
  }
  function storeLang(l) { try { localStorage.setItem(STORE_KEY, l); } catch (e) {} }

  /* ── reusable per-letter 3D splitter (words kept for wrapping) ── */
  function splitInto(el, text) {
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var words = text.split(' ');
    var idx = 0;
    words.forEach(function (word, wi) {
      var w = document.createElement('span'); w.className = 'w';
      for (var i = 0; i < word.length; i++) {
        var ch = document.createElement('span'); ch.className = 'ch';
        ch.textContent = word.charAt(i);
        ch.setAttribute('aria-hidden', 'true');
        ch.style.transitionDelay = (idx * 0.03) + 's';
        idx++;
        w.appendChild(ch);
      }
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  var i18nEls = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var langBtns = [].slice.call(document.querySelectorAll('.langsw__opt'));
  var metaDesc = document.querySelector('meta[name="description"]');
  var curLang = 'ru';
  function t(key) {
    var dict = I18N[curLang] || I18N.ru;
    var v = dict[key];
    return v == null ? I18N.ru[key] : v;
  }

  /* ── apply a language across the whole page ── */
  function applyLang(lang, initial) {
    var dict = I18N[lang] || I18N.ru;
    curLang = I18N[lang] ? lang : 'ru';
    document.documentElement.setAttribute('lang', curLang);

    // document-level metadata is part of the translation too
    var title = dict['meta.title'] || I18N.ru['meta.title'];
    if (title) document.title = title;
    var desc = dict['meta.description'] || I18N.ru['meta.description'];
    if (metaDesc && desc) metaDesc.setAttribute('content', desc);

    i18nEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = dict[key];
      if (val == null) val = I18N.ru[key];
      if (val == null) return;

      if (el.hasAttribute('data-split')) {
        // per-letter headline: rebuild from source text each time
        if (!initial && el.classList.contains('in')) {
          // already revealed → replay the reveal in the new language
          el.classList.remove('in');
          splitInto(el, val);
          void el.offsetWidth; // force reflow so the transition restarts
          el.classList.add('in');
        } else {
          // not yet revealed (or first load) → build hidden, IO reveals on scroll
          splitInto(el, val);
        }
      } else {
        var attr = el.getAttribute('data-i18n-attr');
        if (attr) {
          el.setAttribute(attr, val);
          if (attr === 'placeholder') el.setAttribute('aria-label', val);
        } else {
          el.textContent = val;
        }
      }
    });

    langBtns.forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  langBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (!I18N[l]) return;
      storeLang(l);
      applyLang(l, false);
      // RU/KK/EN copy is different lengths → the light sections (and therefore docMax,
      // scene tops and rail metrics) change height. Re-measure, then repaint the scroll
      // state. Deliberately outside applyLang: on first paint the scroll engine below
      // has not been built yet.
      measure();
      update();
    });
  });

  // initial paint: set text + build the letter-splits (hidden), before observers
  applyLang(getLang(), true);

  /* ── reveal once on enter (letters + blocks) ── */
  var ring = document.getElementById('rfill');
  function fillRing() { if (ring) ring.style.strokeDashoffset = '26'; } // 92%
  if (RM) fillRing();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.querySelector && e.target.querySelector('#rfill')) fillRing();
        io.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('[data-reveal],[data-split]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal],[data-split]').forEach(function (el) { el.classList.add('in'); });
    fillRing();
  }

  /* ── count-up numbers ── */
  function countUp(el) {
    var target = parseFloat(el.dataset.count) || 0;
    var suffix = el.dataset.suffix || '';
    if (RM) { el.textContent = target + suffix; return; }
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var ioC = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target); ioC.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { ioC.observe(el); });
  } else {
    document.querySelectorAll('[data-count]').forEach(countUp);
  }

  /* ── scroll: cinematic camera dolly on backgrounds + depth parallax + rail ──
     Geometry (offset/height of every scene + rail target) is measured ONCE per
     resize and cached. The per-frame handler then derives progress from scrollY
     alone — no getBoundingClientRect() in the scroll path, so no forced reflow. */
  var scenes = [].slice.call(document.querySelectorAll('.scene')).map(function (s) {
    var bg = s.querySelector('.scene__bg');
    return {
      el: s,
      bg: bg,
      // .kb (Ken-Burns) and .blur bgs stay put — the CSS owns them; scrubbing a
      // blurred/animated layer every frame would force it to re-rasterise.
      bgStatic: !bg || bg.classList.contains('kb') || bg.classList.contains('blur'),
      depth: [].slice.call(s.querySelectorAll('[data-depth]')),
      top: 0, height: 0
    };
  });
  var progressBar = document.getElementById('progressBar');
  var nav = document.getElementById('nav');
  var railItems = [].slice.call(document.querySelectorAll('.rail__item'));
  var railTargets = railItems.map(function (it) { return document.getElementById(it.dataset.target); });
  var railMetrics = railTargets.map(function () { return null; });

  var vh = window.innerHeight;
  var docMax = 0;
  function measure() {
    vh = window.innerHeight;
    var sy = window.pageYOffset;
    docMax = document.documentElement.scrollHeight - vh;
    scenes.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      s.top = r.top + sy;
      s.height = r.height;
    });
    railTargets.forEach(function (t, i) {
      if (!t) { railMetrics[i] = null; return; }
      var r = t.getBoundingClientRect();
      railMetrics[i] = { top: r.top + sy, height: r.height };
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }
  function update() {
    var y = window.pageYOffset;

    if (progressBar) progressBar.style.transform = 'scaleX(' + (docMax > 0 ? y / docMax : 0) + ')';
    if (nav) nav.classList.toggle('scrolled', y > 40);

    if (!RM) {
      for (var i = 0; i < scenes.length; i++) {
        var s = scenes[i];
        var rel = y - s.top;                       // == -boundingRect.top
        if (rel < -vh - 120 || rel > s.height + 120) continue; // offscreen
        var travel = s.height - vh;
        var p = travel > 0 ? rel / travel : 0;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (s.bg && !s.bgStatic) {
          var scale = 1.05 + p * 0.17;
          var ty = (p - 0.5) * 34;
          s.bg.style.transform = 'scale(' + scale.toFixed(4) + ') translate3d(0,' + ty.toFixed(1) + 'px,0)';
        }
        for (var j = 0; j < s.depth.length; j++) {
          var d = s.depth[j];
          var k = parseFloat(d.dataset.depth) || 0;
          d.style.transform = 'translate3d(0,' + ((p - 0.5) * k * -60).toFixed(1) + 'px,0)';
        }
      }
    }

    // active chapter = target whose center is nearest viewport center
    var active = 0, best = Infinity, mid = y + vh / 2;
    for (var m = 0; m < railMetrics.length; m++) {
      var rm = railMetrics[m];
      if (!rm) continue;
      var dist = Math.abs(rm.top + rm.height / 2 - mid);
      if (dist < best) { best = dist; active = m; }
    }
    for (var n = 0; n < railItems.length; n++) {
      railItems[n].classList.toggle('is-active', n === active);
    }
  }

  // rail items are real links (href="#section") so keyboard/AT can use them; JS only
  // upgrades the jump to a smooth scroll and keeps the URL hash out of the history churn
  railItems.forEach(function (it, i) {
    it.addEventListener('click', function (e) {
      var target = railTargets[i];
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ── reviews ribbon: don't animate two full-width marquees while offscreen ── */
  var reviewsSection = document.getElementById('s-reviews');
  if (reviewsSection) {
    if ('IntersectionObserver' in window) {
      reviewsSection.classList.add('is-idle');
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          reviewsSection.classList.toggle('is-idle', !e.isIntersecting);
        });
      }, { rootMargin: '200px 0px' }).observe(reviewsSection);
    }
  }

  /* ── early-access form: no backend, so be honest about it ──
     Submitting composes a mail draft to hello@zerive.kz in the visitor's own client.
     Nothing leaves the browser until they press Send themselves. */
  var accessForm = document.getElementById('accessForm');
  var accessInput = document.getElementById('accessEmail');
  var accessStatus = document.getElementById('accessStatus');
  if (accessForm && accessInput) {
    accessForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (accessInput.value || '').trim();
      var ok = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!ok) {
        if (accessStatus) accessStatus.textContent = t('cta.status_bad');
        accessInput.focus();
        return;
      }
      if (accessStatus) accessStatus.textContent = t('cta.status_ok');
      window.location.href = 'mailto:hello@zerive.kz'
        + '?subject=' + encodeURIComponent(t('cta.mail_subject'))
        + '&body=' + encodeURIComponent(t('cta.mail_body') + email);
    });
    accessInput.addEventListener('input', function () {
      if (accessStatus) accessStatus.textContent = '';
    });
  }

  /* ── magnetic buttons (subtle pull toward cursor) ──
     rect is read once on enter (not every move); the transform write is coalesced
     into a single rAF so a fast pointer can't queue multiple style writes/frame. */
  if (!RM && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn, .mlink, .store').forEach(function (b) {
      var rect = null, raf = 0, tx = 0, ty = 0;
      b.addEventListener('pointerenter', function () { rect = b.getBoundingClientRect(); });
      b.addEventListener('pointermove', function (e) {
        if (!rect) rect = b.getBoundingClientRect();
        tx = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 6;
        ty = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 6 - 2;
        if (!raf) raf = requestAnimationFrame(function () {
          raf = 0;
          b.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
        });
      });
      b.addEventListener('pointerleave', function () {
        rect = null;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        b.style.transform = '';
      });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  window.addEventListener('orientationchange', function () { measure(); onScroll(); });
  // fonts/images can reflow the light content sections after first paint → re-measure
  window.addEventListener('load', function () { measure(); onScroll(); });

  measure();
  update();
})();
