# Исследование 5 из 6: Higgsfield для веб-сайта ISKCON Chernivtsi

**Дата проверки:** 2026-10-22
**Сайт:** https://iskcon.cv.ua/ — ІСККОН Чернівці, Центр ведичної культури
**Репозиторий исходника:** `VycheslavUkraincev/iskcon-cv-ua`, брать актуальную ветку `gh-pages`
**Задача исследования:** не реклама Higgsfield, а практический план веб-ассетов для второго макета уровня Awwwards: hero-loop из фото алтаря, scroll-sequence, оживление фото «Їжа життя», motion-акценты для курсов.
**Статус:** генераций в этом исследовании не запускалось, кредиты не тратились. Все цены и доступность моделей ниже — это снимок из поиска на 2026-10-22, перед оплатой проверять живую страницу тарифов и счётчик кредитов в самом Higgsfield: источники между собой расходятся (см. раздел 6).

---

## 1. Короткий вывод

1. **Higgsfield — агрегатор моделей + производственный слой, а не одна модель.** Одна подписка и один баланс кредитов дают доступ к пулу видео- и фото-моделей, Cinema Studio для управления камерой, Soul / Soul ID для постоянства персонажа и Marketing Studio для рекламных форматов.
2. **Для сайта нужен режим image-to-video от утверждённого стартового кадра**, а не text-to-video «с нуля». Только так на сайте останутся настоящий алтарь, настоящая еда и настоящие помещения общины, а не выдуманные моделью.
3. **Higgsfield производит только файл видео. Всё остальное — код сайта:** раскладка, текст поверх, контраст, автоплей, пауза вне экрана, poster, fallback при `prefers-reduced-motion`, мобильная версия. Нельзя зашивать текст, логотип и CTA в само видео.
4. **Порядок работы важнее модели:** сначала исправить и утвердить стартовый кадр (по отзывам общины фото алтаря сейчас кадрировано неровно, а фон алтаря за шапкой «мажет» текст), потом дешёвый черновик, проверка на паузах и обратном скролле, и только потом финальный рендер.
5. **Начать с пилота из двух ассетов** (hero + один акцент для курсов), а не с четырёх сразу. Реалистичный расход — 3–5 генераций на один принятый клип, все попытки оплачиваются кредитами.

---

## 2. Что подтверждено поиском: модели и инструменты

Доступность зависит от тарифа, региона и канала подключения: каталоги сайта higgsfield.ai, MCP/CLI и API между собой могут различаться, финальный источник правды — консоль и счётчик в аккаунте.

| Модель / инструмент | Что это | Зачем сайту ISKCON | Ограничения из источников |
|---|---|---|---|
| **Seedance 2.5** (и 2.0 / 2.0 Fast / Mini) | Видео-модель ByteDance, reference-based и image-to-video генерация | Первый выбор для hero и scroll-sequence: кинематографичный медленный проход камеры от стартового кадра | Полная линейка Seedance начинается с тарифа Plus; на Starter только Fast и Mini. Draft Mode Seedance 2.5 недоступен в США со стороны провайдера. Настройки на сайте и в подключённом инструменте могут отличаться — агент должен проверить их до генерации |
| **Kling 3.0** (Std / Pro / 4K / Turbo), Kling 2.5 Turbo, Kling O3 / Omni | Видео-модели, сильны в движении людей и физике; есть Motion Control 2.6 / 3.0 | Запасной/основной вариант для «Їжа життя», где есть движение рук, пара и еды; Kling O1-режим поддерживает start & end frame и клипы 5 или 10 секунд | Часть Kling/Seedance-режимов на Higgsfield фактически image-to-video: без стартового кадра генерация не стартует («Start frame required»). Цены сильно зависят от разрешения и длительности |
| **Veo 3.1** | Видео-модель Google, кинематографичные сцены | Только точечный тест для hero, если Seedance и Kling не дали чистого кадра | Дорого: 8 секунд в 1080p — 80 кредитов по данным обзора Higgsfield. На сайте Higgsfield Veo может идти через web-backend/опциональные маршруты, а не через официальный API-каталог |
| **Wan 2.6 / 2.7 / 3.0** | Видео-семейство, есть в общем каталоге | Дешёвый черновик движения и композиции до дорогого финального рендера | Качество черновика не предсказывает качество финала на другой модели |
| **Soul, Soul 2.0, Soul Cinema** | Собственное семейство Higgsfield для изображений, «кинематографичная» стилистика | Сгенерировать/доработать стартовые кадры без людей: детали интерьера, лампа, книги, фон для карточек курсов | Это генератор изображений, а не способ «улучшить» документальное фото общины до неузнаваемости. Для сайта документальность важнее стилизации |
| **Soul ID** | Обучаемая идентичность: тренировка на 20 и более фото одного человека (до 80), одно лицо потом держится между генерациями | **Для этого сайта почти не нужен.** Теоретически — только если появится постоянный ведущий курсов, который сам дал согласие и хочет появляться в серии роликов | Загружать можно только фото себя или человека, давшего разрешение на использование внешности. Требовать 20+ фото волонтёров или получателей помощи ради веб-акцента — непропорционально и неэтично, не делать |
| **Cinema Studio 4.0** | Слой режиссуры: явное управление камерой при генерации, в версии 4.0 — клипы до 30 секунд и автоматическая постановка сцен | Брать из него словарь камеры (один named move: slow push-in, lateral dolly, crane up), а не многосценные ролики | Для веба нужны короткие односценные клипы 5–8 секунд, а не 30-секундные сцены: вес файла и потеря внимания |
| **MiniMax Hailuo 2.3 / H3, LTX, PixVerse, Grok Video** | Остальной пул каталога (35+ моделей и инструментов суммарно по данным Higgsfield) | Резерв, если основной стек не справляется с конкретным кадром | Не закладывать в план: сначала тест на основном стеке |

Источники: обзор моделей и production stack на higgsfield.ai https://higgsfield.ai/blog/best-ai-video-generators-2026 и https://higgsfield.ai/blog/best-all-in-one-subscription-ai-images-video ; сторонний реестр MCP-моделей (неофициальный, сверять с консолью) https://github.com/Hikhakk/higgsfield-mcp-unified ; про start/end frame у Kling O1 https://higgsfield.ai/blog/Kling-01-is-Here-A-Complete-Guide-to-Video-Model ; про Soul ID https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character

### 2.1. Правило одного движения камеры

Для Seedance действует практическое правило из разбора промптов: **одно движение камеры на один шот, с названным расстоянием и скоростью**, камера — подлежащее в предложении, а комната и предметы явно зафиксированы на месте. Просьба «push + pan + orbit сразу» делает картинку нестабильной. Это правило заложено во все промпты ниже.

Источник: https://crossroadmedia.ca/realism/

---

## 3. Интеграции с агентами: MCP, CLI, API

| Канал | Как подключается | Ключ / биллинг | Что важно для проекта |
|---|---|---|---|
| **Claude (claude.ai / Desktop) — MCP** | Custom connector с URL `https://mcp.higgsfield.ai/mcp`, вход через OAuth в аккаунт Higgsfield | API-ключ не нужен. Нужна активная платная подписка. Списываются кредиты тарифа | Удобно обсуждать и генерировать в одном чате |
| **ChatGPT — плагин** | Официальный Higgsfield Plugin из Plugins Directory | Та же подписка и кредиты | Через ChatGPT работает только image и video, без аудио |
| **Cursor** | Higgsfield из marketplace | Та же подписка | Генерация внутри coding-workflow |
| **Claude Code, OpenClaw, Hermes — CLI + Skills** | Агент сам ставит: `npm i -g @higgsfield/cli`, затем `higgsfield auth login`, затем `npx skills add higgsfield-ai/skills`. При логине открывается браузер для подтверждения | Та же подписка, кредиты тарифа | **Это целевой канал для связки с промптом Claude Code:** агент может сгенерировать ассет и сразу положить файл в репозиторий макета. Перед каждой платной генерацией агент обязан показать модель, настройки и цену в кредитах и дождаться подтверждения |
| **API (отдельный продукт)** | Аккаунт на console.higgsfield.ai, ключ из двух частей (ID + secret, показывается полностью один раз) | Отдельный долларовый баланс, не кредиты подписки. Неудачные запросы не биллингуются | Нужен только если генерацию встраивать в свой бэкенд/скрипты. Для разового редизайна избыточен |
| **Сторонние MCP-обёртки** (Composio и др.) | Свой MCP URL и заголовки сессии | Зависит от обёртки | Не использовать без отдельной проверки: официальный путь выше проще и отвечает за кредиты напрямую |

**Критичное ограничение MCP/CLI:** Unlimited-доступ и бесплатные генерации действуют **только на сайте higgsfield.ai**. Всё, что генерируется через MCP, CLI и другие автоматизированные инструменты, списывает кредиты по стандартным ставкам. Планировать бюджет «по unlimited» для агентного пайплайна нельзя.

Источники: https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent ; https://higgsfield.ai/blog/generate-ai-videos-ai-agents-2026 ; https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp ; https://higgsfield.ai/blog/generate-ai-videos-higgsfield-api

---

## 4. URL-to-Video и Marketing Studio: где полезны, а где нет

**Как работает:** вставляешь ссылку, Marketing Studio сам импортирует название, описание и фото со страницы, предлагает шаблон и аватара, собирает рекламный ролик; есть brand kit (логотип, цвета, шрифты, тон), форматы 9:16, 16:9, 1:1, видео крутится на Seedance 2.0, аватары — на Soul 2.0, картинки — на Nano Banana.

**Честная граница применимости:** инструмент сделан для **продуктовых страниц**. Сам Higgsfield пишет, что он не для превращения в видео блогов, новостей и страниц без продукта.

| Сценарий ISKCON | Вердикт |
|---|---|
| Hero, scroll-sequence и акценты на самом сайте | **Нет.** Тут нужен image-to-video от своих фото с контролем камеры (раздел 5), а не рекламный шаблон с аватаром |
| Вертикальный промо-ролик 9:16 на регистрацию курсов со страницы курсов | **Да, как черновик для соцсетей.** Сгенерировать движение и картинку без текста, заголовки и украинский текст наложить потом в редакторе/коде: вшитый в генерацию текст модель почти наверняка исказит, особенно украинский |
| Вертикальный ролик «стань волонтёром Їжа життя» для соцсетей | **Да, с той же оговоркой** и без AI-аватара «под видом реального волонтёра»: это вводит зрителя в заблуждение |
| Замена реального видео-репортажа «Шпальта Медіа» (апрель 2026), уже стоящего в блоке «Їжа життя» | **Нет.** Реальный репортаж даёт доверие, AI-ролик его не заменит и рядом с ним будет выглядеть фальшиво |

Источники: https://higgsfield.ai/url-to-video ; https://higgsfield.ai/ai-ad-generator ; https://higgsfield.ai/creator-hub/help-center/getting-started/what-is-higgsfield

---

## 5. Ассеты для сайта: таблица и готовые промпты

### 5.0. Общий скелет промпта (не менять от ассета к ассету)

Каждый промпт ниже построен по одной проверенной схеме для веб-видео через Higgsfield/Seedance: утверждённое изображение как референс/стартовый кадр, **одно** непрерывное движение камеры, сохранение идентичности, геометрии, материалов и света исходника, спокойная зона под веб-текст, запреты на разрезы, переходы, ускорения, тряску, morphing, новые объекты, логотипы и вшитые слова, требование, чтобы клип хорошо выглядел на паузе и при прокрутке назад, длительность 5–8 секунд, без звука, внутри утверждённого бюджета генераций.

Источник схемы: https://mavgpt.ai/pdfs/Claude_Can_Build_Insane_Cinematic_3D_Websites_2026.pdf

Подготовка стартовых кадров — до Higgsfield, обычным редактором:

- Фото алтаря сначала **выровнять** (заваленный горизонт — отдельный отзыв общины, файл `04_crooked_photo.jpg` в архиве отзывов) и перекадрировать: master 16:9 для desktop и отдельный центральный кроп 4:5 для mobile, субъект по центру, чтобы при `object-fit: cover` главное не уехало из мобильного кадра.
- Верхняя/левая треть кадра под заголовок: попросить в редактуре спокойную, чуть затемнённую зону. Финальную читаемость даёт не модель, а градиент-оверлей в коде — это прямо отвечает отзыву Николая Прохорова про фон алтаря, который «мажет всё» за шапкой (файл `06_header_large_background.jpg`).
- В генерацию отдавать **оригинал в полном разрешении**, а не сжатую веб-копию с текущего сайта. Веб-версию делать потом из скачанного мастера (раздел 7).

### 5.1. Сводная таблица

| ID | Место на сайте | Стартовый кадр / референс | Модель, режим | Генерация | Веб-цель |
|---|---|---|---|---|---|
| **A. Hero loop** | Первый экран главной, «Простір внутрішнього спокою», фон под заголовком | Выровненное фото алтаря, широкий план, спокойная зона слева-сверху | Seedance 2.5, image-to-video; fallback Kling 3.0 Pro, затем Veo 3.1 точечно | 16:9, 1080p master, 8 сек, аудио OFF, start frame обязателен | Desktop ≤ 3 МБ, mobile-версия ≤ 1,5 МБ, poster = первый кадр |
| **B. Scroll-sequence** | Отдельная секция главной на 150–200vh, скролл «ведёт» камеру от общего плана к детали алтаря | То же фото алтаря в полном разрешении + (если модель поддерживает) end frame: крупный план цветов и ламп у алтаря из того же фото | Seedance 2.5 со start/end frame; fallback Kling O-режим со start/end frame (клипы 5 или 10 сек) | 16:9, 1080p master, 8–10 сек, аудио OFF, частые ключевые кадры при экспорте | ≤ 4 МБ desktop, на mobile заменяется poster + лёгкий параллакс (см. 5.3) |
| **C. Їжа життя** | Секция/страница «Їжа життя», рядом с реальными фото и видео-репортажем, не вместо них | Реальное фото раздачи еды **без крупных лиц**: руки, половник, пар над котлом, спины волонтёров | Kling 3.0, image-to-video; fallback Seedance 2.5 | 16:9, 720p черновик → 1080p финал, 5 сек, аудио OFF | ≤ 1,5 МБ, короткий loop в карточке секции |
| **D. Акценты курсов** | Заголовки секций/карточки на странице курсов: 2 акцента максимум на страницу | Крупные планы предметов без людей: масляная лампа (diya) и огонь; раскрытая книга и чётки на ткани | Seedance 2.5 или Kling 3.0, image-to-video; черновики можно на Wan для проверки движения | 1:1 или 4:3, 720p достаточно, 4–5 сек, аудио OFF | Каждый ≤ 800 КБ, `preload="none"`, lazy |
| **E. (Опц.) Промо курсов / волонтёров** | Не сайт, а соцсети, вертикаль | URL страницы курсов + brand kit в Marketing Studio | Marketing Studio / URL-to-Video (Seedance 2.0) | 9:16, до 15 сек, **без вшитого текста** | Текст и субтитры накладываются вне Higgsfield |

### 5.2. Ассет A — Hero cinematic loop из фото алтаря

**Стартовый кадр:** выровненное фото алтаря (см. 5.0). Лица/мурти не в крупном плане: чем крупнее священные изображения, тем выше риск, что модель их «поплывёт». Движение в кадре — только свет, дым и пламя свечей/ламп, архитектура и алтарь неподвижны.

**Промпт (EN, copy-paste):**

```text
Use the approved photo as the exact start frame and visual reference for one
continuous cinematic shot, image-to-video. Preserve the altar, deities,
architecture, objects, geometry, materials and warm lighting exactly as in
the photo throughout. Do not redesign the room.

CAMERA: the camera pushes in very slowly and steadily, only a few percent
closer over the whole shot. The camera is the only thing that moves; the
altar, walls and every object stay fixed in place. No pan, no tilt, no orbit.

MOTION IN FRAME: only subtle natural life — a gentle flicker of candle and
oil-lamp flames, a thin wisp of incense smoke rising slowly, soft light
breathing. Nothing else moves.

TEXT ZONE: keep the upper-left third of the frame visually calm, darker and
low-detail for website headline text. Keep the main subject centred so the
shot survives a vertical mobile crop.

LOOP: start and end framing must be almost identical, so the clip can loop
with a short crossfade.

No cuts, no transitions, no sudden acceleration, no handheld shake, no
morphing, no warping, no new objects, no people appearing, no logos, no
baked-in words or letters. Motion must still look clean and dignified when
paused on any frame or scrubbed backwards. Photorealistic, reverent, quiet
mood. Duration 8 seconds, 16:9. No audio, silent clip.
```

**Настройки:** режим image-to-video, start frame = утверждённое фото; сначала черновик 720p, проверка по чек-листу раздела 8, затем финал 1080p. Если выбранная модель требует start frame, без него генерация не запустится — это нормально для Kling/Seedance-режимов на платформе.

**Чего не обещать:** идеально бесшовный loop «из коробки». Планировать в коде кроссфейд 0,6–1,0 сек между концом и началом.

### 5.3. Ассет B — Scroll-sequence видео

**Идея:** одна секция, где скролл пользователя двигает камеру от общего плана храма/зала к детали алтаря. Видео не играет само: код ставит `currentTime` пропорционально скроллу (GSAP ScrollTrigger scrub — это уже тема исследования по коду, здесь только требования к файлу).

**Стартовый кадр:** тот же широкий план алтаря. **Конечный кадр (если модель поддерживает start/end):** кроп того же фото крупным планом — цветы, лампы, детали у алтаря. Оба кадра из одного исходника, иначе модель начнёт morphing между разными помещениями.

**Промпт (EN, copy-paste):**

```text
Use the approved wide photo as the exact start frame and, if an end frame
is provided, finish exactly on that close-up frame. One continuous cinematic
shot, image-to-video. Preserve the altar, architecture, objects, geometry,
materials and lighting exactly throughout. Do not redesign the room.

CAMERA: the camera dollies forward in a straight line at a constant very
slow speed, from the wide view of the hall to a closer view of the flowers
and oil lamps in front of the altar. The camera is the only thing that
travels; the room and every object stay fixed in place. No pan, no tilt, no
orbit, no zoom jumps.

MOTION IN FRAME: only a subtle candle flicker and slow incense smoke.
Everything else is still.

This clip will be scrubbed frame by frame by website scrolling, forwards
and backwards: every intermediate frame must be sharp, stable and usable as
a still image. No frame may contain a distorted altar, warped objects or a
subject leaving the centre of the frame.

Keep the centre of the frame as the safe zone for mobile crop.

No cuts, no transitions, no sudden acceleration, no deceleration at the
end, no handheld shake, no morphing, no new objects, no people, no logos,
no baked-in words or letters. Photorealistic, reverent, quiet mood.
Duration 8-10 seconds, 16:9. No audio, silent clip.
```

**Настройки и экспортные отличия:** длительность брать максимальную доступную у выбранной модели из коротких (у Kling O-режима это 10 секунд); при экспорте в веб — короткий GOP / частые keyframes (каждые 12–24 кадра), иначе браузер не сможет плавно скрабить `currentTime`. На mobile и при слабом соединении scroll-секцию заменять poster-кадром с лёгким CSS-параллаксом: скраббинг тяжёлого видео на телефоне даёт рывки и съедает батарею.

### 5.4. Ассет C — Оживление фото «Їжа життя»
**Контекст и риск.** В блоке уже стоит реальный видео-репортаж «Шпальта Медіа» (апрель 2026), и община отметила его как удачный. AI-клип здесь только короткий атмосферный акцент рядом с реальными фото, а не замена репортажа и не «документальное» видео.

Главный риск жанра: реальные люди. Модель может изменить лица, руки, возраст, одежду, додумать жесты и превратить документальное фото в постановочную сцену. Поэтому:

- Выбирать кадр **без крупных лиц**: руки и половник крупно, котёл и пар, волонтёры со спины или в профиль вдали.
- **Получателей помощи крупным планом не анимировать вообще.** Это уязвимые люди, их согласие на AI-обработку фото нельзя предполагать.
- Никакого Soul ID на волонтёров: он требует 20+ фото человека и его разрешения, для веб-акцента это не нужно.
- Если в единственном хорошем фото лица всё же видны, движение оставлять только пару и свету, камера почти неподвижна, люди не говорят и не улыбаются «в камеру» по команде модели.

**Промпт (EN, copy-paste):**

```text
Animate the approved documentary photo as the exact start frame,
image-to-video. This is a real charitable food distribution by volunteers.
Preserve every person, face, hand, object, clothing, geometry and the
environment exactly as in the photo. Do not add, remove or replace people,
do not change faces or identities, do not make anyone speak or look at the
camera.

CAMERA: the camera makes one very slow, short lateral dolly move to the
right, a few percent of the frame width, at a constant speed. The camera is
the only thing that travels; the room, tables and serving line stay fixed
in place.

MOTION IN FRAME: only small real movements already implied by the photo —
gentle steam rising from the hot food, one serving ladle moving slowly and
realistically, a very subtle natural shift of hands holding a container.
Slow, calm, dignified. No fast gestures, no waving, no posing.

No cuts, no transitions, no sudden acceleration, no handheld shake, no
morphing, no warped hands or fingers, no extra limbs, no new objects, no
logos, no baked-in words or letters. Every paused frame must still look
like the original documentary photograph. Photorealistic, warm daylight.
Duration 5 seconds, 16:9. No audio, silent clip.
```

**Настройки:** Kling 3.0 как первый кандидат (движение людей и физика), Seedance 2.5 как сравнение на том же кадре и промпте. Черновик 720p и обязательная проверка рук и лиц на паузах покадрово. Если руки или лица «плывут» даже в черновике, ассет не чинить промптами бесконечно: оставить статичное фото с Ken Burns-эффектом в коде, это честнее и дешевле.

### 5.5. Ассет D — Motion-акценты для секций курсов

**Принцип:** акценты — это предметы, а не люди. Предметные клипы дешевле, безопаснее по правам и почти не morph-ят. Не больше двух на страницу курсов, иначе страница превращается в набор движущихся картинок и теряет скорость.

**D1. Масляная лампа и благовоние (шапка секции или карточка курса).**

Стартовый кадр: крупный план зажжённой масляной лампы (diya) на тёмном спокойном фоне, справа или слева пустое место под заголовок.

```text
Use this close-up photo as the exact start frame, image-to-video. Preserve
the oil lamp, flame shape, objects, materials and dark background exactly
as in the photo. Do not add or remove objects.

CAMERA: the camera stays locked off — no movement at all. Only the light
moves.

MOTION IN FRAME: the flame flickers gently and naturally, a thin wisp of
incense smoke rises and curls very slowly, warm light breathes softly on
the nearby surface. Everything else is perfectly still.

Keep the left half of the frame dark, calm and low-detail for website text.

No cuts, no transitions, no camera shake, no morphing, no new objects, no
people, no logos, no baked-in words or letters. Photorealistic, quiet,
reverent mood. Duration 5 seconds, 1:1. No audio, silent clip.
```

**D2. Книга и чётки (второй акцент, другая секция).**

Стартовый кадр: раскрытая книга на ткани, рядом чётки (mala), мягкий боковой свет, без рук в кадре или с рукой только на краю кадра и неподвижной.

```text
Use this photo as the exact start frame, image-to-video. Preserve the open
book, its pages and printed text exactly as photographed — do not redraw,
rewrite or animate the text. Preserve the prayer beads, fabric, materials
and soft side light exactly.

CAMERA: the camera pushes in very slowly, only a few percent closer over
the whole shot, in a straight line. The camera is the only thing that
moves; the book, beads and fabric stay fixed in place.

MOTION IN FRAME: only a very subtle movement of light and shadow across
the page, as if from a nearby lamp, and the faintest lift of one page
corner in a still room's air. The printed text itself never changes.

No cuts, no transitions, no sudden acceleration, no handheld shake, no
morphing, no changing letters, no new objects, no hands appearing, no
logos, no baked-in words added. Photorealistic, calm, scholarly mood.
Duration 5 seconds, 4:3. No audio, silent clip.
```

**Настройки:** 720p достаточно, акцент показывается небольшим. Отдельное предупреждение по D2: генеративные модели плохо держат печатный текст, поэтому в черновике смотреть именно на буквы. Если текст «дышит» или меняется, заменить кадр на вид книги со спины/под углом, где текст не читается, или отказаться от клипа в пользу фото.

---

## 6. Веб-экспорт: единый стандарт для всех ассетов

Higgsfield отдаёт мастер-файл, а не веб-файл. Мастер хранить отдельно от репозитория сайта (в папке мастеров проекта), в репозиторий класть только оптимизированные версии: иначе сайт, у которого уже была проблема с тяжёлыми изображениями около 7,8 МБ, снова раздуется.

### 6.1. Целевые параметры

| Параметр | Hero (A) | Scroll (B) | Їжа життя (C) | Акценты (D) |
|---|---|---|---|---|
| Master | Скачанный оригинал Higgsfield, 1080p, не переименовывать до записи в журнал | Тот же | Тот же | Тот же |
| Desktop web | 1920×1080 или 1600×900, 24–30 fps | 1600×900, 30 fps, короткий GOP | 1280×720, 24–30 fps | 960×960 / 1200×900, 24 fps |
| Mobile web | Отдельный файл 854×480, центральный кроп | Не видео: poster + параллакс | 854×480 | Тот же файл, он и так мал |
| Форматы | WebM (VP9) первым `<source>`, MP4 (H.264, `+faststart`) вторым | Так же | Так же | Так же |
| Аудио | Удалить дорожку полностью (`-an`), не «заглушить» | `-an` | `-an` | `-an` |
| Вес цели | WebM ≤ 3 МБ desktop, ≤ 1,5 МБ mobile | ≤ 4 МБ desktop | ≤ 1,5 МБ | ≤ 800 КБ каждый |
| Poster | Первый кадр клипа, WebP/JPG 100–250 КБ, тот же кроп, что и видео | Кадр из середины прохода, не первый | Первый кадр | Первый кадр |

Ориентиры сжатия из веб-практик: для H.264 начинать с CRF 23–28, для VP9 — с CRF 30–35 и дальше смотреть на реальный файл, а не на цифру. Poster показывается до готовности видео и часто становится LCP-элементом, поэтому его вес и скорость важнее красоты самого ролика.

### 6.2. Команды FFmpeg (шаблоны)

```bash
# WebM, без звука, 30 fps
ffmpeg -i master.mp4 -an -vf "scale=1600:-2,fps=30" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -pix_fmt yuv420p hero.webm

# MP4 fallback, без звука, moov в начале файла (+faststart)
ffmpeg -i master.mp4 -an -vf "scale=1600:-2,fps=30" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
  -movflags +faststart hero.mp4

# Mobile-версия hero
ffmpeg -i master.mp4 -an -vf "scale=854:-2,fps=30" \
  -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
  -movflags +faststart hero-mobile.mp4

# Poster из первого кадра + его WebP-версия
ffmpeg -i hero.mp4 -frames:v 1 hero-poster.jpg
ffmpeg -i hero.mp4 -frames:v 1 hero-poster.webp
```

### 6.3. Встраивание в статичный сайт

Общие правила, подтверждённые MDN / web.dev-практикой:

- Автоплей в браузерах работает только без звука: обязательны `autoplay muted loop playsinline`. Без `playsinline` iOS Safari уводит видео в полноэкранный плеер и ломает фон.
- WebM ставить первым `<source>`, MP4 вторым: поддерживающие браузеры возьмут меньший файл, остальные — универсальный MP4.
- Hero: `preload="metadata"` или отложенная подмена `src` после загрузки страницы, poster виден сразу, у секции заданы высота / `aspect-ratio`, чтобы не было сдвига раскладки (CLS).
- Всё ниже первого экрана: `preload="none"` + IntersectionObserver, который ставит источники за ~200 px до входа в экран, запускает видео в кадре и **ставит на паузу вне кадра**. Несколько автоплеев одновременно на одной странице не запускать.
- Видео декоративное: `aria-hidden="true"`, весь смысл дублируется обычным текстом страницы, рядом не должно быть информации, которая есть только в видео.

```html
<video class="hero-video" autoplay muted loop playsinline preload="metadata"
       poster="assets/video/hero-poster.webp" aria-hidden="true">
  <source src="assets/video/hero.webm" type="video/webm">
  <source src="assets/video/hero.mp4" type="video/mp4">
</video>
```

```js
// prefers-reduced-motion и экономия трафика: видео не грузим вообще
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const saveData = navigator.connection && navigator.connection.saveData;
if (reduceMotion.matches || saveData) {
  document.querySelectorAll("video[data-motion]").forEach(v => {
    v.removeAttribute("autoplay");
    v.querySelectorAll("source").forEach(s => s.remove());
    v.load(); // остаётся только poster
  });
}
```

### 6.4. Fallback-матрица

| Условие | Поведение |
|---|---|
| `prefers-reduced-motion: reduce` | Видео не загружается и не играет, показывается poster. Никакого Ken Burns и параллакса в этом режиме тоже |
| Mobile + `Save-Data` / effectiveType 2g–3g | Poster вместо видео для B и C; для hero — mobile-файл малого размера или poster, по решению на тесте |
| Видео не загрузилось / кодек не поддержан | Poster остаётся фоном секции, раскладка и текст не страдают |
| JS выключен | Hero покажет poster; контент доступен полностью: видео на сайте только декоративное |
| Пользователь хочет остановить движение | Для секций B–D желательна видимая кнопка паузы с доступным именем; минимум — автопауза вне вьюпорта |

Источники: https://web.dev/learn/performance/video-performance?authuser=2 ; https://www.mux.com/articles/how-to-compress-video-files-while-maintaining-quality-with-ffmpeg ; https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide?trk=public_post_comment-text

---

## 7. Бюджет и кредиты: что известно и что надо перепроверить

**Источники расходятся в цифрах тарифов даже внутри октября 2026 года.** Один официальный материал Higgsfield даёт Starter $19/мес и 270 кредитов, Plus $59 и 1 200, Ultra $129 и 3 000; другой официальный материал даёт Starter $15 и 200, Plus $49 и 1 000, Ultra $129 и 3 000. Поэтому ниже — не смета к оплате, а рамка для решения. Перед покупкой зафиксировать скриншотом живую страницу тарифов и счётчик конкретной генерации.

Точки отсчёта стоимости одной генерации из источников:

| Генерация | Кредиты |
|---|---|
| Kling 3.0, 5 сек, 720p | 10 |
| Kling 3.0, 8 сек, 720p | 16 |
| Veo 3.1, 8 сек, 1080p | 80 |
| Seedance 2.5, короткий клип, оценка стороннего обзора доступных генераторов | около $2,48 за клип (не в кредитах, тариф зависит от плана) |

Правила бюджета:

- **Кредиты не переносятся на следующий месяц** и сгорают, в том числе на бесплатном уровне. Покупать большой тариф «про запас» нельзя.
- **Каждая попытка стоит кредитов**, включая неудачные по смыслу (технически отрендерился, но не подходит под бриф — оплачен). Реалистично закладывать 3–5 генераций на один принятый клип.
- **Через MCP/CLI unlimited не работает** (см. раздел 3): агентный пайплайн всегда за кредиты.
- Доступ к полному Seedance начинается с Plus; на Starter только Fast/Mini-версии.
- По API неудачная генерация не биллингуется и сумма возвращается, но API — отдельный долларовый баланс, а не кредиты подписки.

**Предлагаемый пилотный лимит (согласовать до старта):** тариф Plus на один месяц, потолок на пилот — 400 кредитов и только два ассета (A и D1). Примерная раскладка пилота по Kling 3.0 720p: hero 5 черновиков × 16 = 80 кредитов, финальный рендер в 1080p дороже черновика — зарезервировать ещё 100; акцент D1: 4 попытки × ~10 = 40. Остаток не тратить «потому что есть», а оставить на ассет C. Агент перед каждой серией показывает: модель, разрешение, длительность, цену серии и остаток лимита; без подтверждения серию не запускает.

Источники: https://www.blotato.com/blog/higgsfield-pricing ; https://higgsfield.ai/blog/ai-video-api-pricing-vs-subscriptions ; https://higgsfield.ai/blog/best-affordable-ai-video-generators ; https://higgsfield.ai/blog/best-ai-video-generators-2026

---

## 8. Рабочий процесс и контроль качества

1. Утвердить стартовые кадры: выровнять и перекадрировать фото алтаря; выбрать фото «Їжа життя» без крупных лиц; снять/выбрать предметные кадры для D.
2. Зафиксировать журнал ассетов до первой генерации: ID, исходный файл, промпт, модель, настройки, лимит кредитов.
3. Черновики на 720p (или draft-режиме, где он доступен в вашем регионе): по 2 варианта движения на ассет.
4. Проверка черновика тремя способами, как в веб-workflow Higgsfield/Seedance: обычным воспроизведением; **на паузах** в нескольких точках; **прокруткой ползунка назад**. Искать: поплывшие мурти и лица, смену геометрии комнаты, прыжки камеры, выход субъекта из мобильного кропа, дрожание текста на книге (D2).
5. Только прошедший проверку вариант рендерится в финал 1080p. Скачать мастер сразу: ссылка, которую вернул инструмент генерации, может не быть долговечным публичным URL для готового сайта.
6. Экспорт в веб по разделу 6, отдельная mobile-версия hero, poster из первого кадра.
7. Интеграция в макет отдельной веткой/папкой от актуальной `gh-pages`, проверка на телефоне с троттлингом сети, а не только на офисном интернете.
8. Записать в журнал финальные: промпт, модель/настройки, ID задания, кредиты, файлы мастер/веб/poster. Без журнала ассет нельзя будет повторить или поправить.

---

## 9. Что нельзя обещать

- **Сохранность кадра пиксель-в-пиксель.** Image-to-video всегда перерисовывает кадр. Можно требовать «без заметных изменений на паузах», нельзя гарантировать, что алтарь, лица или текст книги не изменятся ни на одном кадре.
- **Бесшовный loop из генерации.** Конец и начало почти наверняка разойдутся по свету и дыму; шов прячется кроссфейдом в коде, и это надо закладывать сразу.
- **Правильный украинский текст внутри видео.** Заголовки, формы и CTA делаются HTML-ом поверх. Любой текст, который модель «напишет» сама, проверять как ошибку.
- **Доступность конкретной модели в конкретном канале.** Seedance 2.5, Veo 3.1 и другие могут отличаться по тарифу, региону и каналу (сайт / MCP / CLI / API), а Draft Mode Seedance 2.5 недоступен в США со стороны провайдера. Агент обязан проверить доступные настройки перед генерацией, а не верить промпту.
- **Точную цену до оплаты.** Источники расходятся, акции меняют цифры, счётчик в аккаунте — единственный финальный источник.
- **Что AI-акцент улучшит доверие к «Їжа життя».** Доверие там даёт реальный репортаж «Шпальта Медіа» и реальные фото. AI-клип — украшение, при плохой генерации он вредит, а не помогает.
- **Что Higgsfield будет хостить файлы сайта.** Сгенерированные ассеты скачиваются и хостятся как обычные файлы сайта; срок хранения и вид URL в аккаунте не являются контрактом на хостинг.
- **Soul ID как «постоянство любого человека везде».** Официально Soul ID обучается на 20+ фото одного человека и работает внутри семейства Soul; перенос на все видео-модели и версии в источниках не подтверждён однозначно — для этого проекта Soul ID в любом случае не применяется.

---

## 10. Права на исходные фото и на результат

- **Исходники — главный риск проекта, а не генерация.** Загружать в Higgsfield можно только фото, на которые у общины есть права на публикацию и на производную AI-обработку: уточнить у фотографа, особенно для фото алтаря и фото с людьми.
- **Люди в кадре:** нужно согласие изображённых на такую обработку. Для получателей благотворительной еды безопасное решение одно — не использовать их узнаваемые фото для анимации вообще. Soul ID прямо требует загружать только фото себя или человека, давшего разрешение.
- **Результат:** по справке Higgsfield по API, пользователь держит права на сгенерированный контент и может использовать его коммерчески, в продуктах, рекламе и клиентской работе; платформа не заявляет собственность на входы и выходы. При этом ответственность за права на исходные медиа, согласие на внешность, товарные знаки и закон остаётся на пользователе.
- **Нюанс условий, который надо знать до загрузки лиц:** сторонние разборы условий Higgsfield фиксировали, что в публичных условиях у платформы есть лицензия на использование входов и выходов, в том числе для обучения и улучшения моделей; в редакции от 26 июля 2026 года объём этой лицензии сузили (убрали бессрочность/передаваемость и промо-использование без публичной публикации), а пункт про обучение, по сравнению Segmind, остался без изменений. У Enterprise-тарифа отдельно заявлена гарантия no-train, у обычных тарифов такой гарантии в источниках нет. Практический вывод: интерьеры и предметы загружать спокойно, чувствительные и неопубликованные фото людей — только осознанно, прочитав актуальные условия в день генерации.
- **Видео «Шпальта Медіа» не является исходником для Higgsfield.** Это чужой редакционный продукт: его нельзя анимировать, пересобирать или «улучшать» моделью без отдельного разрешения редакции. На сайте оно остаётся как есть, встроенным/размещённым в том виде, в котором община его уже интегрировала.

Источники: https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api ; https://blog.segmind.com/higgsfield-credits-explained-expiry-rules-and-real-cost/ ; https://magichour.ai/blog/higgsfield-ai-review ; https://higgsfield.ai/enterprise ; https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character

---

## 11. Что нужно от пользователя, чтобы перейти от исследования к генерации

1. Подтвердить доступ в Higgsfield: есть ли подписка, какой тариф, сколько кредитов доступно сейчас. Без этого все цены выше — только рамка.
2. Согласовать пилотный лимит кредитов (предложение раздела 7: Plus на месяц, потолок пилота 400 кредитов, ассеты A + D1).
3. Дать исходные фото в полном разрешении: алтарь (исходник, а не веб-копия), 2–3 кандидата «Їжа життя» без крупных лиц, предметные кадры лампы и книги для D — или разрешение снять/подобрать их из существующих фото общины.
4. Подтвердить права и согласия по пункту 10, прежде всего по фото с людьми.
5. Утвердить стартовые кадры после выравнивания и кадрирования — до первой платной генерации.

## Источники (только реальные ссылки из поиска 2026-10-22)

- Модели и стек: https://higgsfield.ai/blog/best-ai-video-generators-2026 ; https://higgsfield.ai/blog/best-all-in-one-subscription-ai-images-video ; https://higgsfield.ai/blog/generate-ai-videos-higgsfield-api ; https://github.com/Hikhakk/higgsfield-mcp-unified
- Интеграции: https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent ; https://higgsfield.ai/blog/generate-ai-videos-ai-agents-2026 ; https://higgsfield.ai/blog/mcp-for-marketers ; https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp
- Marketing Studio / URL-to-Video: https://higgsfield.ai/url-to-video ; https://higgsfield.ai/ai-ad-generator ; https://higgsfield.ai/creator-hub/help-center/getting-started/what-is-higgsfield
- Цены и кредиты: https://www.blotato.com/blog/higgsfield-pricing ; https://higgsfield.ai/blog/ai-video-api-pricing-vs-subscriptions ; https://higgsfield.ai/blog/best-affordable-ai-video-generators
- Промпты и веб-workflow: https://mavgpt.ai/pdfs/Claude_Can_Build_Insane_Cinematic_3D_Websites_2026.pdf ; https://crossroadmedia.ca/realism/ ; https://higgsfield.ai/blog/Kling-01-is-Here-A-Complete-Guide-to-Video-Model
- Soul ID: https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character ; https://higgsfield.ai/soul-intro
- Права и условия: https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api ; https://blog.segmind.com/higgsfield-credits-explained-expiry-rules-and-real-cost/ ; https://magichour.ai/blog/higgsfield-ai-review ; https://higgsfield.ai/enterprise
- Веб-экспорт видео: https://web.dev/learn/performance/video-performance?authuser=2 ; https://www.mux.com/articles/how-to-compress-video-files-while-maintaining-quality-with-ffmpeg ; https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide?trk=public_post_comment-text
