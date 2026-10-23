# Скрипты мастер-задания (23.10.2026)

Окружение: `export T=~/scratch/tools` (playwright, pngjs, sharp, lighthouse, potrace). Серверы: 8765 — сайт без gzip (`python3 -m http.server` из папки с симлинком `iskcon-cv-ua` → репозиторий), 8766 — `../gz.js` (gzip, для Lighthouse). Базу для сравнения делать так: `git archive <коммит> index.html courses.html courses food.html food donation.html donation 404.html assets favicon.ico | tar -x -C <папка>/iskcon-cv-ua` и поднять отдельный сервер на свободном порту (8768 бывает занят).

| Файл | Что делает |
|---|---|
| `inv.py <корень сайта> <out.json>` | побайтный эталон инвариантов: платёжные ссылки, tel/Viber/WhatsApp/Telegram, IBAN, ЄДРПОУ, телефоны в тексте, все времена (расписание), sha256 QR. Сравнивать два json до/после |
| `preview.sh "<метка>"` | обновить превью из `mockup-v2` по процедуре HANDOFF §2 и дождаться сборки Pages. Путь к клону превью внутри скрипта — временный; если клона нет, `git clone` превью-репо и поправить путь |
| `cyr.js [base] [widths]` | кириллица в EN/RO + ошибки консоли на 5 страницах |
| `av.js`, `av2.js` | аватар: 0 px движения при скролле/hover/старте видео, перекрытия, модалка поверх, reduced-motion |
| `shots.js <base> <out> [widths] [pages]` | полностраничные JPG |
| `sect.js <url> <selector> <out-prefix> [widths] [langs]` | скриншот секции + кириллица в ней |
| `lh.sh <port> <label> [runs]` | Lighthouse mobile по 4 страницам |
| `audit.js` | аудит мелочей: горизонтальный скролл, обрезка, фокус, цели касания, крупные растры |
| `hdr2.js` | шапка: помещается ли бренд рядом с кнопками языков (320–768) |
| `snap.js <url> <out.png> [width]` | быстрый снимок страницы |
