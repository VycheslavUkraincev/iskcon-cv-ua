# SLICE0_REPORT.md — слияние `domain-sync-2026-10-20` → `mockup-v2`

**Дата:** 22.10.2026. **Ветка:** `mockup-v2`. **Слито:** `origin/domain-sync-2026-10-20` @588e1f1 (источник продакшна iskcon.cv.ua, см. AUDIT.md блок 12) в `mockup-v2` @9002757 (= `gh-pages` @8220cdf + коммит аудита).
**Общий предок:** 2548557. **Способ:** `git merge --no-ff`, без rebase, без ручных правок файлов сайта.
Дизайн не трогался, файлы не удалялись (`git diff --diff-filter=D` пуст).

## 1. Правила слияния (от владельца) и как они выполнены

| Правило | Файлы | Итоговая версия | Проверка |
|---|---|---|---|
| Словарь i18n целиком — domain-sync | `assets/i18n-dict.js` | domain-sync (107 481 Б, 456 RO / 454 EN ключей) | sha совпадает с domain-sync |
| Включённый MutationObserver — domain-sync | `assets/i18n.js` | domain-sync (`observeOn` рабочий, `observer = new MutationObserver` без комментариев) | sha = domain-sync |
| canonical / og / skip-link — domain-sync | `index.html`, `food/index.html`, `courses.html`, `food.html`, `donation.html` | domain-sync | sha = domain-sync |
| CSS `.skip-link`, `.grid3` — domain-sync | `assets/style.css` | domain-sync | sha = domain-sync; оба класса есть |
| Фикс H1 /food — domain-sync | `food/index.html`, `food.html` | domain-sync (`<span class="hl" data-i18n-h1>Ми годуємо людей</span>`) | EN «We feed people», RO «Hrănim oameni» |
| Папка `tools/` — domain-sync | `tools/build-domain.sh`, `tools/deploy.sh` | domain-sync (новые файлы) | sha = domain-sync |
| Видео-аватар — gh-pages | `assets/avatar.js`, `assets/avatar.css`, `assets/avatar-{main,learn,food,donate}.webm`, `-poster.png`, `avatar-loop*`, `avatar-poster.*` | gh-pages | sha = gh-pages; на всех 4 страницах `<video>` грузит свою сцену (readyState 4) |
| Preview-фиксы папочных страниц — gh-pages | `courses/index.html`, `donation/index.html` | gh-pages | файл побайтно **одинаков в обеих ветках** (blob 41198f2 / 70ad761) |

## 2. Что взято из каждой ветки

**Из `gh-pages` (уже были в `mockup-v2`, остались без изменений):** весь видео-аватар (21 коммит от 20–21.10), папочные `courses/index.html` и `donation/index.html`, все медиа, `assets/site.js`, `AUDIT.md`, `URL_BASELINE.txt`, `audit-screenshots/`.

**Из `domain-sync-2026-10-20` (2 коммита: c081d42, 588e1f1):**
- `assets/i18n-dict.js`, `assets/i18n.js`, `assets/style.css`;
- `index.html`: canonical `https://iskcon.cv.ua/`, og:url, skip-link, убран второй дублированный `<base>`;
- `food/index.html`: `data-i18n-h1` на H1;
- `courses.html`, `donation.html`, `food.html` (файловые дубли): canonical/og/twitter:card, skip-link, `id="main"`, убран дублированный `<base>`; в `food.html` добавлено видео «Шпальта Медіа» (теперь как в `food/index.html`); в `courses.html` подпись корешка «БГАГАВАД-ГІТА» → «БГАҐАВАД-ҐІТА» (как в папочной версии);
- `tools/build-domain.sh`, `tools/deploy.sh`;
- `.gitignore` (+ `dist-domain/`), `README.md` (+ раздел о сборке для домена).

## 3. Конфликты и их разрешение

**Конфликтов git — 0.** Пересечение изменений было только в двух файлах, и в обеих ветках они совпадали побайтно:

| Файл | gh-pages | domain-sync | Разрешение |
|---|---|---|---|
| `courses/index.html` | blob 41198f2 | blob 41198f2 | идентичны — git взял общий результат; соответствует правилу «preview-фиксы — gh-pages» |
| `donation/index.html` | blob 70ad761 | blob 70ad761 | то же |

Все остальные файлы менялись только в одной из веток и слились автоматически, каждый — в версию той ветки, которую предписывают правила (таблица §1).

**Две правки domain-sync, о которых нужно знать (не удаление контента, а часть выбранной версии):**
1. Во всех файловых страницах и в `index.html` удалена **вторая копия** строки `<base href="/iskcon-cv-ua/">` (первая осталась, поведение не меняется).
2. В H1 /food подсветка `.hl` теперь охватывает весь заголовок, а не одно слово «годуємо» — так страница выглядит и на продакшне сейчас; это следствие правила «фикс H1 — domain-sync».

## 4. Проверка после слияния (тем же замером, что в AUDIT.md, на локальном сервере с рабочим деревом)

Метод: Playwright + Chrome, `http://127.0.0.1:8765/iskcon-cv-ua/…` (тот же `<base>`, что на GitHub Pages), TreeWalker по всем текстовым узлам после перевода + атрибуты alt/aria-label/title/data-title + открытие чата аватара и клик по всем 6 вопросам + облачко мантры (7 замеров по 0,5 с).

| Критерий | Результат |
|---|---|
| EN, 4 страницы: кириллические текстовые узлы | **0 / 0 / 0 / 0** ✓ (было в repo: 33 / 3 / 6 / 4) |
| RO, 4 страницы: кириллические текстовые узлы | **0 / 0 / 0 / 0** ✓ |
| Атрибуты с кириллицей | только `/courses`: 3 × `data-title` корешков книг (допустимое исключение) ✓ |
| Чат аватара EN/RO (6 вопросов + ответы + «Назад») | 0 строк с кириллицей на всех страницах ✓ (было 18) |
| Облачко мантры EN/RO | 0 кириллических значений ✓ |
| H1 /food | EN «We feed people», RO «Hrănim oameni», UK «Ми годуємо людей» ✓ |
| Видео «Шпальта Медіа» в `/food/` | `iframe src=https://www.youtube.com/embed/0ZNyLSHUgpc`, подпись «Репортаж про наших волонтерів · «Шпальта Медіа», квітень 2026» ✓ (теперь есть и в `food.html`) |
| WayForPay (модалка /donation) | разова `…/donate/d645a94f6a237`, регулярна `…/donate/db52afa6592ea` ✓ |
| Monobank, телефоны, соцсети, Vedabase, Opendatabot, карта | все ожидаемые href на месте на каждой странице (`missingHrefs` пусто) ✓ |
| IBAN, ЄДРПОУ, получатель, назначение, адрес, расписание, «5 000 000+» | присутствуют дословно (`missingText` пусто) ✓ |
| QR `qr-onetime.png`, `qr-regular.png`, `tg-qr.png`, `ffl-logo.svg` | побайтно не изменились против коммита аудита ✓ (`tg-qr.png` по-прежнему с дефектом из AUDIT.md 4.5 — не чинился, вне задачи) |
| Ссылки в изменённых HTML | наборы href/src до и после: только добавления (`#main`, canonical, видео в `food.html`), ни одна ссылка не пропала ✓ |
| Видео-аватар (gh-pages) | `avatar-main / learn / food / donate.webm` играют на своих страницах ✓ |
| Ошибки консоли и 4xx на локальных ресурсах | 0 на всех 4 страницах ✓ |

## 5. Что НЕ делалось (по правилам этапа)
- Никаких правок дизайна, текстов, переводов; файлы не удалялись.
- Известные дефекты из AUDIT.md (битый `tg-qr.png`, Vedabase cc 404, контраст, счётчик и т.д.) не исправлялись.
- Пушится только `mockup-v2`. `gh-pages`, `main`, `domain-sync-2026-10-20` не тронуты. Продакшн не деплоился.
- `CLAUDE.md` и `docs/prabhu-package/` остаются неотслеживаемыми, как и до слияния.

**СТОП.** Срез 0 (слияние) завершён; к дизайну не приступаю до решения владельца.
