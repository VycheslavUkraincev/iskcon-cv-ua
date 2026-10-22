# Пошаговый план для владельца сайта: Claude Code + GitHub + новая версия сайта
Дата: 22.10.2026. Парная часть со стороны Прабху: дать Muse (Прабху) доступ к GitHub — см. шаг 1.

## Что мы уже исследовали (6 исследований, папка research/)
1. Исходник сайта: 4 страницы, словарь i18n UK/EN/RO, дубли страниц, вес медиа, инварианты.
2. Отзывы общины: 11 пунктов, P0 — обрезанный/непереводимый логотип «Їжа життя», шапка и фон hero, заблокированные Google-формы.
3. Awwwards-бенчмарк: 12 референсов (музеи, благотворительность, wellness), готовый DESIGN.md: палитра, шрифты, motion, один signature-эффект «Дыхание алтаря».
4. Экосистема Claude Code: что ставить, что нет (ниже), порядок работы, модели Opus 5.5 / Sonnet 5.5 / Haiku 5.5.
5. Higgsfield: 5 готовых промптов видео-ассетов, веб-экспорт, бюджеты кредитов, ограничения.
6. Пути клонирования: выбран основной путь A (клон gh-pages → ветка → Claude Code), клонеры отвергнуты как основа.

## ШАГ 1. Доступы (делаем сейчас)
- Ты: открыть карточку «Select repositories» в чате с Прабху, выбрать репозиторий iskcon-cv-ua для приложения Muse — это даёт Прабху доступ на запись (раньше был только read, пуш падал с 403). Вернуться в чат и сказать «готово».
- Ты (для себя): тот же GitHub-аккаунт VycheslavUkraincev использовать в Claude Code, ничего отдельного не нужно.

## ШАГ 2. Установить Claude Code у себя
1. Установить Node.js 22+ (если ещё нет) и Claude Code по официальной инструкции Anthropic.
2. Залогиниться тем аккаунтом, где есть подписка с Opus 5.5.
3. Проверка: в терминале `claude --version` и внутри сессии `/model` — выбрать Opus 5.5 для дизайна и главной страницы.

## ШАГ 3. Создать на GitHub место для новой версии (проект)
Рекомендация из исследования 6: новая версия живёт НЕ в основном репозитории до приёмки.
1. Создать НОВЫЙ приватный/публичный репозиторий-превью, напр. `iskcon-cv-ua-v2-preview` (на GitHub: New repository). В него будет деплоиться GitHub Pages превью с noindex, чтобы поисковики не увидели дубль.
2. В основном репозитории iskcon-cv-ua работа идёт веткой `mockup-v2` от актуальной `gh-pages` (не от main!).
3. (По желанию) GitHub Project (доска) на основной репозиторий: колонки Backlog / In progress / Review / Done, карточки = пункты бэклога FB-01…FB-11 из research/02. Это трекинг, а не код.

## ШАГ 4. Клонировать и подготовить проект локально
```bash
git clone https://github.com/VycheslavUkraincev/iskcon-cv-ua.git
cd iskcon-cv-ua
git checkout gh-pages
git checkout -b mockup-v2
git tag pre-redesign-snapshot
```
Положить в корень проекта файлы, которые подготовил Прабху:
- `CLAUDE_CODE_PROMPT_opus55_mockup-v2.md` (главный промпт, оттуда блок «ШАГ 1» вставить в Claude Code)
- выдержки DESIGN.md из research/03, бэклог из research/02, реестр ссылок SITE_SOCIAL_VIDEO_REGISTRY.md

## ШАГ 5. Установить в Claude Code — СТАВИМ
```bash
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-plugins-official   # база вкуса Anthropic (или npx skills add anthropics/skills --skill frontend-design, только один способ)
npx impeccable install                                     # драйвер: /impeccable init (brand), document, critique, audit, animate, polish
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"   # только redesign-existing-projects
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code     # проверяющий, не строитель
/plugin marketplace add greensock/gsap-skills              # только core/timeline/scrolltrigger/plugins/performance
npx skills add https://github.com/anthropics/skills --skill webapp-testing               # скриншоты 1440/768/375 и самопроверка
# Higgsfield — позже, отдельно: npm i -g @higgsfield/cli ; higgsfield auth login ; npx skills add higgsfield-ai/skills
```

## ШАГ 6. НЕ УСТАНАВЛИВАТЬ (исследовано, причины)
| Что | Почему нет |
|---|---|
| react-best-practices (Vercel) | Сайт — vanilla HTML, React нет, применять не к чему |
| gsap-react, gsap-frameworks | Та же причина; GSAP подключаем vendor/CDN, не npm |
| 21st.dev Magic MCP (теперь 21st MCP) | Каталог React/Tailwind-компонентов, старые ключи сброшены, сайту не подходит |
| superpowers | Второй планировщик: конфликтует с impeccable shape/craft и жжёт токены; нужен для больших TDD-фич, не для макета |
| Figma MCP | Отложить: Figma-макета пока нет. Появится — подключим одним способом, не двумя |
| Playwright MCP дублем к webapp-testing | Два скриншот-инструмента одновременно не нужны; webapp-testing — основной, MCP — только если его не хватит, и с закреплённой версией, не @latest |
| URL-клонеры как основа (Repaint, Capacity, Hostinger Cloner) | Не видят i18n-словарь, теряют формы/платежи/аналитику, уводят на чужой хостинг и в React. AIDesigner — только запасной генератор альтернативных hero |
| Soul ID (Higgsfield) | Требует 20+ фото одного человека и его согласие; волонтёров и получателей помощи так обрабатывать нельзя |
| Taste-скилы кроме redesign | Greenfield-варианты будут «изобретать» сайт заново и сломают URL, тексты и i18n |

## ШАГ 7. Работа срезами (в Claude Code, по главному промпту)
1. Hero главной + новая шапка → скриншоты 1440/768/375 → /impeccable critique.
2. Главная целиком → 3. /courses → 4. /food (логотип-фикс P0, видео Шпальта сохранить) → 5. /donation.
После каждого среза: diff URL (пустой), проверка i18n-ключей, платёжных ссылок и контактов из реестра.

## ШАГ 8. Higgsfield (отдельный шаг, после утверждения макетов)
Пилот: только hero-loop алтаря (A) и лампа (D1), потолок ~400 кредитов, цена серии — до запуска. Исходники: выровненное фото алтаря и предметные фото в полном разрешении. Готовые промпты — research/05_higgsfield_assets.md.

## ШАГ 9. Публикация превью и приёмка
1. Запушить mockup-v2, выложить копию в репозиторий-превью, включить там GitHub Pages, проверить noindex.
2. Приёмка по воротам из главного промпта: URL, i18n (3 языка), платежи, видео, контраст 4.5:1, скриншоты трёх ширин.
3. Решение владельца: мердж в gh-pages основного репозитория (боевой сайт) — только после приёмки. Откат: тег pre-redesign-snapshot.

## Что прислать Прабху, чтобы разблокировать всё до конца
- «Готово» по доступу GitHub (шаг 1).
- URL двух Google-форм Анади Кришны.
- Исходные фото в полном разрешении (алтарь, Їжа життя без крупных лиц, лампа/книга).
- Решение по подписке Higgsfield и лимиту пилота.
