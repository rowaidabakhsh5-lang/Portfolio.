/* 
==========================
   MENU (Hamburger)
========================== */
(function(){
  var wrap = document.getElementById("menuWrap");
  var btn  = document.getElementById("hamburgerBtn");
  var logo = document.getElementById("logoBtn");

  function openMenu(){
    wrap.classList.add("menuOpen");
    btn.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    wrap.classList.remove("menuOpen");
    btn.setAttribute("aria-expanded","false");
  }
  function toggleMenu(){
    if (wrap.classList.contains("menuOpen")) closeMenu();
    else openMenu();
  }

  btn.addEventListener("click", function(e){
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", function(){
    closeMenu();
  });

  wrap.addEventListener("click", function(e){
    e.stopPropagation();
  });

  var menuLinks = wrap.querySelectorAll('a[data-scroll]');
  for (var i=0; i<menuLinks.length; i++){
    menuLinks[i].addEventListener("click", function(e){
      var id = this.getAttribute("data-scroll");
      var target = document.getElementById(id);
      if (target){
        e.preventDefault();
        closeMenu();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (logo){
    logo.addEventListener("click", function(){
      var home = document.getElementById("home");
      if (home) home.scrollIntoView({ behavior:"smooth", block:"start" });
      closeMenu();
    });
  }
})();

/* ==========================
   SITE PULL FEEL (Studio-like)
   - بدون اهتزاز / بدون skew
   - فقط إحساس "سحب" ناعم بين الصفحات
========================== */
/* ==========================
   SCROLL REVEAL (Studio-like)
   - الصفحة اللي بعدها تطلع ببطء (smooth reveal)
========================== */
(function(){
  var sections = Array.from(document.querySelectorAll("main.content > section"));
  if (!sections.length) return;

  // إعدادات ستايل ستوديو
  var startY = 22;       // كم يطلع من تحت بالبداية
  var duration = 520;    // مدة الحركة ms (زيديها = أبطأ)

  // نحط ستايل أساسي لكل سيكشن
  for (var i=0; i<sections.length; i++){
    var s = sections[i];
    s.style.opacity = "0";
    s.style.transform = "translate3d(0," + startY + "px,0)";
    s.style.transition = "opacity " + duration + "ms ease, transform " + duration + "ms ease";
    s.style.willChange = "opacity, transform";
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){
        e.target.style.opacity = "1";
        e.target.style.transform = "translate3d(0,0,0)";
      }
    });
  }, {
    root: null,
    threshold: 0.12,          // متى يبدأ يظهر
    rootMargin: "0px 0px -10% 0px"
  });

  sections.forEach(function(s){ io.observe(s); });
})();
/* ==========================
   STAIR (كودك كما هو)
========================== */
window.addEventListener("DOMContentLoaded", function () {
  var stairEl = document.getElementById("stair");
  if (!stairEl) return;

  function cssNum(name){
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  }


// صورك

var items = [

  "url('1.jpeg')",

  "url('2.jpeg')",

  "url('3.jpeg')",

  "url('4.jpeg')",

  "url('5.jpeg')",

  "url('6.jpeg')",

  "url('7.jpeg')",

];

// ✅ لازم نفس العدد بالضبط (7 صور = 7 ألوان)

var boxColors = [

  "rgba(1, 1, 0, 0.97)",

  "rgba(230, 67, 41)",

  "rgba(1, 1, 0, 0.97)",

  "rgba(129, 196, 170)",

  "rgba(230, 67, 41)",

  "rgba(240, 208, 116)",

  "rgba(129, 196, 170)"

];

// ✅ نفس الشي هنا (7 فقط)

var lineColors = [

  "rgba(255, 255, 255, 0.85)",

  "rgba(255, 255, 255, 0.85)",

  "rgba(255, 255, 255, 0.85)",

  "rgba(255, 255, 255, 0.85)",

  "rgba(255, 255, 255, 0.85)",

  "rgba(255, 255, 255, 0.85)",

  "rgba(255, 255, 255, 0.85)",


];




  var speed = 0.45;
  var gapY = 0;

  var cardW, cardH, boxW, wrapW, stepX, stepY;
  var originX, originY, sMin, sMax, count;
  var nodes = [];
  var t0 = performance.now();

  // خط الاختفاء من فوق (عند الهامبرغر) — كما هو
  var fadeTopY = 0;

  function computeFadeForMobile(){
    var topbar = document.querySelector(".topbar");
    var stage  = document.querySelector(".page1 .stage");
    if (!topbar || !stage) {
      fadeTopY = 0;
      return;
    }

    var topbarRect = topbar.getBoundingClientRect();
    var stageRect  = stage.getBoundingClientRect();

    var startAt = topbarRect.bottom - 10;
    fadeTopY = startAt - stageRect.top;
  }

  function computeLayout(){
    cardW = cssNum("--cardW");
    cardH = cssNum("--cardH");
    boxW  = cssNum("--boxW");
    wrapW = cardW + boxW;

    var W = window.innerWidth;
    var H = window.innerHeight;
    var isMobile = W <= 768;

    if (isMobile){
      var page1 = document.querySelector(".page1");
      var pageH = page1 ? page1.getBoundingClientRect().height : H;

      // ✅ نقطة البداية: من تحت (قريبة لليسار لكن مو من الجنب)
      originX = Math.round(W * 0.26);
      originY = Math.round(pageH + cardH * 0.10);

      // ✅ سلسلة الخطوط 100%
      stepX = boxW;
      stepY = -cardH;

      computeFadeForMobile();
    } else {
      // ديسكتوب مثل كودك
      var shiftLeft = 500;
      originX = (W * 0.38) - shiftLeft;
      originY = (H * 0.86);

      stepX = cardW / 2;
      stepY = -(cardH + gapY);
    }

    var sMinX = (-wrapW - originX) / stepX;
    var sMaxX = ( W + wrapW - originX) / stepX;

    var sA = (-cardH - originY) / stepY;
    var sB = ( H + cardH - originY) / stepY;
    var sMinY = Math.min(sA, sB);
    var sMaxY = Math.max(sA, sB);

    sMin = Math.max(sMinX, sMinY) - 14;
    sMax = Math.min(sMaxX, sMaxY) + 14;

    count = Math.ceil(sMax - sMin) + 18;
    if (count < 26) count = 26;
  }

  function makeBoxSVG(){
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
           '<line x1="0" y1="100" x2="100" y2="0"></line>' +
           '</svg>';
  }

function build(){

  stairEl.innerHTML = "";

  nodes = [];

  computeLayout();

  for (var i=0; i<count; i++){

    var wrap = document.createElement("div");

    wrap.className = "wrap";

    var card = document.createElement("div");

    card.className = "card";

    var img = document.createElement("div");

    img.className = "img";

    /* ✅ أهم شيء: index مربوط بالصور فقط */

    var index = i % items.length;

    img.style.backgroundImage = items[index];

    var box = document.createElement("div");

    box.className = "box";

    box.innerHTML = makeBoxSVG();

    /* ✅ حماية لو الألوان أقل من الصور */

    var safeBoxColor = boxColors[index] || boxColors[0];

    var safeLineColor = lineColors[index] || lineColors[0];

    box.style.background = safeBoxColor;

    var line = box.querySelector("line");

    if (line){

      line.style.stroke = safeLineColor;

    }

    card.appendChild(img);

    wrap.appendChild(card);

    wrap.appendChild(box);

    stairEl.appendChild(wrap);

    nodes.push({ el: wrap, s: i });

  }

  draw(0);

}

  function draw(dt){
    var base = dt * speed;
    var isMobile = window.innerWidth <= 768;

    var hideIndex = -1;
    var bestY = Infinity;

    for (var i=0; i<nodes.length; i++){
      var obj = nodes[i];
      var s = obj.s + base;

      while (s > sMax) { obj.s -= count; s = obj.s + base; }
      while (s < sMin) { obj.s += count; s = obj.s + base; }

      var x = originX + s * stepX;
      var y = originY + s * stepY;

      obj.el.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";

      if (isMobile){
        if (y < fadeTopY && y < bestY){
          bestY = y;
          hideIndex = i;
        }
      }
    }

    if (isMobile){
      for (var j=0; j<nodes.length; j++){
        nodes[j].el.style.opacity = (j === hideIndex) ? "0" : "1";
      }
    } else {
      for (var k=0; k<nodes.length; k++){
        nodes[k].el.style.opacity = "1";
      }
    }
  }

  function animate(now){
    var dt = (now - t0) / 1000;
    draw(dt);
    requestAnimationFrame(animate);
  }

  build();
  window.addEventListener("resize", build);
  requestAnimationFrame(animate);
});



// WORKS: trigger once when section enters viewport
(function () {
  const section = document.querySelector("#works");
  if (!section) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          section.classList.add("is-revealed");
          io.disconnect(); // ✅ مرة وحدة فقط
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -20% 0px", // يبدأ قبل ما يدخل بالكامل شوي
    }
  );

  io.observe(section);
})();





















(function(){
  const els = Array.from(document.querySelectorAll(".type-words"));
  if(!els.length) return;

  // نكتب كلمة كلمة (مو حرف حرف)
  function typeWords(el, text){
    const words = text.trim().split(/\s+/);
    el.textContent = "";
    let i = 0;

    const speed = 160; // 👈 زودي/قللي السرعة هنا (ms لكل كلمة)

    function step(){
      if(i >= words.length) return;
      el.textContent += (i ? " " : "") + words[i];
      i++;
      setTimeout(step, speed);
    }
    step();
  }

  // تشغيل عند دخول كل كرت في الشاشة
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      if(el.dataset.done === "1") return;
      el.dataset.done = "1";
      typeWords(el, el.getAttribute("data-text") || "");
    });
  }, { threshold: 0.35 });

  els.forEach(el => io.observe(el));
})();

















(function(){
  // ✅ تحكم سريع
  const WORD_SPEED_MS = 180;  // سرعة "كلمة كلمة" (كبرّي الرقم = أبطأ)
  const TOPBAR_OFFSET = 110;  // عشان السحب ما ينقص تحت الشريط
  const ACCORDION_SPEED_MS = 900; // نفس transition max-height تقريبًا

  const posts = Array.from(document.querySelectorAll(".articlesDetails .post"));
  if(!posts.length) return;

  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

  // ===== Type "word by word" =====
  function typeWords(el, text){
    const words = (text || "").trim().split(/\s+/).filter(Boolean);
    el.textContent = "";
    let i = 0;

    function step(){
      if(i >= words.length) return;
      el.textContent += (i ? " " : "") + words[i];
      i++;
      setTimeout(step, WORD_SPEED_MS);
    }
    step();
  }

  // ===== Lazy reveal داخل عنصر معيّن =====
  function revealInside(root){
    const els = Array.from(root.querySelectorAll(".lazy-reveal"));
    els.forEach((el, idx)=>{
      // delay بسيط “مرتّب”
      setTimeout(()=> el.classList.add("is-in"), 60 + idx * 70);
    });
  }

  // ===== فتح/إغلاق Accordion =====
  function closePost(post){
    post.classList.remove("is-open");
    post.setAttribute("aria-expanded", "false");
    post.style.maxHeight = "0px";
  }

  function openPost(post){
    // اقفل الباقي
    posts.forEach(p => { if(p !== post) closePost(p); });

    post.classList.add("is-open");
    post.setAttribute("aria-expanded", "true");

    // صفّر lazy أول شيء
    post.querySelectorAll(".lazy-reveal").forEach(el => el.classList.remove("is-in"));

    // typewriter (مرة وحدة عند أول فتح)
    const title = post.querySelector(".type-words");
    if(title && title.dataset.typed !== "1"){
      title.dataset.typed = "1";
      typeWords(title, title.getAttribute("data-text"));
    }

    // لازم maxHeight = scrollHeight عشان ما يصير “قفزة”
    const inner = post.querySelector(".postInner");
    const targetH = inner.scrollHeight;
    post.style.maxHeight = targetH + "px";

    // بعد ما يفتح شوي، نطلع lazy reveal
    setTimeout(()=> revealInside(post), 120);

    // سحب ناعم للمقال
    const y = post.getBoundingClientRect().top + window.pageYOffset - TOPBAR_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });

    // ثبّت الهاش
    history.replaceState(null, "", "#" + post.id);

    // لو المحتوى أطول بعد الكتابة، نعيد حساب الارتفاع بعد قليل
    setTimeout(()=>{
      const newH = inner.scrollHeight;
      post.style.maxHeight = newH + "px";
    }, clamp(WORD_SPEED_MS * 6, 700, 1400));
  }

  // ===== Click: اقرأ المزيد =====
  document.addEventListener("click", (e)=>{
    const a = e.target.closest('a[href^="#post-"]');
    if(a){
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      const post = document.getElementById(id);
      if(post) openPost(post);
      return;
    }

    // زر الإغلاق
    const closeBtn = e.target.closest(".postClose");
    if(closeBtn){
      const post = closeBtn.closest(".post");
      if(post) closePost(post);
      // لو تبين يرجع فوق للقائمة بدل ما يبقى:
      // window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  });

  // ===== لو دخلت الصفحة وهاش موجود =====
  window.addEventListener("load", ()=>{
    const hash = (location.hash || "").slice(1);
    if(hash){
      const post = document.getElementById(hash);
      if(post && post.classList.contains("post")) openPost(post);
    }
  });

  // ===== تحديث ارتفاع المقال المفتوح مع resize =====
  window.addEventListener("resize", ()=>{
    const open = posts.find(p => p.classList.contains("is-open"));
    if(!open) return;
    const inner = open.querySelector(".postInner");
    open.style.maxHeight = inner.scrollHeight + "px";
  });
})();









// ============ INTRO SPLASH (Center Split Open) ============
(function(){
  var intro = document.getElementById("intro");
  if(!intro) return;

  // امنعي التمرير وقت الانترو
  var prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  // ✅ توقيتات مرتبة
  var SHOW_IMAGE_MS   = 900;  // مدة عرض الصورة لوحدها
  var REVEAL_SPLITS_MS = 60;  // وقت بسيط لإظهار الشقين قبل الحركة
  var OPEN_MS         = 900;  // لازم تطابق transition 900ms

  // 1) نخلي الصورة تظهر أول
  setTimeout(function(){
    // 2) بعدها نظهر الشقين
    intro.classList.add("is-reveal-splits");

    setTimeout(function(){
      // 3) بعدها نفتح من المنتصف لفوق/تحت
      intro.classList.add("is-open");

      setTimeout(function(){
        // 4) نخفي الانترو ونرجع التمرير
        intro.classList.add("is-done");
        document.body.style.overflow = prevOverflow || "";

        setTimeout(function(){
          intro.remove();
        }, 220);

      }, OPEN_MS + 40);

    }, REVEAL_SPLITS_MS);

  }, SHOW_IMAGE_MS);
})();






// نخلي الكتابة تشتغل فقط على الكروت

document.querySelectorAll('.postTitle.type-words').forEach(el => {

  el.classList.remove('type-words');

});




