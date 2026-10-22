# Исследование 04. Экосистема Claude Code для редизайна уровня Awwwards

Дата проверки: 2026-10-22. Метод: веб-поиск по официальным репозиториям и свежим (июнь-октябрь 2026) сравнительным обзорам, команды установки сверены дословно с источниками, ссылки в конце файла.

Объект: `iskcon.cv.ua` / репозиторий `VycheslavUkraincev/iskcon-cv-ua`. Это **статичный HTML/CSS/JS на GitHub Pages, без сборки, без `package.json`, без React/Next.js**. Этот факт - главный фильтр всего исследования: половина популярного стека рассчитана на React и для этого проекта либо бесполезна, либо вредна (агент начнёт предлагать миграцию на React/Tailwind, которая не нужна для второго макета).

---

## 0. Уточнение модели: что значит «opus .5.5»

Пользователь писал «opus .5.5». По поиску на октябрь 2026 это читается однозначно как **Claude Opus 5.5**, а не Opus 4.5:

- Opus 5.5 вышел 22 сентября 2026, это первая модель семейства Claude 5.5, Anthropic рекомендует её как модель по умолчанию для большинства задач, цена API $4 / $20 за млн входных/выходных токенов, контекст 1M, максимум вывода 128K.
- Sonnet 5.5 вышел 28 сентября 2026 ($2 / $10), Haiku 5.5 - 7 октября 2026 ($0.10 / $0.50).
- Opus 4.5, Opus 4.6, Sonnet 4.5 к этому моменту уже выведены в legacy и сняты с ряда платформ (волна ретайрмента 1 сентября 2026). Ставить задачу на Opus 4.5 в октябре 2026 - значит работать на уходящей модели.

**Рекомендуемое распределение моделей в этом проекте:**

| Модель | Для чего в редизайне |
|---|---|
| **Opus 5.5** | Главные проектные решения: `/impeccable init/document`, выбор эстетического направления, архитектура главной страницы, GSAP-сценарий скролла. Долгие агентные прогоны - его прямое позиционирование |
| **Sonnet 5.5** | Рутина после утверждения направления: остальные страницы (`courses`, `food`, `donation`) по готовому шаблону, скриншот-циклы, `polish`-итерации. Быстрее и вдвое дешевле, на Terminal-Bench в источниках даже выше Opus |
| **Haiku 5.5** | Подзадачи-суб-агенты: инвентаризация контента, выгрузка текстов/ссылок, классификация отзывов. Не для открытого дизайна |

Нюанс, который стоит знать до старта: у Opus 5.5 нельзя отключить thinking (запросы с отключённым thinking возвращают ошибку), а запросы с кибер-флагом автоматически перебрасываются на Opus 4.8. Для редизайна статичного сайта ни то, ни другое не мешает.

Источники: https://powerdrill.ai/blog/claude-opus-5-5 , http://pandromeda.com/ai/claude-haiku-55-vs-sonnet-55-vs-opus-55-price-speed-uses , https://www.michaelleung.info/latest-news/claude-models-compared-haiku-sonnet-opus-fable-2026

---

## 1. Сводный вердикт: что брать, что пропустить

| # | Инструмент | Вердикт для статичного HTML | Роль |
|---|---|---|---|
| 1 | Anthropic `frontend-design` | **БРАТЬ (база, один канал установки)** | Анти-«AI slop» направление: типографика, палитра, одна эстетическая ставка до кода |
| 2 | `impeccable` (pbakaus) | **БРАТЬ (главный драйвер)** | Держит контекст проекта в `PRODUCT.md`/`DESIGN.md`, 23-24 команды: init, document, critique, audit, animate, polish |
| 3 | Taste Skill: `redesign-existing-projects` | **БРАТЬ ТОЧЕЧНО (только redesign, не весь пак)** | Аудит существующего сайта перед изменениями, режимы Preserve/Overhaul, защита URL/навигации/форм |
| 4a | Vercel `web-design-guidelines` | **БРАТЬ (только как проверяющий)** | Предсдаточный аудит по 100+ правилам: доступность, фокусы, формы, анимация, типографика |
| 4b | Vercel `react-best-practices` | **ПРОПУСТИТЬ** | Правила перформанса React/Next.js (водопады запросов, ре-рендеры, бандл). В проекте нет React, применять не к чему |
| 5 | GSAP skills (greensock) | **БРАТЬ ЧАСТИЧНО (4-5 из 8 модулей)** | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-performance`. Пропустить `gsap-react` и `gsap-frameworks` |
| 6 | `webapp-testing` + Playwright MCP | **БРАТЬ (одно из двух как основное)** | Скриншот-цикл самопроверки на 3 брейкпоинтах, самый большой множитель качества по обзорам |
| 7a | Figma MCP | **ОТЛОЖИТЬ (фаза 2, по условию)** | Нужен только если появится Figma-макет для согласования или дизайнер в команде |
| 7b | 21st.dev Magic MCP → теперь 21st MCP | **ПРОПУСТИТЬ** | Каталог из 10 000+ React/Tailwind компонентов. Для vanilla-сайта - только источник вдохновения глазами, не код |
| 8 | `superpowers` (obra) | **ПРОПУСТИТЬ для этого макета** | Методология brainstorm→plan→TDD→review. Для визуального редизайна это накладные расходы и конфликт с `impeccable shape/craft` |

Принцип, который повторяют сразу несколько обзоров и который задаёт всю архитектуру стека: **один строитель, один проверяющий** (one builder, one checker). Два «вкусовых» скила, работающих одновременно как строители, тянут страницу в разные стороны.

---

## 2. Разбор по позициям

### 2.1. Anthropic `frontend-design` - база, ставить первым

Что это: официальный скил Anthropic, один `SKILL.md`. Перед написанием кода заставляет агента зафиксировать направление: назначение, тон (brutalist, editorial, luxury, organic и т.д.), ограничения, точку отличия. Запрещает заезженные шрифты (Inter, Roboto, Arial, системные), фиолетовые градиенты на белом и предсказуемые сетки карточек. Отдельно важно для нас: скил **поддерживает vanilla HTML/CSS/JS** наряду с React и Vue, для HTML предписывает CSS-only моушен.

Установка, два официальных канала, **выбрать только один** (см. риски дублей в разделе 4):

Канал A, плагин Claude Code (внутри сессии Claude Code):
```
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-plugins-official
```

Канал B, skills CLI (из терминала, в папку проекта):
```
npx skills add anthropics/skills --skill frontend-design
```
Вариант той же команды из обзоров: `npx skills add https://github.com/anthropics/skills --skill frontend-design`

Ограничения, о которых предупреждают тесты: скил хорош на одном экране, но не держит консистентность между многими экранами и не читает бренд-токены проекта - он каждый раз изобретает визуальную идентичность заново. Именно этот пробел закрывает impeccable с его `DESIGN.md`, поэтому пара frontend-design + impeccable, а не один frontend-design.

Источник установки и рекомендации «если ставить одно - это, если два - плюс impeccable»: https://ruoqijin.com/blog/frontend-design-skills-ai-agents

### 2.2. `impeccable` - главный драйвер редизайна существующего сайта

Что это: скил Paul Bakaus, выросший из frontend-design. Даёт агенту дизайн-словарь и, главное, **долговременную память проекта в двух файлах**:

- `PRODUCT.md` - кто пользователи, какую задачу решает экран, режим поверхности, анти-референсы.
- `DESIGN.md` - цвета, шкала типографики, радиусы, правила бренда, варианты компонентов, которые агент обязан переиспользовать.

Режимы: при инициализации спрашивает, поверхность **brand** (маркетинг, лендинг, портфолио) или **product** (приложение, дашборд). Для iskcon.cv.ua правильный ответ - **brand**. Внутри команд поверхность дополнительно классифицируется как Persuade / Operate / Read / Experience; главная страница храма - это Persuade + Experience.

Установка (выбрать один способ на машину, чтобы скил не «расползался» между агентами):
```
npx impeccable install
```
или
```
/plugin marketplace add pbakaus/impeccable
```
или
```
npx skills add pbakaus/impeccable
```
Обновление потом: `npx impeccable update`

Команды, релевантные этому проекту (всего 23-24, в источниках счёт слегка расходится между версиями):

| Этап | Команда | Что делает |
|---|---|---|
| Старт | `/impeccable init` | Интервью о продукте, пишет `PRODUCT.md` и `DESIGN.md`, настраивает live-режим |
| Старт по существующему коду | `/impeccable document` | Генерирует `DESIGN.md` из существующего кода проекта |
| Планирование | `/impeccable shape` | UX/UI-бриф до кода |
| Оценка | `/impeccable critique` | UX-разбор: иерархия, ясность, эмоциональный резонанс, эвристические оценки |
| Оценка | `/impeccable audit` | Технические проверки: доступность, перформанс, адаптивность + детектор анти-паттернов (в разных версиях 27-61 правило: пухлые градиенты, тонкая рамка + широкая тень, заезженные шрифты, тесная вёрстка, низкий контраст) |
| Усиление | `/impeccable animate` | Осмысленный моушен |
| Усиление | `/impeccable typeset`, `/impeccable layout`, `/impeccable colorize`, `/impeccable bolder`, `/impeccable quieter`, `/impeccable distill`, `/impeccable delight`, `/impeccable overdrive` | Точечные проходы: типографика, сетка, цвет, смелость, упрощение, «моменты радости», экстраординарные эффекты |
| Финиш | `/impeccable polish` | Финальный проход по дизайн-системе, убирает «AI tells», перепрогоняет детектор до нуля находок |
| Прочее полезное | `/impeccable harden`, `/impeccable adapt`, `/impeccable optimize`, `/impeccable clarify`, `/impeccable live` | Краевые случаи и i18n (для нас: укр/рум/англ версии), адаптация под устройства, перформанс, UX-тексты, визуальные варианты в браузере |

Правило правды внутри impeccable, важное для сайта общины: бриф побеждает вкус скила, а фактический текст нельзя заменять или дополнять утверждениями без спроса. Для сайта, где нельзя выдумывать расписание, адреса и реквизиты пожертвований, это прямое попадание.

Источники: https://www.uwarp.design/blog/impeccable-skill-frontend-design-guide , https://dev.to/skillgild/impeccable-skill-for-claude-code-24-design-commands-tested-12mm , https://www.mdskills.ai/plugins/impeccable

### 2.3. Taste Skill и `redesign-existing-projects` - аудит существующего, а не генерация нового

Что это: пак скилов Leonxlnx/taste-skill. Главный скил `design-taste-frontend` управляется тремя «ручками» 1-10:

- `DESIGN_VARIANCE` - от ровной центрированной сетки (1) до смелой асимметрии (10), по умолчанию 8.
- `MOTION_INTENSITY` - от hover-эффектов (1) до магнитных и scroll-анимаций (10), по умолчанию 6.
- `VISUAL_DENSITY` - от воздушного люкса (1) до плотного дашборда (10), по умолчанию 4.

Для храма дефолты надо сознательно увести: ориентир для брифа - **variance 6-7, motion 4-5, density 2-3** (воздух, покой, одно движение вместо десяти). Ручки задаются в промпте, а не правкой файла скила: отредактированная копия `SKILL.md` не проходит drift-check и слетает при обновлении.

Для нашего случая нужен не главный скил, а специализированный:

- `redesign-skill`, install name **`redesign-existing-projects`**: сначала аудит существующего UI, потом правки layout, отступов, иерархии, стилей.
- Он определяет режим работы: Greenfield / **Preserve** / **Overhaul**, и содержит список того, что **никогда не меняется молча**: структура URL, подписи главной навигации, имена и порядок полей форм, логотип/вордмарк, юридические и consent-тексты, плюс якорные ID секций, на которых висит аналитика. Для живого сайта на GitHub Pages с формами регистрации и страницей пожертвований это критично.
- Соседние скилы пака (`minimalist-ui`, `high-end-visual-design` / soft, `industrial-brutalist-ui`, `image-to-code`) для этого проекта не нужны, ставить весь пак - лишняя нагрузка на контекст.

Установка (только один скил, не весь репозиторий):
```
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add https://github.com/Leonxlnx/taste-skill
```
Вторая команда ставит весь набор, её здесь использовать **не** рекомендуется; точечный вариант для redesign берётся тем же механизмом со `--skill redesign-existing-projects` (имя скила подтверждено каталогом скилов пака).

**Главная адаптация под vanilla.** У Taste Skill нет non-React пути: части про React приходится перепроговаривать в каждом брифе и проверять сгенерированный моушен-код руками. Лечение, рекомендованное самим обзором экосистемы: блок исключений кладётся не в скил, а в `CLAUDE.md` проекта. Для iskcon.cv.ua этот блок должен выглядеть примерно так (заполнить после исследования исходника):

```markdown
## Frontend design exceptions (read with the design-taste-frontend skill)
- Stack: vanilla HTML/CSS/JS, GitHub Pages, no build step, no package.json. Ignore the React-specific parts of §3 and §5.
- Do not add React, Tailwind, shadcn or any framework. CSS in the existing stylesheet structure, JS in vanilla.
- Icons: no lucide-react. Use inline SVG already present in the project.
- Libraries allowed via CDN/local vendor files only: GSAP + ScrollTrigger.
- Do not silently change: URL structure, main navigation labels, form field names and order, logo, donation details, legal copy, section anchor IDs.
```

Ещё одна честная цифра из источников: полный прогон taste-skill на лендинг занимает примерно 30-45 минут и несколько сотен тысяч токенов. Это инструмент на один большой прогон главной, а не на мелкие правки.

Источники: https://developertoolkit.ai/en/ecosystem/skills/taste-skill/ , https://www.claudemod.com/mods/taste-skill , https://www.claudecodeclub.ai/free-resources/claude-design-skills

### 2.4. Vercel: `web-design-guidelines` брать, `react-best-practices` пропустить

`web-design-guidelines` (vercel-labs/agent-skills):

- Что делает: ревьюит UI-код по Web Interface Guidelines Vercel, 100+ правил: доступность, состояния фокуса, формы, анимация, типографика, изображения, перформанс, навигация, тёмная тема, тач, локализация. Вывод - короткие находки формата `file:line`, сгруппированные по файлу. Это **проверяющий, а не строитель**, поэтому конфликта с impeccable/frontend-design нет, его место - предсдаточный проход.
- Механика, которую надо знать: в самом `SKILL.md` правил нет, он приказывает агенту **перед каждым ревью скачивать актуальные правила по URL**. Следствия: нужен доступ в сеть на прогоне; правила не запинены и могут измениться между прогонами; в офлайн/CI-песочнице скил загрузится, но проверять будет не по чему.

Установка:
```
npx skills add vercel-labs/agent-skills
```
Точечно, как рекомендует CLI:
```
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
```
Ручной вариант из репозитория: клонировать `vercel-labs/agent-skills` и `cp -r skills/web-design-guidelines ~/.claude/skills/`.

`react-best-practices` (тот же репозиторий, установка вида `npx skills add vercel-labs/agent-skills@react-best-practices`):

- **Пропустить.** Это 40-70 правил перформанса именно React и Next.js: устранение водопадов запросов, размер бандла, ре-рендеры, серверные компоненты. В статичном HTML не к чему применить ни одно. Побочный вред: установленный скил будет подталкивать агента к React-советам и займёт место в бюджете контекста скилов. Вернуться к нему имеет смысл только если когда-нибудь будет принято отдельное решение о миграции сайта на Next.js/Astro, а это не задача второго макета.

Источники: https://uichemy.com/design-skills/web-design-guidelines/ , https://github.com/vercel-labs/skills , https://skillselion.com/skills/vercel-labs/agent-skills/web-design-guidelines

### 2.5. Официальные GSAP skills - брать, но не все модули и не npm

Что это: официальные скилы GreenSock (`greensock/gsap-skills`), учат агента корректному современному GSAP: API, таймлайны, ScrollTrigger, плагины, перформанс-паттерны. Это скил-инструкции, а не MCP-сервер: процесс не поднимает, контекст ест только при работе с анимацией. Все плагины GSAP, включая SplitText, MorphSVG, DrawSVG и CustomEase, после поглощения Webflow бесплатны, скил это учитывает.

Установка:
```
/plugin marketplace add greensock/gsap-skills
```
или
```
npx skills add https://github.com/greensock/gsap-skills
```
или вручную: клонировать репозиторий и скопировать папки из `skills/` в `~/.claude/skills/`.

Модули, всего 8:

| Модуль | Вердикт | Зачем |
|---|---|---|
| `gsap-core` | Брать | `gsap.to/from/fromTo`, easing, stagger, defaults |
| `gsap-timeline` | Брать | Секвенции, labels, вложенность - сценарий появления hero |
| `gsap-scrolltrigger` | Брать, ключевой | Scroll-связанные анимации, pinning, scrub, refresh и cleanup. Именно scroll-owned моушен, а не автоплей при загрузке, отличает Awwwards-уровень |
| `gsap-plugins` | Брать | SplitText, CustomEase (ручные `cubic-bezier` вместо дефолтных), ScrollToPlugin, Flip, Observer |
| `gsap-performance` | Брать | Трансформы вместо layout-свойств, `will-change`, батчинг, 60 fps |
| `gsap-utils` | По желанию | `clamp`, `mapRange`, `interpolate`, `snap` - мелкая математика анимаций |
| `gsap-react` | **Пропустить** | `useGSAP`, refs, SSR-cleanup. React в проекте нет |
| `gsap-frameworks` | **Пропустить** | Жизненный цикл Vue/Svelte. Не наш стек |

**Адаптация под GitHub Pages без сборки:** в репозитории нет `package.json`, поэтому в `CLAUDE.md` надо прямо запретить агенту делать `npm install gsap` и `@gsap/react` (именно эти команды предлагает react-модуль скила). Подключение для статики - только локальные vendor-файлы в ассетах сайта или CDN-`<script>` теги GSAP + ScrollTrigger, регистрация плагина один раз, обязательный сценарий `prefers-reduced-motion` и очистка триггеров. Все анимации - на `transform`/`opacity`, не на `top/left/width`.

Источники: https://github.com/greensock/gsap-skills , https://mustaphaalaoui.tech/how-to-use-gsap-withclaude-code-the-right-way/

### 2.6. Playwright: `webapp-testing` skill и/или Playwright MCP - цикл самопроверки

Зачем: это то, что превращает «агент написал код» в «агент увидел результат». Обзор стека прямо называет скриншот-цикл самым большим одиночным множителем качества: агент делает скриншоты на брейкпоинтах и сам исправляет вёрстку.

Вариант 1, скил Anthropic `webapp-testing` (рекомендуется как основной для статики):

- Набор для тестирования локальных веб-приложений на Playwright: агент пишет нативные Python-скрипты Playwright, проверяет функциональность, снимает скриншоты браузера, смотрит логи.
- Установка:
```
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```
Вариант из каталога скилов: `npx -y skills add anthropics/skills --skill webapp-testing --agent claude-code`
- Плюс для нас: скрипты остаются в репозитории как воспроизводимая проверка, подходят для статичного сайта, поднятого локальным сервером.

Вариант 2, Playwright MCP (Microsoft) через официальный плагин Anthropic:

```
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install playwright@claude-plugins-official --scope project
```
Внутри сессии то же самое слэш-командами `/plugin marketplace add anthropics/claude-plugins-official` и `/plugin install playwright@claude-plugins-official`. Ручная альтернатива без плагина:
```
claude mcp add playwright npx @playwright/mcp@latest
```
- MCP видит страницу не пикселями, а accessibility-tree снапшотом, это детерминированно и удобно для кликов/форм, но снапшот платится токенами на каждом ходу. Для визуальной оценки дизайна всё равно нужны скриншоты.
- Риск воспроизводимости: плагин и ручная команда ссылаются на тег `@latest` пакета `@playwright/mcp`, поведение может меняться между запусками. Для командной работы версию надо пинить.

**Рекомендация:** не ставить оба сразу. Начать с `webapp-testing` (легче, скрипты в репо, достаточно для «сделал страницу - снял 1440/768/375 - сравнил с эталоном - поправил»). Playwright MCP добавить только если понадобится интерактивная разведка: пройти форму регистрации, проверить мобильное меню кликами в живом диалоге с агентом.

Рабочий цикл для каждой страницы макета:
1. Поднять статику локально (например, `python3 -m http.server` из корня клона ветки макета).
2. Скриншоты до изменений (базовая линия актуальной `gh-pages`).
3. После правок: те же 3 ширины, полная высота страницы + первый экран отдельно.
4. Сравнение агентом: переполнения, обрезанный логотип, читаемость текста на фоне, зоны нажатия, горизонтальный скролл на 375.
5. Правки только по находкам, повторный снимок. Стоп-условие: нет визуальных регрессий против базовой линии, кроме запланированных.

Ценник внимания: по замерам профильного скила скриншотов, один снимок стоит порядка 5-7K токенов в существующей беседе, три размера - 8-10K, полная проверка страницы - 12-18K. Поэтому снимать только нужные размеры и давать агенту конкретный URL, а не «найди страницу сам».

Источники: https://claudeskills.info/plugins/anthropics/claude-plugins-official/playwright/ , https://www.skillsdirectory.com/skills/anthropics-webapp-testing , https://shipyard.build/blog/playwright-mcp-screenshots/ , https://bug0.com/blog/playwright-cli-vs-playwright-mcp-ai-browser-testing-2026

### 2.7. Figma MCP и 21st.dev: релевантность для статичного сайта низкая

**Figma MCP - отложить до появления Figma.**

- Подключение, рекомендуемый путь - плагин из официального маркетплейса:
```
claude plugin install figma@claude-plugins-official
```
- Ручная альтернатива (использовать одно или другое, **не оба**):
```
claude mcp add --transport http figma https://mcp.figma.com/mcp
```
Для всех проектов: `claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp`. Затем новая сессия, `/mcp`, выбрать figma, Authenticate.
- Что даёт: агент читает реальные фреймы, переменные и компоненты, а не гадает по скриншоту; есть скилы implement-design и Code Connect.
- Почему не сейчас: в проекте нет Figma-файла, дизайн рождается сразу в коде через impeccable. Выход Figma MCP по умолчанию - React + Tailwind, для vanilla его надо инструктировать «воспринимай вывод как описание дизайна, а не финальный код» (это прямо пункт шаблонных правил Figma для `CLAUDE.md`). Плюс лимиты: на Starter и View/Collab местах порядка 6 вызовов в месяц, для реальной работы нужен Dev/Full seat платного плана.
- Условие включения (фаза 2): если Анади Кришна или дизайнер общины принесёт макет в Figma для согласования до кода, или если захотим выгрузить готовый макет обратно в Figma редактируемыми слоями (`generate_figma_design`). Тогда, и только тогда, ставить.

Источники: https://github.com/figma/mcp-server-guide , https://dev.to/juholee/figma-mcp-claude-code-give-it-your-real-layout-variables-and-components-497m

**21st.dev Magic MCP - пропустить, переименован и не про наш стек.**

- Актуальное состояние: Magic MCP заменён единым **21st MCP**, старые API-ключи Magic сброшены, новый ключ получается на 21st.dev/mcp.
- Установка нового: `npx @21st-dev/cli@latest init --client claude` (в команде `--client cursor | claude | vscode | windsurf | codex`).
- Старая установка, ещё встречающаяся в гайдах: `npx @21st-dev/cli@latest install <client> --api-key <key>`, клиенты `cursor`, `windsurf`, `cline`, `claude`.
- Что умеет: поиск по 10 000+ компонентов и генерация UI. Проблема одна: это **React/Tailwind компоненты**, и сам сервис описывает результат как «React component in your codebase». В статичный HTML такой компонент не вставишь без переписывания руками, то есть выигрыша против impeccable + frontend-design нет, а соблазн притянуть Tailwind/React в проект есть.
- Допустимое использование без установки: посмотреть каталог глазами как доску вдохновения для отдельных блоков (галерея, расписание, карточки программ), а реализацию делать vanilla-скилами.

Источники: https://github.com/21st-dev/magic-mcp , https://glama.ai/mcp/servers/21st-dev/magic-mcp

### 2.8. `superpowers` - не нужен для этого макета

Что это: плагин obra, методология разработки полным циклом: brainstorming до любой креативной работы, написание плана/спеки, TDD (RED-GREEN-REFACTOR, код, написанный до теста, удаляется), систематическая отладка, код-ревью между задачами, аккуратное завершение ветки. Агенты по нему могут автономно работать пару часов, не уходя от утверждённого плана.

Установка, если когда-нибудь понадобится:
```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```
Обновление: `/plugin update superpowers`

Почему пропустить здесь:

- Задача - один визуальный макет поверх готовой статики, а не многофайловая фича с тестами. Свежие гайды прямо относят «быструю стилизацию и одноразовые прототипы» к случаям «нет», а многофайловые фичи и долгие автономные прогоны - к «да».
- Конфликт методологий: superpowers навязывает свою фазу brainstorm/plan, impeccable - свою (`shape`/`craft`). Два планировщика в одном проекте дерутся, обзоры предупреждают: если в репо уже есть своя строгая workflow-система скилов, overlapping skills fight each other, выбирается одна.
- Токены: subagent-driven режим superpowers - самый тщательный и самый токен-жадный. Для итераций «подвинь hero, покажи скриншот» это чистый оверхед, дешевле встроенный Plan Mode Claude Code.
- Когда пересмотреть: если второй макет вырастет в полноценную пересборку сайта с формами, мультиязычностью и тестами на формы, тогда superpowers имеет смысл как отдельный эксперимент в отдельном профиле, а не поверх дизайн-стека.

Источники: https://www.developersdigest.tech/blog/claude-code-superpowers-plugin-guide , https://www.trevorlasn.com/blog/superpowers-claude-code-skills

---

## 3. Точная последовательность установки (один проход, ничего лишнего)

Предусловия: Node.js 22.20+ (требование skills CLI), Claude Code запущен из корня клона репозитория, работа ведётся в отдельной ветке макета от актуальной `gh-pages`, не в live-ветке.

### Шаг 0. Проверка среды
```
node --version
npx skills list
```
Внутри Claude Code: `/plugin list`, `/mcp`, `/context` (смотреть предупреждения о бюджете скилов).

### Шаг 1. База: frontend-design (только канал A)
```
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-plugins-official
```
Перезапустить сессию Claude Code.

### Шаг 2. Главный драйвер: impeccable (только npx-способ)
```
npx impeccable install
```
Перезапустить сессию. Не дублировать установкой через `/plugin marketplace add pbakaus/impeccable`.

### Шаг 3. Redesign-скил Taste (точечно)
```
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```
Плюс скил `redesign-existing-projects` из того же репозитория тем же механизмом `--skill`. Не ставить весь пак и его стилевые варианты (minimalist/brutalist/soft).

Проверка, что агент видит скилы:
```
ls .claude/skills/
ls ~/.claude/skills/
npx skills list
```

### Шаг 4. Проверяющий: web-design-guidelines
```
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
```
`react-best-practices` на этом шаге **не** ставить, хотя CLI предложит соседние скилы репозитория.

### Шаг 5. GSAP
```
/plugin marketplace add greensock/gsap-skills
```
В брифах ссылаться только на `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-performance`. В `CLAUDE.md` запретить `npm install gsap` (нет сборки), подключение - vendor/CDN.

### Шаг 6. Проверка результатом: webapp-testing
```
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```
Playwright MCP на этом проходе не ставить. Добавить позже при необходимости одной из команд раздела 2.6, и пинить версию пакета вместо `@latest`.

### Шаг 7. Не устанавливать на этом проходе
Figma MCP, 21st MCP, superpowers, react-best-practices, shadcn-скилы. Каждое «не» - сознательное, обоснование в разделах 2.4, 2.7, 2.8.

После каждой группы - перезапуск сессии и проверка `/context`: описания скилов грузятся в контекст с бюджетом около 2% окна (фолбэк порядка 16 000 символов), при переполнении часть скилов молча выпадает.

---

## 4. Порядок запуска в проекте (кто когда работает)

1. **Инвентаризация (Haiku/Sonnet, без дизайн-скилов).** Снять базовые скриншоты `webapp-testing` с актуальной вёрстки: главная, курсы, еда, пожертвования; 1440/768/375.
2. **Контекст (Opus 5.5, impeccable).** `/impeccable init` в режиме **brand**, ответы - из структурированных отзывов общины (исследование отзывов) и аудита исходника: аудитория, главная задача страницы (прийти на программу / записаться / пожертвовать), анти-референсы. Затем `/impeccable document` - зафиксировать текущий `DESIGN.md`, чтобы видеть, от чего уходим.
3. **Аудит перед изменениями (redesign-existing-projects).** Режим: **Preserve** для URL, навигации, форм, якорей и реквизитов; **Overhaul** только для визуального слоя. Сначала audit, потом изменения, это требование самого скила. На выходе - список находок, сверенный с отзывами общины (центрирование, обрезанный логотип, тяжёлая шапка, нечитаемый фон hero и т.д.).
4. **Направление (Opus 5.5, frontend-design + ручки Taste в промпте).** Один промпт: названное эстетическое направление из исследования Awwwards-референсов, `DESIGN_VARIANCE 6-7`, `MOTION_INTENSITY 4-5`, `VISUAL_DENSITY 2-3`, один фирменный эффект на сайт. До кода агент показывает токены и схему первого экрана.
5. **Сборка по страницам (Opus - главная, Sonnet - остальные).** Только vanilla HTML/CSS/JS, токены из `DESIGN.md`, исключения из `CLAUDE.md` (раздел 2.3). GSAP подключается на этом этапе и только на главную: hero-таймлайн + ScrollTrigger-сцены, Higgsfield-видео как фон/вставки по отдельному брифу ассетов, `prefers-reduced-motion` обязателен.
6. **Скриншот-цикл (webapp-testing, после каждой страницы).** Те же 3 ширины, сравнение с базовой линией и с утверждённым направлением, правки по списку, повтор.
7. **Предсдаточные ворота (проверяющие, не строители).** По очереди, по одному за раз: `/impeccable critique` → правки → `/impeccable audit` → `web-design-guidelines` ревью поименованных файлов → `/impeccable polish`, пока детектор не даст ноль необъяснённых находок.
8. **Сдача макета.** Отдельная ветка/превью GitHub Pages, рядом: `PRODUCT.md`, `DESIGN.md`, скриншоты до/после, список того, что сознательно НЕ менялось (URL, формы, реквизиты).

---

## 5. Риски конфликтов и как их гасить

1. **Три вкусовых скила одновременно.** frontend-design, impeccable и taste все запрещают одни и те же вещи (шрифты, градиенты, карточки), но расходятся в позитивных рецептах. Если все три авто-триггерятся на каждую задачу, результат дрейфует от страницы к странице. Лечение: один строитель на фазу (раздел 4), остальных вызывать только по имени и только на их этапе; impeccable - владелец `DESIGN.md`, его токены побеждают.
2. **Двойная установка одного скила двумя каналами.** frontend-design плагином и через `npx skills add`, impeccable через npx и через marketplace - дубли в `.claude/skills/` и `~/.claude/skills/`, неочевидно, какая копия сработала; автономные скилы в `.claude/skills/` имеют приоритет короткого имени над плагинными. Лечение: один канал на скил (зафиксирован в разделе 3), инвентаризация `npx skills list` после установки.
3. **Бюджет контекста скилов.** Описания всех установленных скилов занимают около 2% контекстного окна; при переборе часть скилов исключается без громкой ошибки. Лечение: наш набор намеренно короткий (6 позиций), не ставить «заодно» стилевые варианты taste, shadcn, react-скилы; проверять `/context`.
4. **Правка файлов скилов.** Отредактированный `SKILL.md` taste-скила проваливает drift-check и исчезает при обновлении. Все исключения проекта - только в `CLAUDE.md` и в промптах, файлы скилов не трогать.
5. **React-подталкивание.** taste, Figma MCP, 21st MCP и gsap-react по умолчанию ведут в React/Tailwind. Лечение: блок исключений в `CLAUDE.md` (раздел 2.3), запрет новых фреймворков и npm-установок, ревью диффа на предмет чужих зависимостей перед каждой сдачей страницы.
6. **Незапиненные источники правил.** `web-design-guidelines` каждый раз скачивает правила со свежего URL, Playwright MCP-плагин тянет `@playwright/mcp@latest`. Результат двух одинаковых прогонов в разные дни может отличаться. Лечение: для финального аудита фиксировать дату прогона и сохранять отчёт в репозиторий; версию Playwright MCP пинить.
7. **Скилы - это код третьих лиц.** Официальный маркетплейс Anthropic поддерживается Anthropic, у сторонних маркетплейсов нет формального ревью: плагины могут содержать хуки и MCP-серверы с исполняемым кодом. Лечение: перед установкой просматривать `plugin.json` и скрипты, ставить только перечисленные в разделе 3 репозитории, ничего «похожие наборы всё-в-одном» (пакеты вида 89 агентов/122 скила одной командой в этот проект не идут).
8. **Два планировщика.** superpowers и impeccable `shape/craft` одновременно = два обязательных процесса планирования. Лечение: superpowers в проект не ставим (раздел 2.8).
9. **Выдуманные факты.** Дизайн-скилы склонны дорисовывать рейтинги, цифры и отзывы. Для сайта общины это вопрос доверия. Лечение: правило impeccable «бриф побеждает, факты не выдумывать» продублировать в `CLAUDE.md`: расписание, адреса, реквизиты, цитаты - только из существующего сайта и структурированных отзывов.

---

## 6. Итоговый минимальный стек (шпаргалка одной строкой на инструмент)

```
# Модель: Opus 5.5 (решения) + Sonnet 5.5 (рутина и циклы)
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-plugins-official
npx impeccable install
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"   # + redesign-existing-projects
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
/plugin marketplace add greensock/gsap-skills
npx skills add https://github.com/anthropics/skills --skill webapp-testing
# НЕ ставить: react-best-practices, gsap-react, gsap-frameworks, 21st MCP, superpowers
# ОТЛОЖИТЬ: Figma MCP (claude plugin install figma@claude-plugins-official) - только при появлении Figma-макета
```

---

## Источники (только реальные, проверены поиском 2026-10-22)

- Модели: https://powerdrill.ai/blog/claude-opus-5-5 ; http://pandromeda.com/ai/claude-haiku-55-vs-sonnet-55-vs-opus-55-price-speed-uses ; https://www.michaelleung.info/latest-news/claude-models-compared-haiku-sonnet-opus-fable-2026
- Стек в целом, порядок стадий, «один строитель + проверяющий»: https://ruoqijin.com/blog/frontend-design-skills-ai-agents ; https://web-hobbies.com/en/claude/best-design-skills-for-claude-code/
- frontend-design: https://www.outrightsystems.org/blog/how-to-use-claude-code-frontend-design-plugin/ ; https://deepwiki.com/anthropics/claude-code/4.4-frontend-design-plugin ; https://claudelog.com/faqs/what-is-frontend-design-skill-in-claude-code/
- impeccable: https://www.uwarp.design/blog/impeccable-skill-frontend-design-guide ; https://dev.to/skillgild/impeccable-skill-for-claude-code-24-design-commands-tested-12mm ; https://www.mdskills.ai/plugins/impeccable ; https://www.claudecodeclub.ai/free-resources/claude-design-skills
- Taste / redesign: https://developertoolkit.ai/en/ecosystem/skills/taste-skill/ ; https://www.claudemod.com/mods/taste-skill ; https://medium.com/@leroyleowdev/stop-claude-from-shipping-generic-ai-design-slop-with-taste-skill-de7b7fda916e
- Vercel skills: https://github.com/vercel-labs/skills ; https://uichemy.com/design-skills/web-design-guidelines/ ; https://skillselion.com/skills/vercel-labs/agent-skills/web-design-guidelines ; https://aipicks.dev/en/guides/claude-code-skills-for-frontend/
- GSAP: https://github.com/greensock/gsap-skills ; https://mustaphaalaoui.tech/how-to-use-gsap-withclaude-code-the-right-way/ ; https://deepwiki.com/greensock/gsap-skills/1.1-getting-started-and-installation
- Playwright / webapp-testing: https://claudeskills.info/plugins/anthropics/claude-plugins-official/playwright/ ; https://www.skillsdirectory.com/skills/anthropics-webapp-testing ; https://shipyard.build/blog/playwright-mcp-screenshots/ ; https://bug0.com/blog/playwright-cli-vs-playwright-mcp-ai-browser-testing-2026
- Figma MCP: https://github.com/figma/mcp-server-guide ; https://dev.to/juholee/figma-mcp-claude-code-give-it-your-real-layout-variables-and-components-497m ; https://subagentic.ai/howtos/connect-figma-mcp-server/
- 21st MCP: https://github.com/21st-dev/magic-mcp ; https://glama.ai/mcp/servers/21st-dev/magic-mcp ; https://www.augmentcode.com/mcp/21st-dev-magic-mcp-server
- superpowers: https://www.developersdigest.tech/blog/claude-code-superpowers-plugin-guide ; https://www.trevorlasn.com/blog/superpowers-claude-code-skills ; https://www.mdskills.ai/plugins/superpowers
- Безопасность и контекст плагинов: https://pengen.diewe.workers.dev/gunnargrosch/extending-claude-code-with-plugins-and-skills-for-aws-development-4p9o ; https://dev.to/mech_app_ai/anthropics-official-plugin-directory-what-immutable-slugs-and-auto-migration-teach-about-agent-4cpe
