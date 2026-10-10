/* ============================================================
   Аватар-вайшнав: живий помічник храму
   SVG-персонаж зі станами: idle, waving, talking, happy, sleeping
   + дерево швидких відповідей (чат)
   ============================================================ */
(function(){
"use strict";

/* ---------- Дані чату ---------- */
var QA = [
  { id:"what", q:"Що таке ІСККОН?",
    a:"ІСККОН — Міжнародне товариство свідомості Крішни, засноване 1966 року. Ми практикуємо бгакті-йогу — шлях любові та відданості Богу." },
  { id:"when", q:"Коли найближча програма?",
    a:"Недільний фестиваль: 13:30 — кіртан, 14:00 — лекція з філософії, 16:00 — вегетаріанський бенкет. У суботу з 08:00 — ранкова програма." },
  { id:"food", q:"Що таке «Їжа життя»?",
    a:"Благодійна місія: гарячі вегетаріанські обіди щосуботи о 14:00 на Соборній площі. Готуємо з 08:00 у храмі — долучайтесь як волонтер!",
    link:"/food", linkText:"Детальніше про «Їжу життя» →" },
  { id:"courses", q:"Які є курси?",
    a:"Ведична філософія, ведична кулінарія та гра на традиційних інструментах (каратали, мріданг, фісгармонія). Запис за телефонами храму.",
    link:"/courses", linkText:"До курсів →" },
  { id:"volunteer", q:"Як стати волонтером?",
    a:"Ми завжди раді новим волонтерам! Приходьте до храму (вул. Скальда, 40А) або напишіть нам у Telegram." },
  { id:"donate", q:"Як підтримати храм?",
    a:"Дякуємо за ваше відкрите серце! Зробити разову чи регулярну пожертву можна на сторінці «Пожертви».",
    link:"/donation", linkText:"Перейти до пожертв →" }
];
var MANTRA = ["Харе Крішна","Крішна Крішна","Харе Харе","Харе Рама","Рама Рама","Харе Харе"];
var GREETING = "Харе Крішна! 🙏 Я — помічник храму. Що вас цікавить?";

/* ---------- SVG персонажа ---------- */
var SVG =
'<svg class="avatar-svg" viewBox="0 0 120 152" aria-hidden="true">'+
  /* тінь */
  '<ellipse class="av-shadow" cx="60" cy="144" rx="26" ry="5.5" fill="#5a3c14" opacity=".14"/>'+
  '<g class="av-float">'+
    /* курта (одяг) */
    '<path d="M36 96 Q60 89 84 96 L89 134 Q60 141 31 134 Z" fill="#E8912A"/>'+
    '<path d="M36 96 Q60 89 84 96 L83 104 Q60 97 37 104 Z" fill="#D97F1A"/>'+
    /* комір */
    '<path d="M53 93 L60 101 L67 93" stroke="#B36A06" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
    /* чотки (туласі-мала) */
    '<g fill="#7A4E21">'+
      '<circle cx="46" cy="100" r="2.6"/><circle cx="52" cy="103" r="2.6"/><circle cx="58" cy="104.5" r="2.6"/>'+
      '<circle cx="64" cy="104.5" r="2.6"/><circle cx="70" cy="103" r="2.6"/><circle cx="76" cy="100" r="2.6"/>'+
    '</g>'+
    /* ліва рука (спокійна) */
    '<path d="M37 102 Q30 116 40 124" stroke="#F3C795" stroke-width="11" stroke-linecap="round" fill="none"/>'+
    '<circle cx="40" cy="124" r="6.5" fill="#F3C795"/>'+
    /* права рука (махає) */
    '<g class="av-arm-wave">'+
      '<path d="M83 102 Q92 114 84 124" stroke="#F3C795" stroke-width="11" stroke-linecap="round" fill="none"/>'+
      '<circle cx="84" cy="126" r="6.5" fill="#F3C795"/>'+
    '</g>'+
    /* голова */
    '<g class="av-head">'+
      '<circle cx="28" cy="60" r="6" fill="#F3C795"/>'+
      '<circle cx="92" cy="60" r="6" fill="#F3C795"/>'+
      '<circle cx="60" cy="56" r="31" fill="#F7CF9E"/>'+
      /* сикха (пасмо волосся) */
      '<path d="M60 25 Q61 13 70 10 Q65 17 64 26 Z" fill="#3A2A1A"/>'+
      '<ellipse cx="60" cy="26" rx="9" ry="4" fill="#3A2A1A" opacity=".12"/>'+
      /* тилака: біле U */
      '<path d="M47 33 L47 47 Q47 54 60 54 Q73 54 73 47 L73 33" '+
            'stroke="#FFFDF6" stroke-width="5.5" fill="none" stroke-linecap="round"/>'+
      /* тилака: центральна червона лінія */
      '<line x1="60" y1="31" x2="60" y2="49" stroke="#D43D2A" stroke-width="3.2" stroke-linecap="round"/>'+
      /* брови */
      '<path d="M41 63 Q47 60 53 63" stroke="#5A3A22" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
      '<path d="M67 63 Q73 60 79 63" stroke="#5A3A22" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
      /* очі */
      '<g class="av-eyes">'+
        '<ellipse cx="48" cy="71" rx="5.2" ry="6.2" fill="#2C2318"/>'+
        '<ellipse cx="72" cy="71" rx="5.2" ry="6.2" fill="#2C2318"/>'+
        '<circle cx="49.8" cy="68.8" r="1.9" fill="#fff"/>'+
        '<circle cx="73.8" cy="68.8" r="1.9" fill="#fff"/>'+
      '</g>'+
      /* щоки */
      '<circle cx="39" cy="79" r="5" fill="#EE9B52" opacity=".45"/>'+
      '<circle cx="81" cy="79" r="5" fill="#EE9B52" opacity=".45"/>'+
      /* рот: усмішка */
      '<path class="av-mouth-smile" d="M50 85 Q60 93 70 85" stroke="#8B4513" stroke-width="3" fill="none" stroke-linecap="round"/>'+
      /* рот: відкритий (розмова) */
      '<ellipse class="av-mouth-open" cx="60" cy="88" rx="5" ry="6" fill="#7A3A1E"/>'+
    '</g>'+
  '</g>'+
'</svg>';

/* Міні-версія для шапки чату */
var SVG_MINI = SVG.replace('class="avatar-svg"', 'class="avatar-svg"');

/* ---------- Побудова DOM ---------- */
function el(html){ var d=document.createElement("div"); d.innerHTML=html; return d.firstChild; }

var widget = el(
  '<div class="avatar-widget" id="avatarWidget">'+
    '<div class="avatar-bubble" id="avatarBubble">Харе Крішна</div>'+
    '<div class="avatar-zzz-wrap">'+
      '<div class="avatar-char idle" id="avatarChar" role="button" tabindex="0" aria-label="Помічник храму — натисніть, щоб поговорити">'+SVG+'</div>'+
      '<div class="avatar-zzz">z z z</div>'+
    '</div>'+
  '</div>');

var card = el(
  '<div class="avatar-card" id="avatarCard" role="dialog" aria-label="Чат з помічником храму">'+
    '<div class="avatar-head"><span class="mini">'+SVG_MINI+'</span>'+
    '<span>Помічник храму<small>вайшнав-аватар · завжди на звʼязку</small></span>'+
    '<button class="close-x" id="avatarClose" aria-label="Закрити чат">×</button></div>'+
    '<div class="avatar-body" id="avatarBody"></div>'+
  '</div>');

document.body.appendChild(widget);
document.body.appendChild(card);

var charEl   = widget.querySelector("#avatarChar");
var bubbleEl = widget.querySelector("#avatarBubble");
var body     = card.querySelector("#avatarBody");
var open = false, mi = 0, lastActive = Date.now(), sleepTimer = null;

/* ---------- Стани персонажа ---------- */
function setState(s){
  charEl.classList.remove("waving","talking","happy","curious","sleeping");
  if(s) charEl.classList.add(s);
  /* idle завжди активний як базовий */
  if(!charEl.classList.contains("idle")) charEl.classList.add("idle");
}
function wake(){
  lastActive = Date.now();
  if(charEl.classList.contains("sleeping")){
    setState(null); bubbleEl.classList.remove("hidden");
  }
  restartSleepTimer();
}
function restartSleepTimer(){
  clearTimeout(sleepTimer);
  sleepTimer = setTimeout(function(){
    if(!open){
      charEl.classList.add("sleeping");
      bubbleEl.classList.add("hidden");
    }
  }, 60000); /* засинає за хвилину бездіяльності */
}

/* Мантра в хмарці */
setInterval(function(){
  if(open || charEl.classList.contains("sleeping")) return;
  mi = (mi+1) % MANTRA.length;
  bubbleEl.style.opacity = 0;
  setTimeout(function(){ bubbleEl.textContent = MANTRA[mi]; bubbleEl.style.opacity = 1; }, 350);
}, 2800);

/* Клік: радість + відкриття чату */
function toggleChat(){
  wake();
  open = !open;
  card.classList.toggle("open", open);
  if(open){
    bubbleEl.classList.add("hidden");
    setState("waving");
    setTimeout(function(){ if(open) setState("curious"); }, 2600);
    if(!body.children.length) showMenu(true);
  }else{
    bubbleEl.classList.remove("hidden");
    setState(null);
  }
}
charEl.addEventListener("click", function(){
  charEl.classList.remove("happy"); void charEl.offsetWidth; /* перезапуск анімації */
  charEl.classList.add("happy");
  setTimeout(toggleChat, 180);
});
charEl.addEventListener("keydown", function(e){
  if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggleChat(); }
});
card.querySelector("#avatarClose").addEventListener("click", function(){
  if(open) toggleChat();
});
["mousemove","touchstart"].forEach(function(evt){
  document.addEventListener(evt, wake, {passive:true});
});
restartSleepTimer();

/* ---------- Логіка чату ---------- */
function scrollDown(){ body.scrollTop = body.scrollHeight; }
function addMsg(text, cls){
  var m = el('<div class="avatar-msg'+(cls?" "+cls:"")+'"></div>');
  m.textContent = text; body.appendChild(m); scrollDown(); return m;
}
function showMenu(instant){
  body.innerHTML = "";
  var render = function(){
    body.innerHTML = "";
    addMsg(GREETING);
    var opts = el('<div class="avatar-opts"></div>');
    QA.forEach(function(item, i){
      var b = el('<button class="avatar-opt"></button>');
      b.textContent = item.q;
      b.addEventListener("click", function(){ answer(i); });
      opts.appendChild(b);
    });
    body.appendChild(opts); scrollDown();
  };
  if(instant){ render(); return; }
  setState("talking");
  var t = addMsg("", "typing");
  setTimeout(function(){ t.remove(); setState("curious"); render(); }, 700);
}
function answer(i){
  wake();
  var item = QA[i];
  body.innerHTML = "";
  addMsg(item.q, "user");
  /* ефект "друкування" + анімація розмови */
  setState("talking");
  var t = addMsg("", "typing");
  scrollDown();
  setTimeout(function(){
    t.remove();
    var m = addMsg(item.a);
    if(item.link){
      var a = document.createElement("a");
      a.href = item.link; a.className = "avatar-link"; a.textContent = item.linkText;
      m.appendChild(document.createElement("br")); m.appendChild(a);
    }
    var back = el('<button class="avatar-back">← Назад до питань</button>');
    back.addEventListener("click", function(){ showMenu(false); });
    body.appendChild(back); scrollDown();
    setState("happy");
    setTimeout(function(){ if(open) setState("curious"); }, 900);
  }, 900 + Math.min(item.a.length * 8, 1200));
}

/* Привітальне махання при першому завантаженні */
setTimeout(function(){
  if(!open && !charEl.classList.contains("sleeping")){
    setState("waving");
    setTimeout(function(){ if(!open) setState(null); }, 2800);
  }
}, 2500);

})();
