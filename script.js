// ================================================================
// SEMUA JS dibungkus window.addEventListener('load')
// Ini memastikan GSAP sudah ter-load sepenuhnya sebelum dijalankan
// ================================================================
window.addEventListener("load", function () {
  // Fallback: jika GSAP gagal load (tidak ada internet)
  if (typeof gsap === "undefined") {
    document.getElementById("preloader").style.display = "none";
    document.getElementById("site-header").style.opacity = "1";
    console.warn("GSAP gagal load - periksa koneksi internet.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // ── Cursor ──────────────────────────────────────────────────────
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  let mx = 0,
    my = 0,
    fx = 0,
    fy = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(cursor, { x: mx - 5, y: my - 5, duration: 0.1 });
  });

  (function loop() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx - 18}px,${fy - 18}px)`;
    requestAnimationFrame(loop);
  })();

  // ── Preloader ────────────────────────────────────────────────────
  const preloader = document.getElementById("preloader");
  const preloaderTxt = document.getElementById("preloader-text");
  const preloaderLn = document.getElementById("preloader-line");
  const preloaderPct = document.getElementById("preloader-pct");

  gsap
    .timeline({ onComplete: startSite })
    .to(preloaderTxt, { opacity: 1, duration: 0.6, ease: "power2.out" })
    .to(
      { val: 0 },
      {
        val: 100,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          preloaderLn.style.width = v + "%";
          preloaderPct.textContent = v + "%";
        },
      },
      "+=0.2",
    )
    .to(preloader, { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.3")
    .set(preloader, { display: "none" });

  // ── startSite ────────────────────────────────────────────────────
  function startSite() {
    gsap.fromTo(
      "#site-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
    );
    heroScramble();
  }

  // ── Hero Scramble ────────────────────────────────────────────────
  const wBank = ["BUILDING", "CRAFTING", "DESIGNING", "SHIPPING"];
  const wBank2 = ["DIGITAL", "MODERN", "STUNNING", "SCALABLE"];
  const wBank3 = ["EXPERIENCES", "SOLUTIONS", "INTERFACES", "WEBSITES"];
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

  function scrambleText(el, finalText, dur) {
    dur = dur || 900;
    return new Promise(function (resolve) {
      var iter = 0;
      var iv = setInterval(function () {
        el.innerText = finalText
          .split("")
          .map(function (c, i) {
            if (c === " ") return " ";
            if (i < iter) return finalText[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        if (iter >= finalText.length) {
          clearInterval(iv);
          resolve();
        }
        iter += 0.6;
      }, 40);
    });
  }

  async function heroScramble() {
    const l1 = document.getElementById("line1");
    const l2 = document.getElementById("line2");
    const l3 = document.getElementById("line3");

    gsap.fromTo(
      [l1, l2, l3],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power3.out",
      },
    );

    await scrambleText(l1, "BUILDING", 700);
    await scrambleText(l2, "DIGITAL", 700);
    await scrambleText(l3, "EXPERIENCES", 800);

    let wi = 1;
    setInterval(async function () {
      await scrambleText(l1, wBank[wi % wBank.length], 600);
      await scrambleText(l2, wBank2[wi % wBank2.length], 600);
      await scrambleText(l3, wBank3[wi % wBank3.length], 700);
      wi++;
    }, 4000);

    gsap.to(".hero-sub", { opacity: 1, y: 0, delay: 0.4, duration: 0.6 });
    gsap.to(".hero-scroll", { opacity: 1, delay: 0.8, duration: 0.6 });
    gsap.to(".shape-ring", {
      rotation: 360,
      duration: 40,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".shape-ring2", {
      rotation: -360,
      duration: 25,
      repeat: -1,
      ease: "none",
    });
  }

  // ── Off-Canvas ───────────────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const offcanvas = document.getElementById("offcanvas");
  const offcanvasBg = document.getElementById("offcanvas-bg");
  const offcanvasPanel = document.getElementById("offcanvas-panel");
  const ocLinks = document.querySelectorAll(".oc-nav a");
  const ocSocials = document.querySelector(".oc-socials");
  let menuOpen = false;

  const menuTl = gsap.timeline({ paused: true });
  menuTl
    .set(offcanvas, { pointerEvents: "auto" })
    .to(offcanvasBg, { background: "rgba(0,0,0,0.6)", duration: 0.3 })
    .to(offcanvasPanel, { x: 0, duration: 0.55, ease: "power3.out" }, 0)
    .to(
      ocLinks,
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.4,
        ease: "power2.out",
      },
      0.2,
    )
    .to(ocSocials, { opacity: 1, duration: 0.4 }, 0.5);

  hamburger.addEventListener("click", () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle("active", menuOpen);
    if (menuOpen) {
      menuTl.play();
    } else {
      menuTl.reverse();
      setTimeout(() => {
        offcanvas.style.pointerEvents = "none";
      }, 600);
    }
  });

  offcanvasBg.addEventListener("click", () => {
    if (menuOpen) hamburger.click();
  });

  document.querySelectorAll(".oc-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("href");
      if (menuOpen) hamburger.click();
      setTimeout(() => {
        document.querySelector(target).scrollIntoView({ behavior: "smooth" });
      }, 400);
    });
  });

  // ── About: Word Reveal ───────────────────────────────────────────
  const aboutEl = document.getElementById("about-text");
  aboutEl.innerHTML = aboutEl.textContent
    .trim()
    .split(" ")
    .map((w) => `<span class="word">${w}</span>`)
    .join(" ");

  ScrollTrigger.create({
    trigger: "#about",
    start: "top 75%",
    onEnter() {
      gsap.to("#about .word", {
        opacity: 1,
        y: 0,
        stagger: 0.018,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.fromTo(
        ".about-number",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, delay: 0.5 },
      );
    },
  });

  // ── Work Cards ───────────────────────────────────────────────────
  gsap.utils.toArray(".work-card").forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 88%",
      onEnter() {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: (i % 3) * 0.1,
        });
      },
    });
  });

  // ── Tech Carousel ────────────────────────────────────────────────
  const devTools = [
    { name: "PHP", tag: "BE" },
    { name: "CSS", tag: "FE" },
    { name: "JavaScript", tag: "FE" },
    { name: "WordPress", tag: "CMS" },
    { name: "MySQL", tag: "DB" },
    { name: "jQuery", tag: "JS" },
    { name: "React", tag: "FE" },
    { name: "GSAP", tag: "ANIM" },
    { name: "Elementor", tag: "CMS" },
    { name: "ACF", tag: "CMS" },
    { name: "Crocoblock", tag: "CMS" },
    { name: "Webflow", tag: "CMS" },
  ];
  const designTools = [
    { name: "Adobe Photoshop", tag: "PS" },
    { name: "Adobe Illustrator", tag: "AI" },
    { name: "Adobe After Effects", tag: "AE" },
    { name: "Figma", tag: "UX" },
    { name: "Blender", tag: "3D" },
    { name: "Adobe Photoshop", tag: "PS" },
    { name: "Adobe Illustrator", tag: "AI" },
    { name: "Adobe After Effects", tag: "AE" },
  ];

  function buildPills(tools) {
    return tools
      .map(
        (t) =>
          `<div class="tech-pill"><span class="tech-icon">${t.tag}</span><span class="tech-name">${t.name}</span></div>`,
      )
      .join("");
  }

  const row1 = document.getElementById("row1");
  const row2 = document.getElementById("row2");
  row1.innerHTML = buildPills(devTools) + buildPills(devTools);
  row2.innerHTML = buildPills(designTools) + buildPills(designTools);

  document.querySelectorAll(".carousel-track").forEach((t) => {
    t.addEventListener(
      "mouseenter",
      () => (t.style.animationPlayState = "paused"),
    );
    t.addEventListener(
      "mouseleave",
      () => (t.style.animationPlayState = "running"),
    );
  });

  // ── Section Title Animations ─────────────────────────────────────
  gsap.utils.toArray(".section-title").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      },
    );
  });

  gsap.fromTo(
    ".contact-big",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: "#contact", start: "top 75%" },
    },
  );
  gsap.fromTo(
    ".contact-item",
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: { trigger: "#contact", start: "top 70%" },
    },
  );
  gsap.fromTo(
    ".contact-form .form-group",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: { trigger: ".contact-form", start: "top 80%" },
    },
  );
  gsap.fromTo(
    "#form-submit-btn",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      delay: 0.35,
      duration: 0.5,
      scrollTrigger: { trigger: ".contact-form", start: "top 80%" },
    },
  );

  // ── Form Submit ──────────────────────────────────────────────────
  document
    .getElementById("form-submit-btn")
    .addEventListener("click", function () {
      const btn = this;
      btn.disabled = true;
      btn.textContent = "Sending...";
      setTimeout(() => {
        btn.innerHTML = "Message Sent ✓";
        setTimeout(() => {
          btn.innerHTML =
            'Send Message <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 7h12M8 2l6 5-6 5"/></svg>';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });

  // ── Footer ───────────────────────────────────────────────────────
  document.getElementById("copy-year").textContent = new Date().getFullYear();

  function tick() {
    document.getElementById("bekasi-time").textContent =
      new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
  }
  tick();
  setInterval(tick, 1000);
});
