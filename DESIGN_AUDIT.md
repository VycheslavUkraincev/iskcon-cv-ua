# DESIGN_AUDIT.md: аудит веб-дизайна и вёрстки (25.10.2026)

**Ветка:** `mockup-v2` @ `64f3499` («Грозовая туча» + исправления подвала и дублей). **Код сайта не менялся.**

**Источник фактов:** локальные копии `mockup-v2`, headless Chrome (Playwright 1.48), стили, вычисленные браузером, пиксели скриншотов, macOS Vision (лица), Lighthouse 12.

**Обозначения:** «Туча» — текущая основная палитра; «Бумага» — исходная палитра под ней.

**Доказательства:** `A/` — папка `audit-screenshots/design-2026-10-25/`; `S/` — папка `docs/handoff/scripts/design-audit/` (скрипты замеров).

## Как мерилось

| Что | Охват | Инструмент |
|---|---|---|
| Пары «текст/фон», контраст по WCAG 2.x | 5 страниц × 375/1440 × UK × 2 палитры: 517 уникальных пар (полный CSV `A/contrast-pairs.csv`, сводка в Приложении 1) | `S/da.js`: обход всех видимых текстовых узлов, фон = наложение `background-color` предков с учётом прозрачности |
| Текст на фото | hero всех страниц × 375/1440 × 2 палитры | `S/photoc.js`: текст прячется, считается контраст к каждому пикселю фона под ним (минимум и 5-й перцентиль) |
| Переполнения, горизонтальный скролл, обрезка, длинные слова, цели касания, типографика, ритм секций, картинки | 5 страниц × 6 ширин (320/375/390/768/1024/1440) × UK/EN/RO × 2 палитры = **180 конфигураций** | `S/da.js` + `S/daan.py` |
| Состояния hover / focus-visible / active | 202 типа интерактивных элементов, 1440, обе палитры | `S/states.js`, `S/active.js` |
| Шрифты | файлы и байты по сети, фактические начертания у каждого текстового элемента, покрытие глифов ҐЄІЇ ȘȚĂÎÂ | `S/fonts.js`, `S/fontwho.js` |
| Модалка WayForPay, печать, аватар, лица на фото | /donation, /food; 375/1440 | `S/modalprint.js`, `S/avpal.js`, `S/facecrop.js` + `S/faces.swift` |

**Как получена «Бумага».** Переключателя тем ещё нет. Поэтому «Бумага» — копия HEAD, из которой убраны:
- CSS-блок темы («Грозовая туча» до конца `style.css`; мои правила шапки 320 и `.form-lang` оставлены);
- классы `sec--cloud`;
- `theme-color #0F172A` (возвращён `#D9820B`);
- светлый логотип подвала.

Остальное идентично. Дубли `*.html` совпадают со своими папочными страницами байт в байт (проверено `cmp`), поэтому отдельно не замерялись.

**Чистые проверки (без находок):**
- 180 конфигураций: **нет** горизонтального скролла, вылезающих за экран элементов, обрезанного текста и слов шире своего блока. EN/RO на 320 px тоже без поломок.
- Весь текст на фото в hero проходит AA: минимум 5,17:1 у кнопки, у текста от 6,76:1.
- Глифы ҐЄІЇ ґєії ȘȚĂÎÂ șțăîâ ’«»—№₴ есть во всех 4 загружаемых начертаниях. В словаре RO только запятая снизу (ș ț), седилей (ş ţ) нет.
- `font-display: swap`; CLS 0 на всех страницах (Lighthouse на HEAD).
- Начертаний тоньше 400 на тёмных сценах нет.
- Индикатор фокуса есть у всех 202 типов элементов в обеих палитрах; контраст обводки к фону ≥ 3:1.
- Модалка WayForPay в обеих палитрах: `role=dialog`, `aria-modal`, фон под ней `inert`. Tab ходит только внутри модалки, Esc закрывает, фокус возвращается на кнопку.
- Арки `999px 999px 6px 6px` целы; лица в арках не срезаются (Vision).
- Аватар читается на обеих палитрах: облачко 5,6:1, гало на тёмном нет (`A/cloud-avatar-dark-1440.jpg`, `A/paper-avatar-light-1440.jpg`).

**Lighthouse mobile на HEAD** (1 прогон):

| Страница | Perf | A11y |
|---|---|---|
| Главная | 96 | 100 |
| /courses | 97 | 100 |
| /food | 95 | **96** |
| /donation | 98 | **96** |

На /food и /donation A11y снижают находки №1–7.

## Шкала тяжести
- **P0** — ломает чтение или действие.
- **P1** — заметно вредит.
- **P2** — полировка, которую видно.
- **P3** — вкус или мелочь.

Обоснование тяжести — в колонке «что сейчас».

---

## Находки

### Блок 1. Цвет

| № | Страница | Элемент / селектор | Что сейчас (значение) | Что должно быть (стандарт / токен) | Тяж. | Доказательство |
|---|---|---|---|---|---|---|
| 1 | /food, Туча | `.req code` (IBAN, ЄДРПОУ) в `#support.sec--cloud` | `#F1F5F9` на `#F4EBDA` = **1,08:1**. Фон задан литералом (`style.css:690`), цвет текста наследует `--ink`, который туча перекрашивает в светлый. Номер счёта практически невидим. Человек, который переписывает IBAN руками, не может этого сделать. Поэтому P0 | ≥ 4,5:1 (WCAG 1.4.3). На светлом островке — `--ink #2B2117` (15:1) | **P0** | `A/cloud-food-req-1440.jpg`, `A/contrast-pairs.csv` |
| 2 | /food, Туча | `.req .copy` «Копіювати» | `#E9A23B` на `#FFFFFF` = **2,17:1**; hover на `#F6E9D2` = **1,81:1** (`style.css:691–692`: фон `#fff` литералом, цвет — перекрашенный `--saffron-text`). Ещё и золото на светлом | ≥ 4,5:1; на светлом `--saffron-text #96570C` (5,2:1) | P1 | `A/cloud-food-req-1440.jpg`, `S/states.js` |
| 3 | /food, Туча | `.req__slogan` «Годуй · Молись · Люби» | `#E9A23B` на `#FFFBF2` = **2,10:1**, 20 px курсив (не «крупный текст») (`style.css:695`). Золото на светлом | ≥ 4,5:1; `--saffron-text` светлой палитры | P1 | `A/cloud-food-req-1440.jpg` |
| 4 | /donation, Туча | `.give__card h3` «Поточні потреби храму» | `#96570C` на `#1E293B` = **2,55:1** (27,2 px/600, порог 3:1). Причина: `.card h3{color:var(--saffron-dark)}` (`style.css:50`); туча перекрашивает `--saffron-text`, но не `--saffron-dark` | ≥ 3:1; на туче `--cloud-amber #E9A23B` (7,0:1) | P1 | `A/cloud-donation-give-1440.jpg` |
| 5 | /donation, Туча | `.ways__card h3` «На храм», «На „Їжу життя“» | `#96570C` на `#1E293B` = **2,55:1**, 24 px. Причина та же, что у №4 | как №4 | P1 | `A/cloud/donation-1440.jpg` |
| 6 | /food, Туча | `.widget h3` «Подаруй тарілку тепла й любові» | `#96570C` на `#1E293B` = **2,55:1**, 25,6 px. Причина та же, что у №4 | как №4 | P1 | `A/cloud/food-1440.jpg` |
| 7 | /donation, Туча | `.give__card .qr p` «Разова пожертва — наведіть камеру» | `#CBD5E1` на `#FFFFFF` = **1,48:1**: белая подложка QR задана литералом, `--muted` перекрашен в светлый | ≥ 4,5:1; на белой подложке `--muted #645441` (7,4:1) | P1 | `A/cloud-donation-give-1440.jpg` |
| 8 | Главная, обе | `.review__stars` ★★★★★ | Литерал `#B77A12` (`style.css:499`). Бумага: 3,53:1 на `#FFFCF5` (золотистое на светлом); туча: 4,04:1 на `#1E293B`. Для нетекстовых знаков (WCAG 1.4.11, 3:1) проходит; правило «золото только на тёмном» нарушено в Бумаге | шафран-токен по палитре (`--saffron-text` на светлом, `--gold` на туче) | P3 | `A/contrast-pairs.csv` |
| 9 | /courses, обе | `p.signup__phones > a` (063-311-7500 …) | Ссылка без подчёркивания, отличается от текста только цветом: 2,75:1 к окружающему тексту (< 3:1, WCAG 1.4.1) | подчёркивание или ≥ 3:1 к тексту | P2 | `S/links.js` |
| 10 | Сквозное | Токены в новом CSS (`style.css` от строки 370) | Около 90 цветов литералами: `#F4EBDA`×11, `#FFF`×11, `#F1F5F9`×6, `#E9A23B`×6, `#0F172A`×6, `#E8DCC4`×5, `#1E293B`×4 и др. Значения тучи продублированы литералами, хотя есть `--cloud-*`. **Это корень №1–7:** светлые «островки» (поле кода, кнопка копирования, слоган, подложка QR) стоят внутри тёмной секции с перекрашенными токенами | цвета только через токены; у светлого островка внутри тучи — сброс токенов на светлые (как уже сделано для `.give__card--circle`) | P2 | `grep` по `style.css`, `A/contrast-pairs.csv` |
| 11 | Все | `<meta name="theme-color">` | `#0F172A` на всех страницах, а шапка `#FFFCF5` светлая: строка браузера на телефоне тёмно-синяя над кремовой шапкой. В Бумаге было `#D9820B`, тоже не цвет шапки | цвет шапки `#FFFCF5` (или пара `media="(prefers-color-scheme…)"`, когда появится переключатель) | P2 | исходники страниц |
| 12 | /food, Туча — печать | `.req` при печати (Chrome, фоны не печатаются, как по умолчанию) | Реквизиты печатаются светлым текстом на белой бумаге, IBAN не читается. Человек, распечатавший реквизиты, получает пустой лист | тёмный текст на белом в `@media print` | P1 | `A/cloud-print-nobg-food-req.jpg`, `A/paper-print-nobg-food-req.jpg` |
| 13 | Все — печать | `@media print` | Правил печати нет вообще. На печать уходят шапка, кнопки языков, аватар, облачко, кнопки «Копіювати», тёмный подвал (светлым текстом). /donation печатается читаемо, но с аватаром | скрыть шапку, аватар, кнопки и видео; текст `#000` на белом; ссылки с URL | P2 | `A/cloud-print-nobg-donation-req.jpg` |
| 14 | Все | `::selection` | Глобально `#C9A24B` / `#0F172A` (≈7,4:1, проходит), но правило живёт в блоке темы и действует на светлых секциях тоже. В Бумаге выделение системное | выделение — часть палитры (будущий переключатель) | P3 | `style.css:985` |
| 15 | Все | `:visited`, скроллбар, `color-scheme` | `:visited` не оформлен (посещённые ссылки неотличимы, допустимо). `color-scheme` и `scrollbar-color` не заданы: у тёмных модалок и лайтбокса светлый системный скроллбар | `color-scheme` по палитре; `:visited` — осознанно не оформлять (записать) | P3 | `grep` |
| 16 | Все | `button.lang-btn` (неактивные) | Цвет текста `#000` (умолчание браузера), не `--ink` | `--ink` | P3 | `S/active.js` |
| 17 | /food, /donation | `.give .btn-ghost` («Разова пожертва», `<button>`), `#amountBtns button` | Нет отклика `:active` (у остальных кнопок `scale(.97)` и затемнение) | единое `:active` для всех кнопок | P3 | `S/active.js` |
| 18 | Главная, /courses, Туча | скрим `.hero-home::before`, `.shelf-plank`, `.bookshelf` | Скрим hero — коричневый `rgba(29,21,14,…)` поверх сцены `#0F172A`. Полка — коричневые градиенты `#8a5a2b→#4e2f16` на туче (`style.css:228, 239`; градиенты запрещены DESIGN.md, кроме скрима) | скрим в тоне сцены (`rgba(15,23,42,…)`), полка без градиента | P3 | `A/cloud-courses-shelf-375.jpg`, `A/cloud/home-1440.jpg` |

### Блок 2. Шрифты

| № | Страница | Элемент / селектор | Что сейчас (значение) | Что должно быть | Тяж. | Доказательство |
|---|---|---|---|---|---|---|
| 19 | Все | все `<button>`: `.lang-btn`, «Запросити друга» (`.next-sunday .btn-ghost`), «Регулярна пожертва» / «Разова пожертва» (`[data-donate]`), закрытия лайтбокса и чата | **Arial** 400/600: кнопки не наследуют шрифт. Ряд CTA на /donation выглядит другим шрифтом, чем ссылки-кнопки рядом | Onest (`font: inherit` у `button`) | P2 | `S/fontwho.js` |
| 20 | Главная, /donation | `p.visit__lead`, `span.next-sunday__k`, `p.use__more` | Запрошен Spectral **400 normal**, файла нет → браузер рисует 600 (тяжелее задуманного) | Spectral 600 или курсив 400 (загружены) | P2 | `S/fontwho.js` |
| 21 | /donation | `.use__more b`, `.donate-modal-head b` | Spectral **700**: файла нет → синтетический жирный | 600 | P2 | `S/fontwho.js` |
| 22 | Главная, /food | `em` в тексте («(ранкова служба)», «ахімса», «Кожна, навіть найменша допомога…») | Onest **italic** — файла нет → синтетический наклон | Spectral italic 400 (загружен) или без курсива | P3 | `S/fontwho.js` |
| 23 | Главная, /food | H3 с межстрочным **1,65** (наследуют основной текст): `.card h3` 20,8 px, `.step h3` 21,6, `.phil-col h3` 24, `.book h3` 20 (главная); `.funds h3` 25,6, `.report h3` 22,4, `.media-video h3` 24, `.card h3` 25,6, `.req__head h3` 20 (/food) | Многострочные заголовки разваливаются (на 375 особенно) | 1,15–1,25, как у H2 (1,15) и `.path h3` (1,25) | P2 | `S/h3lh.js` |
| 24 | Все | шкала заголовков | На главной H3 шести размеров (20–25,6 px). На /courses названия курсов — **H2 22,4 px**, мельче H3 других страниц (24–27,2). На /donation H3 27,2 ≈ H2 28 на мобильном (нет ступени). H1 главной 51,2 против 54,4 на внутренних (1440); /food H1 33,6 против 32 (375) | одна шкала: H1 / H2 / H3, по 1–2 размера на уровень | P2 | `S/heads.js` |
| 25 | /donation, EN/RO | `p.ways__lead` | 84 знака в строке (EN, 1440; мера 720 px) | 45–75 | P3 | `S/heads.js` |
| 26 | /food, главная | `#amountBtns button` (100 ₴…), `.fact__v` 14:00, `.counter__rate`, `.next-sunday__date` | `font-variant-numeric: normal`. У `.widget__count`, `#donateAmt`, `.counter__num` — `tabular-nums` | `tabular-nums` у всех отдельно стоящих сумм и времени (в сплошном тексте не нужно) | P3 | `S/daan.py` (раздел NUMBERS) |
| 27 | Главная, RO/EN, 320 | `h2.sec__title`-вопросы FAQ-блоков | 4–5 строк при 28 px («Este doar pentru credincioși — sau pot veni și eu…»). Разрывов слов нет | ступень 24–26 px на ≤360 | P3 | `S/daan.py` (HEADING LINES) |
| 28 | /food, /donation | `.req code` | Системный моноширинный `ui-monospace, Menlo, Consolas`: вид IBAN разный на разных ОС | допустимо; или Onest + `tabular-nums` + `letter-spacing` | P3 | `S/fontwho.js` |
| 29 | Все | загрузка | UK-страница грузит 6 файлов (≈ 101 КБ), RO — 9 (+ latin-ext ≈ 55 КБ). Предзагружены только кириллические Onest и Spectral 600, а латинский Onest (33,8 КБ, цифры и пунктуация) грузится всегда без preload | preload и латинского Onest; иначе без изменений (CLS 0) | P3 | `S/fonts.js` |

### Блок 3. Вёрстка и композиция

| № | Страница | Элемент / селектор | Что сейчас (значение) | Что должно быть | Тяж. | Доказательство |
|---|---|---|---|---|---|---|
| 30 | /donation, Туча | `#ways.sec--cloud` | `padding-bottom: 0` (`.sec--ways`), сразу ниже светлая `.sec--use`: карточки упираются в нижний край тёмной сцены и обрезаются ею. В Бумаге незаметно (обе секции светлые) | нижний отступ сцены = `--sec-gap` (64/128) | P1 | `A/cloud-donation-ways-bottom-1440.jpg` |
| 31 | /donation, Туча | `.page-hero` + `#ways` | Две тёмные секции подряд (□ ■ ■ □ ■ □ ■ □ ■): hero сливается со следующей сценой, нет границы «вступление → выбор» | граница: светлая секция между ними или разделитель | P2 | `A/cloud/donation-1440.jpg` |
| 32 | /courses, Туча | `.bookshelf` → `.sec--more` → `.scene-band` → подвал | Светлая полоса `.sec--more` 111–116 px зажата между двумя тёмными; `.scene-band` и подвал — тёмное к тёмному (□ ■ □ ■ □ ■ ■) | `.sec--more` внутрь полки или в светлую секцию над ней; между лентой и подвалом — граница | P2 | `A/cloud-courses-more-strip-375.jpg` |
| 33 | /food, Туча | `#support .support__grid` | Лоскутное одеяло: виджет тёмный; карточка реквизитов — тёмная шапка, светлые поля кода, белые кнопки, светлый низ со слоганом (и №1–3) | карточка целиком одной палитры: тёмная с тёмными полями или светлая с токенами светлой палитры | P2 | `A/cloud-food-req-1440.jpg` |
| 34 | /donation, Туча | `.give` («Зробити пожертву») | Пара карточек асимметрична: левая «Коло друзів» светлая (`.give__card--circle` со сброшенными токенами), правая тёмная с белой подложкой QR | обе в одной логике (выделение регулярной — рамкой или подписью, не другой палитрой) | P2 | `A/cloud-donation-give-1440.jpg` |
| 35 | Все, ≤860 | `button.nav-toggle` | 40×40 | 44×44 | P2 | `S/daan.py` (TAP) |
| 36 | Все, 768–1440 | `footer nav a` (24 px высотой); `.lang-btn` на ≥1024 (36×25) | Мелкие цели на планшетах (768, iPad 1024 альбомный — сенсор) | ≥ 44 px высотой | P2 | `S/daan.py` |
| 37 | Главная, /courses | `.next-sunday__ics` 35 px; `.path a` / `a.more` («Детальніше →») 32 px; `.book-meta a` «Читати →» **18 px** | Ниже 44; «Читати →» ниже даже WCAG 2.5.8 (24 px) | ≥ 44 px (или ≥ 24 + отступы) | P2 | `S/daan.py` |
| 38 | /food | `.ffl-carousel img` (лента волонтёров) | Отдаётся только `-360.webp`, плотность 0,9–1,4 на ретине (1440@2: кадр 402 px из файла 360). Варианты `-563.webp` лежат в репозитории без ссылок (см. `UNUSED_FILES.md`) | `srcset` 360w + 563w | P2 | `S/imgres.js` |
| 39 | /food | `.video-facade img` (`shpalta-poster.webp`, 480×360) | Растянут до 820 px: плотность **0,59 даже на обычном экране**, постер видео размыт | постер ≥ 1640 px (кадр с YouTube `maxresdefault`) + `srcset` | P2 | `S/imgres.js`, `A/cloud/food-1440.jpg` |
| 40 | /food, 768 | `.food-hero` фото (`food-hero-564.webp`) | На 768 кадр 732 px из файла 564: плотность 0,77 | вариант ~1100–1460 px в `srcset` | P2 | `S/imgres.js` |
| 41 | Главная | `.gallery img` (`photo-18`) | На 375@2 выбран 480w при кадре 339 px (плотность 1,42), хотя есть 800w: `sizes` не соответствует сетке | исправить `sizes` | P3 | `S/imgres.js` |
| 42 | Главная | `.gallery img` (`photo-10`, вертикальный кадр) | Обрезка 3:2 по центру: голова человека на заднем плане видна на 2–4% (главная фигура целиком) | `object-position` ≈ `50% 25%` у вертикальных кадров | P3 | `A/cloud-home-gallery-photo10-1440.jpg`, `A/faces.tsv` |
| 43 | Все | доля тёмного (Туча, по высоте страницы) | Главная ≈ 42%, /courses ≈ 43%, /food ≈ 45%, /donation ≈ **61%**, 404 — почти вся. В Бумаге тёмные только hero и 1–2 сцены | решение владельца/Прабху; на /donation чтение (реквизиты, «на що»), похоже, уступает сценам | P3 | `S/daan.py` (RHYTHM) |
| 44 | Все | вертикальный ритм | Общий ритм `--sec-gap` 64/128 соблюдён. Выбиваются: `.sec--more` 28/44, `.scene-band` 40/72, `.page-hero` 56/112 сверху и 48/96 снизу, подвал 32/48 сверху и 34 снизу (асимметрия) | свести к шагам 64/128 и 40/72 | P3 | `S/daan.py` (RHYTHM) |
| 45 | Все | `filter: drop-shadow` на `video.avatar-video` | Фильтр на играющем видео перерисовывается каждый кадр; на тёмном фоне тень `rgba(15,23,42,.35)` невидима | тень на обёртке, не на `<video>`, или только на светлом | P3 | `S/avpal.js` |

---

## Сводка

| Тяжесть | Сколько | Номера |
|---|---|---|
| **P0** | 1 | 1 |
| **P1** | 8 | 2, 3, 4, 5, 6, 7, 12, 30 |
| **P2** | 19 | 9, 10, 11, 13, 19, 20, 21, 23, 24, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 |
| **P3** | 17 | 8, 14, 15, 16, 17, 18, 22, 25, 26, 27, 28, 29, 41, 42, 43, 44, 45 |
| **Всего** | **45** | |

У №1–7 общий корень — №10 (светлые островки с литеральным фоном внутри тёмной секции, где токены перекрашены) и `--saffron-dark`, который тема не перекрашивает.

Все провалы контраста ниже AA — только в Туче, кроме №8 и №9. Бумага: 1 провал AA (звёзды, P3) и №9.

## Оговорки
- **RESEARCH №11 (палитра грозы) не найден** ни в архиве проекта (`~/.openclaw/iskcon-cv-ua/project-archive/05-research` — файлы 01–10), ни в `Downloads`. Палитра Тучи восстановлена по коду коммитов `a2fba7c`, `653f9d5`, `64f3499`. Если в №11 есть роли цветов, которых нет в коде, часть рекомендаций может их не учитывать.
- **«Бумага» — реконструкция**: HEAD без CSS темы, а не отдельная ветка. Поведение будущего переключателя может отличаться.
- **Hover и focus мерил на 1440**, `:active` — на 9 типах кнопок. `:visited` из JS не измерить (защита приватности браузера), поэтому вывод сделан по CSS.
- **Печать** — эмуляция Chrome (`emulateMedia print`, фоны выключены, как в диалоге по умолчанию), не реальный принтер и не Safari.
- **Лица** — macOS Vision, лица меньше 0,4% кадра игнорировались. Vision может пропустить профиль.
- **Артефакты полностраничных скриншотов** (не дефекты сайта): пустое место карты Google (ленивый iframe) и не отрисованные 3D-обложки полки на 375. Отдельный снимок полки `A/cloud-courses-shelf-375.jpg` показывает, что всё на месте.
- **Не проверено:** реальные iPhone/Android, Safari, режим высокой контрастности Windows, увеличение текста 200%.

---

## Приложение 1. Все пары «текст/фон» (UK, 375 и 1440, сгруппировано: палитра · страница · секция · цвет текста · фон; «Мин. контраст» — худший элемент группы)

Полный список по элементам, с размером шрифта, жирностью, ширинами и примером текста — `A/contrast-pairs.csv` (517 строк).

| Палитра | Страница | Секция | Текст | Фон | Мин. контраст | Вердикт | Элементов |
|---|---|---|---|---|---|---|---|
| cloud | `/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| cloud | `/` | `footer#contacts.site-footer` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `/` | `footer#contacts.site-footer` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 3 |
| cloud | `/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| cloud | `/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| cloud | `/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| cloud | `/` | `section#faq.sec.sec--faq` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| cloud | `/` | `section#faq.sec.sec--faq` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| cloud | `/` | `section#main.sec.sec--welcome` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| cloud | `/` | `section#map.sec.sec--map` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| cloud | `/` | `section#map.sec.sec--map` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `/` | `section#paths.sec.sec--paths` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| cloud | `/` | `section#paths.sec.sec--paths` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| cloud | `/` | `section#paths.sec.sec--paths` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `/` | `section#reviews.sec.sec--cloud.sec--revi` | `#0F172A` | `#F1F5F9` | 16.30 | AAA | 1 |
| cloud | `/` | `section#reviews.sec.sec--cloud.sec--revi` | `#B77A12` | `#1E293B` | 4.04 | **FAIL** | 1 |
| cloud | `/` | `section#reviews.sec.sec--cloud.sec--revi` | `#E9A23B` | `#0F172A` | 8.24 | AAA | 1 |
| cloud | `/` | `section#reviews.sec.sec--cloud.sec--revi` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 1 |
| cloud | `/` | `section#reviews.sec.sec--cloud.sec--revi` | `#F1F5F9` | `#1E293B` | 13.35 | AAA | 2 |
| cloud | `/` | `section#schedule.sec.sec--cloud.sec--sch` | `#CBD5E1` | `#0F172A` | 12.02 | AAA | 2 |
| cloud | `/` | `section#schedule.sec.sec--cloud.sec--sch` | `#CBD5E1` | `#1E293B` | 9.85 | AAA | 1 |
| cloud | `/` | `section#schedule.sec.sec--cloud.sec--sch` | `#E9A23B` | `#0F172A` | 8.24 | AAA | 1 |
| cloud | `/` | `section#schedule.sec.sec--cloud.sec--sch` | `#E9A23B` | `#1E293B` | 6.75 | AA | 5 |
| cloud | `/` | `section#schedule.sec.sec--cloud.sec--sch` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 5 |
| cloud | `/` | `section#schedule.sec.sec--cloud.sec--sch` | `#F1F5F9` | `#1E293B` | 13.35 | AAA | 3 |
| cloud | `/` | `section#visit.sec.sec--visit` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 2 |
| cloud | `/` | `section#visit.sec.sec--visit` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| cloud | `/` | `section#visit.sec.sec--visit` | `#96570C` | `#F4EBDA` | 4.84 | AA | 1 |
| cloud | `/` | `section.hero-home` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `/` | `section.hero-home` | `#FBF6ED` | `#0F172A` | 16.58 | AAA | 3 |
| cloud | `/` | `section.hero-home` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `/` | `section.sec.sec--cloud.sec--gallery` | `#CBD5E1` | `#0F172A` | 12.02 | AAA | 2 |
| cloud | `/` | `section.sec.sec--cloud.sec--gallery` | `#E9A23B` | `#0F172A` | 8.24 | AAA | 1 |
| cloud | `/` | `section.sec.sec--cloud.sec--gallery` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 1 |
| cloud | `/` | `section.sec.sec--dark.sec--philosophy` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 3 |
| cloud | `/` | `section.sec.sec--dark.sec--philosophy` | `#FBF6ED` | `#0F172A` | 16.58 | AAA | 3 |
| cloud | `/` | `section.sec.sec--founder` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 3 |
| cloud | `/` | `section.sec.sec--founder` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| cloud | `/` | `section.sec.sec--founder` | `#645441` | `#FBF6ED` | 6.76 | AA | 5 |
| cloud | `/` | `section.sec.sec--founder` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| cloud | `/` | `section.sec.sec--steps` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 1 |
| cloud | `/` | `section.sec.sec--steps` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| cloud | `/` | `section.sec.sec--steps` | `#645441` | `#F4EBDA` | 6.15 | AA | 1 |
| cloud | `/` | `section.sec.sec--who` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 4 |
| cloud | `404.html` | `footer.site-footer` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `404.html` | `footer.site-footer` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 3 |
| cloud | `404.html` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| cloud | `404.html` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `404.html` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| cloud | `404.html` | `section.page-hero.not-found` | `#EADFC8` | `#0F172A` | 13.51 | AAA | 1 |
| cloud | `404.html` | `section.page-hero.not-found` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 1 |
| cloud | `404.html` | `section.page-hero.not-found` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `courses/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| cloud | `courses/` | `footer#contacts.site-footer` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `courses/` | `footer#contacts.site-footer` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 3 |
| cloud | `courses/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| cloud | `courses/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| cloud | `courses/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `courses/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| cloud | `courses/` | `section#main.sec.sec--courses` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 4 |
| cloud | `courses/` | `section#main.sec.sec--courses` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| cloud | `courses/` | `section#main.sec.sec--courses` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `courses/` | `section#main.sec.sec--courses` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 2 |
| cloud | `courses/` | `section.bookshelf.sec--dark` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `courses/` | `section.bookshelf.sec--dark` | `#D9C9A8` | `#0F172A` | 10.94 | AAA | 1 |
| cloud | `courses/` | `section.bookshelf.sec--dark` | `#E3D5B8` | `#0F172A` | 12.31 | AAA | 1 |
| cloud | `courses/` | `section.bookshelf.sec--dark` | `#FBF6ED` | `#0F172A` | 16.58 | AAA | 2 |
| cloud | `courses/` | `section.page-hero` | `#EADFC8` | `#0F172A` | 13.51 | AAA | 1 |
| cloud | `courses/` | `section.page-hero` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 1 |
| cloud | `courses/` | `section.scene-band` | `#FBF6ED` | `#0F172A` | 16.58 | AAA | 1 |
| cloud | `courses/` | `section.sec.sec--more` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| cloud | `courses/` | `section.sec.sec--more` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| cloud | `donation/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| cloud | `donation/` | `footer.site-footer` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `donation/` | `footer.site-footer` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 3 |
| cloud | `donation/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| cloud | `donation/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| cloud | `donation/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `donation/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| cloud | `donation/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| cloud | `donation/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 1 |
| cloud | `donation/` | `section#contacts.sec.sec--contacts-food` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| cloud | `donation/` | `section#contacts.sec.sec--contacts-food` | `#96570C` | `#FFFCF5` | 5.59 | AAA | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#2B2117` | `#FFFDF8` | 15.50 | AAA | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#645441` | `#FFFFFF` | 7.28 | AAA | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#96570C` | `#1E293B` | 2.55 | **FAIL** | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#96570C` | `#FFFDF8` | 5.64 | AAA | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#CBD5E1` | `#0F172A` | 12.02 | AAA | 2 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#CBD5E1` | `#FFFFFF` | 1.48 | **FAIL** | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#E9A23B` | `#1E293B` | 6.75 | AA | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 2 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#F1F5F9` | `#1E293B` | 13.35 | AAA | 1 |
| cloud | `donation/` | `section#give.sec.sec--cloud.sec--give` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `donation/` | `section#ways.sec.sec--cloud.sec--ways` | `#96570C` | `#1E293B` | 2.55 | **FAIL** | 1 |
| cloud | `donation/` | `section#ways.sec.sec--cloud.sec--ways` | `#E9A23B` | `#1E293B` | 6.75 | AA | 2 |
| cloud | `donation/` | `section#ways.sec.sec--cloud.sec--ways` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 2 |
| cloud | `donation/` | `section#ways.sec.sec--cloud.sec--ways` | `#F1F5F9` | `#1E293B` | 13.35 | AAA | 1 |
| cloud | `donation/` | `section#ways.sec.sec--cloud.sec--ways` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `donation/` | `section.page-hero` | `#EADFC8` | `#0F172A` | 13.51 | AAA | 1 |
| cloud | `donation/` | `section.page-hero` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 1 |
| cloud | `donation/` | `section.scene-band` | `#FBF6ED` | `#0F172A` | 16.58 | AAA | 1 |
| cloud | `donation/` | `section.sec.sec--req` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 4 |
| cloud | `donation/` | `section.sec.sec--req` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| cloud | `donation/` | `section.sec.sec--req` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| cloud | `donation/` | `section.sec.sec--req` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| cloud | `donation/` | `section.sec.sec--req` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| cloud | `donation/` | `section.sec.sec--req` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| cloud | `donation/` | `section.sec.sec--use` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 3 |
| cloud | `donation/` | `section.sec.sec--use` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 1 |
| cloud | `donation/` | `section.sec.sec--use` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| cloud | `food/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| cloud | `food/` | `footer.site-footer` | `#C9A24B` | `#0F172A` | 7.44 | AAA | 1 |
| cloud | `food/` | `footer.site-footer` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 3 |
| cloud | `food/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| cloud | `food/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| cloud | `food/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| cloud | `food/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| cloud | `food/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| cloud | `food/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| cloud | `food/` | `section#contacts.sec.sec--contacts-food` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| cloud | `food/` | `section#contacts.sec.sec--contacts-food` | `#96570C` | `#FFFCF5` | 5.59 | AAA | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#0F172A` | `#E9A23B` | 8.24 | AAA | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#0F172A` | `#F1F5F9` | 16.30 | AAA | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#96570C` | `#1E293B` | 2.55 | **FAIL** | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#CBD5E1` | `#0F172A` | 12.02 | AAA | 2 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#CBD5E1` | `#1E293B` | 9.85 | AAA | 5 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#E3D5B8` | `#0F172A` | 12.31 | AAA | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#E9A23B` | `#1E293B` | 6.75 | AA | 3 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#E9A23B` | `#FFFBF2` | 2.10 | **FAIL** | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#E9A23B` | `#FFFFFF` | 2.17 | **FAIL** | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 2 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#F1F5F9` | `#1E293B` | 13.35 | AAA | 2 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#F1F5F9` | `#F4EBDA` | 1.08 | **FAIL** | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#FBF6ED` | `#0F172A` | 16.58 | AAA | 1 |
| cloud | `food/` | `section#support.sec.sec--cloud.sec--supp` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 3 |
| cloud | `food/` | `section#volunteer.sec.sec--cloud.sec--he` | `#CBD5E1` | `#0F172A` | 12.02 | AAA | 2 |
| cloud | `food/` | `section#volunteer.sec.sec--cloud.sec--he` | `#E9A23B` | `#0F172A` | 8.24 | AAA | 1 |
| cloud | `food/` | `section#volunteer.sec.sec--cloud.sec--he` | `#E9A23B` | `#1E293B` | 6.75 | AA | 2 |
| cloud | `food/` | `section#volunteer.sec.sec--cloud.sec--he` | `#F1F5F9` | `#0F172A` | 16.30 | AAA | 3 |
| cloud | `food/` | `section#volunteer.sec.sec--cloud.sec--he` | `#F1F5F9` | `#1E293B` | 13.35 | AAA | 4 |
| cloud | `food/` | `section#volunteer.sec.sec--cloud.sec--he` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 1 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 4 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#645441` | `#F4EBDA` | 6.15 | AA | 1 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#645441` | `#FFFCF5` | 7.10 | AAA | 5 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#96570C` | `#F4EBDA` | 4.84 | AAA | 1 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#96570C` | `#FFFCF5` | 5.59 | AAA | 1 |
| cloud | `food/` | `section#when-where.sec.sec--facts` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| cloud | `food/` | `section.food-hero` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| cloud | `food/` | `section.food-hero` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| cloud | `food/` | `section.food-hero` | `#96570C` | `#FBF6ED` | 5.32 | AA | 2 |
| cloud | `food/` | `section.food-hero` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 2 |
| cloud | `food/` | `section.sec.sec--proof` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| cloud | `food/` | `section.sec.sec--proof` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| cloud | `food/` | `section.sec.sec--proof` | `#645441` | `#FBF6ED` | 6.76 | AA | 2 |
| cloud | `food/` | `section.sec.sec--proof` | `#96570C` | `#FFFCF5` | 5.59 | AA | 1 |
| paper | `/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| paper | `/` | `footer#contacts.site-footer` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `/` | `footer#contacts.site-footer` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `/` | `footer#contacts.site-footer` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| paper | `/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| paper | `/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| paper | `/` | `section#faq.sec.sec--faq` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| paper | `/` | `section#faq.sec.sec--faq` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| paper | `/` | `section#main.sec.sec--welcome` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `/` | `section#map.sec.sec--map` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `/` | `section#map.sec.sec--map` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `/` | `section#paths.sec.sec--paths` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| paper | `/` | `section#paths.sec.sec--paths` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| paper | `/` | `section#paths.sec.sec--paths` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `/` | `section#reviews.sec.sec--reviews` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 1 |
| paper | `/` | `section#reviews.sec.sec--reviews` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| paper | `/` | `section#reviews.sec.sec--reviews` | `#96570C` | `#F4EBDA` | 4.84 | AA | 1 |
| paper | `/` | `section#reviews.sec.sec--reviews` | `#B77A12` | `#FFFCF5` | 3.53 | **FAIL** | 1 |
| paper | `/` | `section#reviews.sec.sec--reviews` | `#FBF6ED` | `#2B2117` | 14.64 | AAA | 1 |
| paper | `/` | `section#schedule.sec.sec--schedule` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 5 |
| paper | `/` | `section#schedule.sec.sec--schedule` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| paper | `/` | `section#schedule.sec.sec--schedule` | `#645441` | `#FBF6ED` | 6.76 | AA | 2 |
| paper | `/` | `section#schedule.sec.sec--schedule` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| paper | `/` | `section#schedule.sec.sec--schedule` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `/` | `section#schedule.sec.sec--schedule` | `#96570C` | `#FFFCF5` | 5.59 | AA | 5 |
| paper | `/` | `section#visit.sec.sec--visit` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 2 |
| paper | `/` | `section#visit.sec.sec--visit` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 3 |
| paper | `/` | `section#visit.sec.sec--visit` | `#96570C` | `#F4EBDA` | 4.84 | AA | 1 |
| paper | `/` | `section.hero-home` | `#C9A24B` | `#1D150E` | 7.51 | AAA | 1 |
| paper | `/` | `section.hero-home` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 3 |
| paper | `/` | `section.hero-home` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `/` | `section.sec.sec--dark.sec--philosophy` | `#C9A24B` | `#1D150E` | 7.51 | AAA | 3 |
| paper | `/` | `section.sec.sec--dark.sec--philosophy` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 3 |
| paper | `/` | `section.sec.sec--founder` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 3 |
| paper | `/` | `section.sec.sec--founder` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| paper | `/` | `section.sec.sec--founder` | `#645441` | `#FBF6ED` | 6.76 | AA | 5 |
| paper | `/` | `section.sec.sec--founder` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `/` | `section.sec.sec--gallery` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| paper | `/` | `section.sec.sec--gallery` | `#645441` | `#FBF6ED` | 6.76 | AA | 2 |
| paper | `/` | `section.sec.sec--gallery` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `/` | `section.sec.sec--steps` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 1 |
| paper | `/` | `section.sec.sec--steps` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| paper | `/` | `section.sec.sec--steps` | `#645441` | `#F4EBDA` | 6.15 | AA | 1 |
| paper | `/` | `section.sec.sec--who` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 4 |
| paper | `404.html` | `footer.site-footer` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `404.html` | `footer.site-footer` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `404.html` | `footer.site-footer` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `404.html` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| paper | `404.html` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `404.html` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| paper | `404.html` | `section.page-hero.not-found` | `#EADFC8` | `#1D150E` | 13.63 | AAA | 1 |
| paper | `404.html` | `section.page-hero.not-found` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 1 |
| paper | `404.html` | `section.page-hero.not-found` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `courses/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| paper | `courses/` | `footer#contacts.site-footer` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `courses/` | `footer#contacts.site-footer` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `courses/` | `footer#contacts.site-footer` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `courses/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| paper | `courses/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| paper | `courses/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `courses/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| paper | `courses/` | `section#main.sec.sec--courses` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 4 |
| paper | `courses/` | `section#main.sec.sec--courses` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| paper | `courses/` | `section#main.sec.sec--courses` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `courses/` | `section#main.sec.sec--courses` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 2 |
| paper | `courses/` | `section.bookshelf.sec--dark` | `#C9A24B` | `#1D150E` | 7.51 | AAA | 1 |
| paper | `courses/` | `section.bookshelf.sec--dark` | `#D9C9A8` | `#1D150E` | 11.04 | AAA | 1 |
| paper | `courses/` | `section.bookshelf.sec--dark` | `#E3D5B8` | `#1D150E` | 12.42 | AAA | 1 |
| paper | `courses/` | `section.bookshelf.sec--dark` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 2 |
| paper | `courses/` | `section.page-hero` | `#EADFC8` | `#1D150E` | 13.63 | AAA | 1 |
| paper | `courses/` | `section.page-hero` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 1 |
| paper | `courses/` | `section.scene-band` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 1 |
| paper | `courses/` | `section.sec.sec--more` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `courses/` | `section.sec.sec--more` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `donation/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| paper | `donation/` | `footer.site-footer` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `donation/` | `footer.site-footer` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `donation/` | `footer.site-footer` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `donation/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| paper | `donation/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| paper | `donation/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `donation/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| paper | `donation/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| paper | `donation/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 1 |
| paper | `donation/` | `section#contacts.sec.sec--contacts-food` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| paper | `donation/` | `section#contacts.sec.sec--contacts-food` | `#96570C` | `#FFFCF5` | 5.59 | AAA | 1 |
| paper | `donation/` | `section#give.sec.sec--give` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 2 |
| paper | `donation/` | `section#give.sec.sec--give` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 1 |
| paper | `donation/` | `section#give.sec.sec--give` | `#2B2117` | `#FFFDF8` | 15.50 | AAA | 1 |
| paper | `donation/` | `section#give.sec.sec--give` | `#645441` | `#F4EBDA` | 6.15 | AA | 2 |
| paper | `donation/` | `section#give.sec.sec--give` | `#645441` | `#FFFFFF` | 7.28 | AAA | 1 |
| paper | `donation/` | `section#give.sec.sec--give` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `donation/` | `section#give.sec.sec--give` | `#96570C` | `#FFFDF8` | 5.64 | AAA | 1 |
| paper | `donation/` | `section#give.sec.sec--give` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `donation/` | `section#ways.sec.sec--ways` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `donation/` | `section#ways.sec.sec--ways` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 1 |
| paper | `donation/` | `section#ways.sec.sec--ways` | `#96570C` | `#FFFCF5` | 5.59 | AA | 3 |
| paper | `donation/` | `section#ways.sec.sec--ways` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `donation/` | `section.page-hero` | `#EADFC8` | `#1D150E` | 13.63 | AAA | 1 |
| paper | `donation/` | `section.page-hero` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 1 |
| paper | `donation/` | `section.scene-band` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 1 |
| paper | `donation/` | `section.sec.sec--req` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 4 |
| paper | `donation/` | `section.sec.sec--req` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| paper | `donation/` | `section.sec.sec--req` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `donation/` | `section.sec.sec--req` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| paper | `donation/` | `section.sec.sec--req` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `donation/` | `section.sec.sec--req` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| paper | `donation/` | `section.sec.sec--use` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 3 |
| paper | `donation/` | `section.sec.sec--use` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 1 |
| paper | `donation/` | `section.sec.sec--use` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| paper | `food/` | `body` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| paper | `food/` | `footer.site-footer` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `food/` | `footer.site-footer` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `food/` | `footer.site-footer` | `#96570C` | `#FBF6ED` | 5.32 | AA | 1 |
| paper | `food/` | `header.site-header` | `#000000` | `#FFFCF5` | 20.49 | AAA | 1 |
| paper | `food/` | `header.site-header` | `#96570C` | `#FBF0DC` | 5.07 | AA | 1 |
| paper | `food/` | `header.site-header` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `food/` | `header.site-header` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| paper | `food/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 1 |
| paper | `food/` | `section#contacts.sec.sec--contacts-food` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| paper | `food/` | `section#contacts.sec.sec--contacts-food` | `#645441` | `#FFFCF5` | 7.10 | AAA | 1 |
| paper | `food/` | `section#contacts.sec.sec--contacts-food` | `#96570C` | `#FFFCF5` | 5.59 | AAA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 3 |
| paper | `food/` | `section#support.sec.sec--support` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| paper | `food/` | `section#support.sec.sec--support` | `#2B2117` | `#FFFFFF` | 15.76 | AAA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#645441` | `#F4EBDA` | 6.15 | AA | 4 |
| paper | `food/` | `section#support.sec.sec--support` | `#645441` | `#FFFCF5` | 7.10 | AAA | 3 |
| paper | `food/` | `section#support.sec.sec--support` | `#96570C` | `#F4EBDA` | 4.84 | AA | 2 |
| paper | `food/` | `section#support.sec.sec--support` | `#96570C` | `#FFFBF2` | 5.55 | AA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `food/` | `section#support.sec.sec--support` | `#96570C` | `#FFFFFF` | 5.73 | AA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#E3D5B8` | `#1D150E` | 12.42 | AAA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#FBF6ED` | `#1D150E` | 16.73 | AAA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#FFFFFF` | `#96570C` | 5.73 | AA | 1 |
| paper | `food/` | `section#support.sec.sec--support` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 3 |
| paper | `food/` | `section#volunteer.sec.sec--help` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 3 |
| paper | `food/` | `section#volunteer.sec.sec--help` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 4 |
| paper | `food/` | `section#volunteer.sec.sec--help` | `#645441` | `#F4EBDA` | 6.15 | AA | 2 |
| paper | `food/` | `section#volunteer.sec.sec--help` | `#96570C` | `#F4EBDA` | 4.84 | AA | 1 |
| paper | `food/` | `section#volunteer.sec.sec--help` | `#96570C` | `#FFFCF5` | 5.59 | AA | 2 |
| paper | `food/` | `section#volunteer.sec.sec--help` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#2B2117` | `#F4EBDA` | 13.31 | AAA | 1 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 4 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#645441` | `#F4EBDA` | 6.15 | AA | 1 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#645441` | `#FFFCF5` | 7.10 | AAA | 5 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#96570C` | `#F4EBDA` | 4.84 | AAA | 1 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#96570C` | `#FFFCF5` | 5.59 | AAA | 1 |
| paper | `food/` | `section#when-where.sec.sec--facts` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 1 |
| paper | `food/` | `section.food-hero` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `food/` | `section.food-hero` | `#645441` | `#FBF6ED` | 6.76 | AA | 1 |
| paper | `food/` | `section.food-hero` | `#96570C` | `#FBF6ED` | 5.32 | AA | 2 |
| paper | `food/` | `section.food-hero` | `#FFFFFF` | `#B0512F` | 5.17 | AA | 2 |
| paper | `food/` | `section.sec.sec--proof` | `#2B2117` | `#FBF6ED` | 14.64 | AAA | 2 |
| paper | `food/` | `section.sec.sec--proof` | `#2B2117` | `#FFFCF5` | 15.38 | AAA | 2 |
| paper | `food/` | `section.sec.sec--proof` | `#645441` | `#FBF6ED` | 6.76 | AA | 2 |
| paper | `food/` | `section.sec.sec--proof` | `#96570C` | `#FFFCF5` | 5.59 | AA | 1 |
