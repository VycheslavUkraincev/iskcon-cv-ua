# Синтез 6 исследований по второму макету iskcon.cv.ua — 22.10.2026

Все исследования завершены, файлы в research/ (всего 1916 строк):
01_source_teardown.md (267), 02_feedback_structured.md (220), 03_awwwards_benchmark.md (372),
04_claude_code_stack.md (417), 05_higgsfield_assets.md (441), 06_clone_paths.md (199).

## Главные выводы, изменившие исходный план
1. Источник — gh-pages@8220cdf (21 окт), не main. Бандл-мердж от 12 окт протух окончательно.
2. «opus .5.5» — это Claude Opus 5.5 (вышел 22.09.2026), Opus 4.5 уже legacy. Пары: Opus 5.5 дизайн, Sonnet 5.5 рутина, Haiku 5.5 инвентаризация (по исследованию 4).
3. Путь клонирования A: git clone gh-pages → ветка mockup-v2 → Claude Code на месте. URL-клонеры (Hostinger, Repaint, Capacity) как основа отвергнуты: не видят i18n-словарь, теряют формы/аналитику, уводят на чужой хостинг. AIDesigner оставлен запасным для альтернативных hero.
4. Форм на сайте нет вообще. Кнопка «Стати волонтером» ведёт в «#». Google-формы Анади — P0, но заблокированы: URL нет ни на сайте, ни в архиве отзывов.
5. Дубли страниц *.html vs */index.html уже разошлись; видео Шпальта Медіа (YouTube 0ZNyLSHUgpc) есть только в food/index.html; <base href> продублирован.
6. Логотип «Їжа життя»: решение «3 файла» из отзыва отвергнуто — корень в растровом логотипе с вшитым текстом. Правильно: солнце-SVG + подпись HTML-текстом из i18n. Это закрывает сразу обрезанный логотип (Serg) и неперевод (Роман/община).
7. DESIGN_DNA готов: тёплая бумага #FBF6ED, шафран, туласи, терракотовый CTA, Spectral + Onest, арочный кроп, easing cubic-bezier(.16,1,.3,1), один signature-эффект «Дыхание алтаря» (ScrollTrigger scrub).
8. Стек Claude Code отфильтрован под vanilla HTML: frontend-design, impeccable (brand), Taste redesign-only, Vercel web-design-guidelines как проверяющий, GSAP без React-частей, webapp-testing для скриншотов. React-инструменты, 21st.dev и superpowers — пропущены обоснованно.
9. Higgsfield: только image-to-video от утверждённых реальных кадров. Seedance 2.5 — hero/scroll, Kling 3.0 — Їжа життя, Veo 3.1 — точечный тест. 5 готовых промптов, веб-экспорт WebM+MP4 с poster, кредиты через MCP/CLI списываются даже на Unlimited. Soul ID не применять. Генераций не запускалось.
10. Вес: ~15+ МБ неиспользуемых медиа в репозитории; сжатие от 12 окт в gh-pages не попало.

## Готовые deliverables
- Структурированные отзывы: files/structured-feedback-2026-10-22.md + research/02_feedback_structured.md (11 пунктов FB-01…FB-11)
- Промпт для Claude Code: files/CLAUDE_CODE_PROMPT_opus55_mockup-v2.md (установка стека + главный промпт + ворота приёмки)
- Промпты Higgsfield: внутри research/05_higgsfield_assets.md (ассеты A, B, C, D1, D2)

## Открытые вопросы к владельцу
URL Google-форм; исходники фото/логотипа в полном разрешении; переводы «Їжа життя» EN/RO; пример смещения от Николая; подписка/лимит Higgsfield.
