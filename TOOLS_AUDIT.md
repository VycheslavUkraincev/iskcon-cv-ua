# TOOLS_AUDIT.md — установка инструментов и аудит превью (23.10.2026)

**Превью:** https://vycheslavukraincev.github.io/iskcon-mockup-v2-preview/ (`mockup-v2` @ `3bfa2f7`). Код при аудите не правился. Решения по находкам — в коммите полировки после этого отчёта.

## Установка

| № | Инструмент | Статус |
|---|---|---|
| 1 | Плагин `frontend-design@claude-plugins-official` | установлен (user scope), включён |
| 2 | Навык `webapp-testing` (anthropics/skills) | уже был в `.claude/skills` репозитория; сверен с upstream (коммит `dbd4588`, 09.10.2026) — идентичен |
| 3 | `playwright` MCP (`npx @playwright/mcp@latest`, Microsoft) | добавлен (local scope `~/.openclaw`), сервер ✔ Connected |
| 4 | `chrome-devtools` MCP (`npx chrome-devtools-mcp@latest`, Google ChromeDevTools) | добавлен (local scope `~/.openclaw`), сервер ✔ Connected |
| 5 | Vercel `web-design-guidelines` (vercel-labs/agent-skills) | установлен в `~/.claude/skills`; правила берутся свежими из `vercel-labs/web-interface-guidelines/command.md` |

- **Пакеты npm** обоих MCP проверены: репозитории `microsoft/playwright-mcp` и `ChromeDevTools/chrome-devtools-mcp`.
- **`react-best-practices`** из пакета Vercel не ставился: его запрещает `CLAUDE.md`.

**Оговорка.** Инструменты MCP становятся доступны только в новой сессии Claude Code. Поэтому в этом аудите те же движки использовались напрямую:

| Часть аудита | Чем проверено |
|---|---|
| Сценарии | Playwright по методике webapp-testing |
| Производительность | Lighthouse (движок Chrome) |
| Код | навык web-design-guidelines |
| Дизайн | критерии плагина frontend-design |

## Что проверено и в порядке
- **Горизонтальная прокрутка и выход контента за край:** нет. 5 страниц × 1440/768/375 × UK/EN/RO, 45 прогонов на живом превью.
- **Разметка:** у всех `<img>` есть `width`/`height`, у кнопок-иконок — `aria-label`. Заголовки идут по порядку, один `h1` на страницу.
- **`<head>` и мелкие правила:** `theme-color` и skip-link есть, зум не запрещён, `outline:none` нигде нет.
- **Движение и шрифты:** `prefers-reduced-motion` соблюдается, критичные шрифты подгружаются заранее.
- **Lighthouse mobile на GitHub Pages** (3 прогона, Perf):

  | Страница | Perf | LCP |
  |---|---|---|
  | главная | 95–100 | 1,7–2,5 с |
  | `/courses` | 100 | ≈1,5 с |
  | `/food` | 98 / 100 / 88 (один прогон: TBT 380 мс, разовый всплеск) | 1,8–2,6 с |
  | `/donation` | 100 | ≈1,5 с |

  Доступность, рекомендации и SEO — 100 везде.

## Находки (web-design-guidelines + Lighthouse + сценарии)

**Средние**
- `index.html:359` — ссылки атрибуции «1», «2»: `aria-label` не содержит видимый текст (Lighthouse label-content-name-mismatch).
- `assets/avatar.js:45` — видео аватара `loop` без паузы (движение > 5 с без управления; аватар засыпает через 60 с).
- `assets/avatar.css:77` — `transition: all` → перечислить свойства.
- `assets/style.css:161`, `assets/style.css:204`, `assets/avatar.css:103` — нет `overscroll-behavior: contain` у лайтбокса, окна оплаты и окна чата.
- `index.html:264`, `index.html:272`, `assets/style.css:444` — текстовые ссылки-действия высотой 21 px (< 24 px).
- `assets/style.css:933` — кнопки языков 34×40 на 375 (< 44 px).

**Мелкие**
- `index.html:368` — у iframe карты Google нет видимого фокуса.
- `assets/style.css:11` — нет `touch-action: manipulation` и `-webkit-tap-highlight-color`.
- `assets/style.css:401`, `assets/style.css:526` — `text-wrap: balance` только на заголовках главной.
- `assets/style.css:603`, `assets/style.css:672` — меняющиеся цифры `/food` без `tabular-nums`.
- `assets/food.js:11` — ручное форматирование чисел вместо `Intl.NumberFormat`.
- `assets/avatar.js:236-260` — проверка «гасить аватар» на каждом кадре скролла читает layout (лучше IntersectionObserver).
- `assets/avatar.js:28`, `index.html:72` — нет `translate="no"` у мантры и названия ISKCON.
- `/courses` — Lighthouse: экономия на картинках ≈117 КБ (обложки книг, фото курсов; проверить `sizes`).
- **Кэш:** GitHub Pages — 10 минут (≈275 КБ на повторном визите); на живом Apache настраивается сервером.
- **Мёртвый CSS** `.sobor*` и `.rating` (Lighthouse: 11–13 КБ неиспользуемого CSS).

**Правило проекта (`DESIGN.md`), не Vercel**
- CSS `ease` в `assets/style.css:104`, `153`, `206`, `280`, `284`, `290` и в большей части `assets/avatar.css` — старый код.

## Дизайн по критериям frontend-design
- **Палитра.** Кремовый фон + засечки + терракотовый акцент плагин называет признаком шаблонного дизайна, но это утверждённая палитра `DESIGN.md`; по правилам самого плагина бриф важнее. Не менять.
- **Типовые приёмы.** «→» в конце ссылок, строки через « · », одинаковое появление каждой секции (`.reveal`). Вопрос вкуса; можно оставить одно акцентное движение («дыхание алтаря»).

## Не проверено
- **MCP-инструменты** напрямую (нужен перезапуск сессии); трассировка через Chrome DevTools MCP — после него.
- **Правила текстов Vercel** (Title Case, второе лицо) — для английского, к украинским текстам-инвариантам не применялись.
- **Реальные устройства** iPhone/Android.
