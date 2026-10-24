# UNUSED_FILES.md — файлы сайта, на которые не ссылается ни одна страница

**Дата:** 24.10.2026. **Ветка:** `mockup-v2`. **Ничего не удалено** — это список на утверждение владельца.

Как считалось: имя каждого файла из `assets/` (по `git ls-files`) искалось во всех страницах (`*.html`, `*/index.html`, `404.html`), во всех `.js`/`.css`/`.svg` из `assets/`, в `robots.txt`, `sitemap.xml`, `tools/build-domain.sh`; имена, которые `avatar.js` собирает на лету (`avatar-<сцена>.webm`, `avatar-<сцена>-poster-192.webp`), учтены. Отдельно сверено с `URL_BASELINE.txt` (адреса живого сайта на 22.10).

**Итого: 104 файлов, 33.8 МБ.** Полная копия всех файлов уже есть в архиве для Прабху (ветка `archive-for-prabhu`, `project-full.bundle`), так что удаление из сайта ничего не теряет безвозвратно.

| Группа | Файлов | МБ | Рекомендация |
|---|---|---|---|
| 1. Фотоархив (храм, фестивали, «Їжа життя») | 76 | 30.5 | убрать из сайта; фото остаются в архиве и в истории git |
| 2. Технические остатки (старые видео/постеры аватара, старые логотипы, неподключённый «гид») | 12 | 0.9 | удалить |
| 3. Были адресами живого сайта (`URL_BASELINE.txt`) | 12 | 2.1 | **оставить**: на них могут вести внешние ссылки и старые превью в соцсетях |
| 4. Исходники, из которых сделаны WebP | 4 | 0.3 | оставить как исходники |

Если решите удалять: одним коммитом в `mockup-v2`, группы 1 и 2, после чего — регрессия всех страниц и проверка 404 по журналу Lighthouse.


## 1. Фотоархив

| Файл | КБ |
|---|---|
| `assets/festival/.gitkeep` | 0.0 |
| `assets/festival/best-01.jpg` | 242.6 |
| `assets/festival/best-02.jpg` | 129.7 |
| `assets/festival/best-03.jpg` | 170.6 |
| `assets/festival/best-04.jpg` | 199.5 |
| `assets/festival/best-05.jpg` | 167.5 |
| `assets/festival/best-06.jpg` | 192.7 |
| `assets/festival/best-07.jpg` | 116.1 |
| `assets/festival/best-08.jpg` | 129.6 |
| `assets/festival/best-09.jpg` | 146.7 |
| `assets/festival/best-10.jpg` | 153.6 |
| `assets/festival/best-11.jpg` | 150.3 |
| `assets/festival/best-12.jpg` | 116.4 |
| `assets/festival/best-13.jpg` | 128.1 |
| `assets/festival/best-14.jpg` | 147.3 |
| `assets/festival/best-15.jpg` | 150.1 |
| `assets/festival/best-16.jpg` | 189.1 |
| `assets/festival/best-17.jpg` | 117.1 |
| `assets/festival/best-18.jpg` | 138.9 |
| `assets/festival/best-19.jpg` | 156.7 |
| `assets/festival/best-20.jpg` | 159.3 |
| `assets/festival/chernivtsi-altar-1.jpg` | 447.4 |
| `assets/festival/chernivtsi-altar-2.jpg` | 494.3 |
| `assets/festival/chernivtsi-altar-3.jpg` | 189.3 |
| `assets/festival/chernivtsi-altar-night-1.jpg` | 219.5 |
| `assets/festival/chernivtsi-community-1.jpg` | 237.5 |
| `assets/festival/chernivtsi-community-2.jpg` | 179.6 |
| `assets/festival/chernivtsi-devotee-1.jpg` | 289.6 |
| `assets/festival/chernivtsi-govardhan-kirtan-1.jpg` | 397.9 |
| `assets/festival/chernivtsi-kirtan-1.jpg` | 501.9 |
| `assets/festival/chernivtsi-kirtan-2.jpg` | 319.1 |
| `assets/festival/chernivtsi-kirtan-3.jpg` | 154.3 |
| `assets/festival/chernivtsi-offering-1.jpg` | 218.8 |
| `assets/festival/ffl-distribution-1.webp` | 256.2 |
| `assets/festival/ffl-volunteers-1.jpg` | 2042.5 |
| `assets/festival/ffl-volunteers-2.jpg` | 2376.3 |
| `assets/festival/gaura-1.jpg` | 835.0 |
| `assets/festival/gaura-10.jpg` | 656.5 |
| `assets/festival/gaura-11.jpg` | 909.0 |
| `assets/festival/gaura-2.jpg` | 646.0 |
| `assets/festival/gaura-3.jpg` | 658.8 |
| `assets/festival/gaura-4.jpg` | 1072.8 |
| `assets/festival/gaura-5.jpg` | 530.1 |
| `assets/festival/gaura-6.jpg` | 555.8 |
| `assets/festival/gaura-7.jpg` | 783.2 |
| `assets/festival/gaura-8.jpg` | 606.8 |
| `assets/festival/gaura-9.jpg` | 517.5 |
| `assets/ffl-cv-1.jpeg` | 245.7 |
| `assets/food/ffl-carousel-01-563.webp` | 95.1 |
| `assets/food/ffl-carousel-02-563.webp` | 63.9 |
| `assets/food/ffl-carousel-03-563.webp` | 35.9 |
| `assets/food/ffl-carousel-04-563.webp` | 59.7 |
| `assets/food/ffl-carousel-05-563.webp` | 44.8 |
| `assets/food/ffl-carousel-06-563.webp` | 14.4 |
| `assets/food/ffl-carousel-07-563.webp` | 46.9 |
| `assets/food/ffl-carousel-08-563.webp` | 36.2 |
| `assets/food/ffl-carousel-09-563.webp` | 80.3 |
| `assets/temple/.gitkeep` | 0.0 |
| `assets/temple/temple-1.jpg` | 884.7 |
| `assets/temple/temple-10.jpg` | 525.6 |
| `assets/temple/temple-11.jpg` | 536.5 |
| `assets/temple/temple-12.jpg` | 610.2 |
| `assets/temple/temple-13.jpg` | 612.2 |
| `assets/temple/temple-14.jpg` | 524.6 |
| `assets/temple/temple-15.jpg` | 587.6 |
| `assets/temple/temple-16.jpg` | 594.9 |
| `assets/temple/temple-17.jpg` | 649.6 |
| `assets/temple/temple-18.jpg` | 610.2 |
| `assets/temple/temple-2.jpg` | 613.8 |
| `assets/temple/temple-3.jpg` | 595.4 |
| `assets/temple/temple-4.jpg` | 569.9 |
| `assets/temple/temple-5.jpg` | 597.3 |
| `assets/temple/temple-6.jpg` | 569.5 |
| `assets/temple/temple-7.jpg` | 768.9 |
| `assets/temple/temple-8.jpg` | 967.7 |
| `assets/temple/temple-9.jpg` | 476.2 |

## 2. Технические остатки

| Файл | КБ |
|---|---|
| `assets/.gitkeep` | 0.0 |
| `assets/avatar-loop-alpha.webm` | 378.4 |
| `assets/avatar-loop.mp4` | 227.7 |
| `assets/avatar-loop.webm` | 190.4 |
| `assets/avatar-poster.jpg` | 42.1 |
| `assets/avatar-poster.png` | 29.8 |
| `assets/favicon-512.png` | 58.0 |
| `assets/ffl-logo.png` | 13.8 |
| `assets/guide.css` | 2.3 |
| `assets/guide.js` | 4.1 |
| `assets/logo-88.webp` | 1.9 |
| `assets/logo-light.svg` | 14.7 |

## 3. Адреса живого сайта — оставить

| Файл | КБ |
|---|---|
| `assets/book-bg.jpg` | 50.8 |
| `assets/book-cc.jpg` | 49.1 |
| `assets/book-sb.jpg` | 63.7 |
| `assets/courses-cooking.jpeg` | 644.5 |
| `assets/courses-kirtan.jpeg` | 669.3 |
| `assets/courses-philosophy.jpeg` | 598.8 |
| `assets/ffl-logo.svg` | 13.6 |
| `assets/goduy-molys.png` | 15.4 |
| `assets/icons/viber.svg` | 2.3 |
| `assets/icons/whatsapp.svg` | 1.2 |
| `assets/logo.jpg` | 40.7 |
| `assets/prabhupada.jpg` | 43.1 |

## 4. Исходники WebP — оставить

| Файл | КБ |
|---|---|
| `assets/avatar-donate-poster.png` | 73.6 |
| `assets/avatar-food-poster.png` | 79.2 |
| `assets/avatar-learn-poster.png` | 75.4 |
| `assets/avatar-main-poster.png` | 60.9 |
