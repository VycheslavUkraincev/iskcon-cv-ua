# MANIFEST.md — полный экспорт проекта «макет iskcon.cv.ua (mockup-v2)»

**Собрано:** 24.10.2026. **Для кого:** чтобы новый участник получил все данные и то же понимание проекта, что у ведущей сессии Claude Code.
**Источник:** локальный репозиторий `~/projects/iskcon-v2` на компьютере владельца, ветка `mockup-v2` @ `ba2f87b`. Код сайта при экспорте не менялся.

---

## 1. Состав

Ветка `archive-for-prabhu` (отдельная, без общей истории с остальными):

| Файл | Что это |
|---|---|
| `iskcon-v2-workcopy.zip` | Рабочая копия `mockup-v2` целиком, ничего не вычищено (подробно ниже) |
| `project-full.bundle` | Git bundle со всеми ветками, ссылками на ветки GitHub и тегом: полная история |
| `MANIFEST.md` | Этот файл (он же лежит в корне zip) |

**Внутри `iskcon-v2-workcopy.zip`:**

| Путь в архиве | Что |
|---|---|
| `MANIFEST.md` | Этот файл |
| `iskcon-v2/` | Рабочая копия `mockup-v2` @ `ba2f87b`: все 830 файлов, отслеживаемых git. Неотслеживаемых и игнорируемых файлов в рабочей копии нет. Папка `.git` не включена: история лежит в bundle |
| `iskcon-v2/index.html`, `courses/`, `food/`, `donation/`, `*.html`, `404.html`, `assets/`, `favicon.ico`, `robots.txt`, `sitemap.xml` | Код сайта |
| `iskcon-v2/*.md` | Все отчёты: `AUDIT.md`, `SLICE0…8_5_REPORT.md`, `SLICE6/7_DIALOG.md`, `MASTER_REPORT.md`, `IMPROVEMENTS_33.md`, `RECOMMENDATIONS_50.md`, `DECISIONS_REPORT.md`, `FEEDBACK_FIX_REPORT.md`, `FOOD_HERO_TRIM_REPORT.md`, `FORMS_REPORT.md`, `TOOLS_AUDIT.md`, `POLISH_REPORT.md`, `STATUS_PLAN.md`, `PROJECT_FULL_REPORT.md`, `DEVELOPMENT_PLAN.md`, `RESEARCH_CINEMATIC.md`, `CLAUDE.md`, `MEDIA.md`, `README.md`, `URL_BASELINE.txt` |
| `iskcon-v2/docs/` | `handoff/HANDOFF.md` + `handoff/scripts/` (скрипты проверок, `master/`), `prabhu-package/` (пакет исследований и отзывов от 22.10.2026), `brief-claude.md`, `brief-codex.md` |
| `iskcon-v2/.claude/skills/` | `design-taste-frontend`, `gsap-core`, `gsap-performance`, `gsap-plugins`, `gsap-scrolltrigger`, `gsap-timeline`, `impeccable`, `webapp-testing` |
| `iskcon-v2/.agents/skills/` | `frontend-design`; источники и хэши навыков — `skills-lock.json` |
| `iskcon-v2/tools/` | `build-domain.sh` (сборка живого домена), `deploy.sh` (выкладка по SSH) |
| `iskcon-v2/*-screenshots/` | Все папки скриншотов: аудит, срезы 1–8.5, master, decisions, feedback, forms, polish, food-hero-trim |
| `_local-extras/` | Чего нет в репозитории (добавлено для полноты): 6 скриптов, которые есть только в `~/scratch/m/tools` (`forms.js`, `fprev.js`, `hdr.js`, `hdr3.js`, `mapchk.js`, `regr4.js`; остальные скрипты оттуда совпадают с `docs/handoff/scripts/master/`), `package.json` и `package-lock.json` из `~/scratch/tools` |

---

## 2. Ветки и их вершины (tip) на 24.10.2026

| Ссылка | Коммит | Где существует | Что это |
|---|---|---|---|
| `mockup-v2` | `ba2f87b` | локально и на GitHub | Рабочая ветка: сайт + все документы |
| `release-2026-10-23` | `c4a4e1a` | **только на этом компьютере** (и в bundle) | Выпуск: `mockup-v2` @ `43df3fa` без внутренних документов, скриншотов, `docs/` (кроме двух брифов) и `.claude`. По решению владельца на GitHub отдельной веткой **не пушится** |
| `mockup-v2-docs` | `ef3ce81` | **только на этом компьютере** (и в bundle) | Архивная метка документов на момент `ef3ce81` (всё её содержимое есть и в `mockup-v2`) |
| `gh-pages` | `8220cdf` | локально и на GitHub | Источник зеркала GitHub Pages; с начала проекта не менялась |
| `main` | `1fed187` | локально и на GitHub | Устарела, не использовать |
| `origin/domain-sync-2026-10-20` | `588e1f1` | GitHub | Из неё собран нынешний живой сайт; влита в `mockup-v2` в срезе 0 |
| тег `pre-redesign-snapshot` | `8220cdf` | локально и на GitHub | Снимок `gh-pages` до проекта |
| `archive-for-prabhu` | (этот коммит) | GitHub | Этот экспорт |

**Где что опубликовано:**

| Место | Версия |
|---|---|
| https://iskcon.cv.ua/ | Старый дизайн (собран из `domain-sync-2026-10-20`) |
| https://vycheslavukraincev.github.io/iskcon-cv-ua/ (зеркало) | `gh-pages` @ `8220cdf`, старый дизайн |
| https://vycheslavukraincev.github.io/iskcon-mockup-v2-preview/ (превью, noindex) | Новый макет, соответствует `mockup-v2` @ `244669c` (позже менялись только документы) |

### Как восстановить из bundle

```
git clone project-full.bundle iskcon-v2
cd iskcon-v2
git branch -a                                   # все ветки из bundle видны как origin/*
git checkout -b mockup-v2 origin/mockup-v2
git branch release-2026-10-23 origin/release-2026-10-23
git branch mockup-v2-docs origin/mockup-v2-docs
git remote set-url origin https://github.com/VycheslavUkraincev/iskcon-cv-ua.git   # для работы с GitHub
git fetch origin
```

Проверка: `git bundle verify project-full.bundle` → «The bundle records a complete history».

---

## 3. Что существует только на компьютере владельца

| Что | Путь | Состояние на 24.10.2026 | Как восстановить |
|---|---|---|---|
| Ветки `release-2026-10-23`, `mockup-v2-docs` | `~/projects/iskcon-v2` | есть | Из `project-full.bundle` (раздел 2) |
| Локальный клон превью | `/private/tmp/claude-501/-Users-sergiyshakola-projects-iskcon-v2-s1/preview` | **уже пропал** (временная папка) | `git clone https://github.com/VycheslavUkraincev/iskcon-mockup-v2-preview.git`, задать `user.name`/`user.email`; обновление превью — `docs/handoff/HANDOFF.md` §2 или `docs/handoff/scripts/master/preview.sh`. В превью свой `robots.txt` с `Disallow: /`, `sitemap.xml` нет, `<base>` указывает на `/iskcon-mockup-v2-preview/` |
| Инструменты замеров | `~/scratch/tools` (≈242 МБ: `node_modules`) | есть | `HANDOFF.md` §7: `npm i playwright@1.48 pngjs jsqr lighthouse sharp qrcode potrace` (точные версии — `_local-extras/package-lock.json`). Если `~/.npm` выдаёт ошибки прав, ставить с `--cache <временная папка>` |
| Папка раздачи для тестов | `~/scratch/serve/iskcon-cv-ua` → симлинк на репозиторий | есть | `mkdir -p ~/scratch/serve && ln -sfn ~/projects/iskcon-v2 ~/scratch/serve/iskcon-cv-ua` |
| База для регрессии «до/после» | `~/scratch/base` (≈100 МБ) | есть, но может быть устаревшей | `git archive <база> \| tar -x -C ~/scratch/base/iskcon-cv-ua`, сервер на свободном порту (8769; старый 8767 отдавал устаревшую копию) |
| Скрипты мастер-задания | `~/scratch/m/tools` | есть | Основное — в `docs/handoff/scripts/master/`, 6 дополнительных — в `_local-extras/` |
| Локальные серверы | 8765 (`python3 -m http.server`), 8766 (`gz.js`, с gzip), 8767/8769 (база) | сейчас не запущены | `HANDOFF.md` §7. Тестовые страницы открываются по `http://127.0.0.1:8765/iskcon-cv-ua/` (префикс нужен из-за `<base>`) |
| Доступ к хостингу | SSH-хост `iskcon` в `~/.ssh/config` | ключи **не экспортируются** | `tools/deploy.sh` требует SSH-доступа к Apache iskcon.cv.ua — запросить у владельца |
| Авторизация `gh` | аккаунт `VycheslavUkraincev` | не экспортируется | `gh auth login` своим аккаунтом с правами на репозиторий |
| Память и транскрипты Claude Code | `~/.claude/projects/-Users-sergiyshakola--openclaw/` | не экспортируются | Всё существенное перенесено в `STATUS_PLAN.md`, `docs/handoff/HANDOFF.md`, `PROJECT_FULL_REPORT.md` |

---

## 4. Окружение

| Компонент | Версия / состояние |
|---|---|
| Claude Code | 2.1.310 |
| Плагин | `frontend-design@claude-plugins-official` (user scope, установлен 23.10.2026, включён) |
| Навык пользователя | `~/.claude/skills/web-design-guidelines` (Vercel; правила тянет из `vercel-labs/web-interface-guidelines`) |
| Навыки проекта | `.claude/skills/` и `.agents/skills/` (раздел 1), источники — `skills-lock.json`. Не ставить: `react-best-practices`, `gsap-react`/frameworks, 21st.dev Magic MCP, superpowers, Figma MCP (`CLAUDE.md`) |
| MCP (local scope проекта `~/.openclaw`) | `playwright` — `npx @playwright/mcp@latest`; `chrome-devtools` — `npx chrome-devtools-mcp@latest` |
| Node.js | v24.15.0 |
| Python | 3.13.7 |
| git / gh | 2.50.1 / 2.103.0 |
| Google Chrome | 155.0.8059.85 (Playwright использует системный Chrome: `channel:'chrome'`) |
| npm в `~/scratch/tools` | playwright 1.48.2, lighthouse 13.5.0, sharp 0.35.5, jsqr 1.4.0, pngjs 7.0.0, qrcode 1.5.4, potrace 2.1.8 |
| Диск | ≈3,7 ГБ свободно — PNG-скриншоты удалять сразу, в репозиторий класть JPG |

---

## 5. С чего начать

1. Прочитать `iskcon-v2/PROJECT_FULL_REPORT.md` — что за сайт, реестр фактов, состояние, оценка 76/100.
2. Затем `STATUS_PLAN.md` → `docs/handoff/HANDOFF.md` (правила, процедуры, инструменты) → `CLAUDE.md` (инварианты и дизайн-правила).
3. План — `DEVELOPMENT_PLAN.md`, исследование — `RESEARCH_CINEMATIC.md`, 50 рекомендаций — `RECOMMENDATIONS_50.md`.
4. Правила работы с владельцем: по-русски, срез → отчёт → коммит в `mockup-v2` → превью → СТОП. Ничего не выдумывать: факты, цифры, имена, ссылки только от владельца. Живой сайт и `gh-pages` трогать только по его слову.

---

## 6. Что осталось до публикации

1. Владелец смотрит превью на телефоне. Проверить QR камерой, Google Calendar, модалку WayForPay, аватар в Safari.
2. Слово владельца «публикуем».
3. Выпуск по `HANDOFF.md` §2:
   - тег-снимок `gh-pages`;
   - слияние `release-2026-10-23` в `gh-pages` без force — **это обновляет только зеркало**;
   - **живой домен собирается `tools/build-domain.sh`** и выкладывается `tools/deploy.sh dist-domain`: сначала `--dry-run`, скрипт сам делает архив `public_html` на сервере;
   - проверка iskcon.cv.ua.
4. После выкладки: превью ссылок в Telegram и Facebook, Search Console + `sitemap.xml`, контроль через 1 и 4 недели.

`release-2026-10-23` построена от `43df3fa`. После неё в `mockup-v2` менялись только документы (`ba2f87b`, HANDOFF), а их в выпуске нет. Если до выкладки изменится код сайта, ветку выпуска нужно пересобрать тем же способом.

---

## Оговорки
- **Репозиторий публичный,** поэтому ветка `archive-for-prabhu` видна всем. Новых данных она не раскрывает: всё содержимое zip уже есть в публичной `mockup-v2`. Новое только две локальные ветки в bundle (в выпуске только файлы сайта, в `mockup-v2-docs` старая версия тех же документов) и 6 вспомогательных скриптов. Ключи, пароли и токены не включены.
- **В документах есть имена контактных лиц.** Это те же имена и телефоны, что опубликованы на самом сайте, и имена из пакета отзывов `docs/prabhu-package/`. Пересылать архив дальше — на усмотрение владельца.
