/* =========================================================
   ATIK.DEV — Portfolio interactions (vanilla JavaScript)
   1. Helpers            6. 3D profile-card tilt
   2. Navigation         7. Scroll reveal + terminal + skill bars
   3. Active section     8. Custom cursor
   4. Typing animation   9. Contact form validation
   5. Particle canvas
   ========================================================= */
(() => {
  "use strict";

  /* ---------- 1. HELPERS ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- 2. NAVIGATION ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const setMenu = (open) => {
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  $$("a", navLinks).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 991) setMenu(false); });

  // Stronger glass once the page is scrolled
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. ACTIVE SECTION HIGHLIGHT ---------- */
  const sections = $$("main section[id]");
  const navItems = $$(".nav__link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
          const active = link.dataset.section === entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 } // a thin band in the middle of the viewport
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- 4. TYPING ANIMATION ---------- */
  const typingEl = $("#typing");
  const phrases = ["Software Developer", "Full Stack Learner", "Backend Enthusiast", "AI & Computer Vision Explorer"];

  if (typingEl && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = true; // first phrase is pre-rendered in HTML, so start by erasing it

    const tick = () => {
      const current = phrases[phraseIndex];
      typingEl.textContent = current.slice(0, charIndex);
      let delay = deleting ? 45 : 85;

      if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 1700; // pause on a full phrase
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      } else {
        charIndex += deleting ? -1 : 1;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1800);
  }

  /* ---------- 5. PARTICLE BACKGROUND ---------- */
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let W = 0, H = 0, dpr = 1;
  const LINK_DIST = 130;

  const resizeCanvas = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fewer particles on small screens for performance
    const count = Math.min(Math.floor((W * H) / (W < 768 ? 22000 : 15000)), 90);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.5 + 0.5,
      c: Math.random() < 0.8 ? "124,247,199" : "113,156,255",
    }));
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},0.7)`;
      ctx.shadowColor = `rgba(${p.c},0.8)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Faint lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = dx * dx + dy * dy;
        if (dist < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(dist) / LINK_DIST) * 0.12;
          ctx.strokeStyle = `rgba(124,247,199,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
  };

  let rafId = null;
  const loop = () => { drawParticles(); rafId = requestAnimationFrame(loop); };
  const startParticles = () => { if (!rafId) loop(); };
  const stopParticles = () => { cancelAnimationFrame(rafId); rafId = null; };

  resizeCanvas();
  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeCanvas, 150); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stopParticles() : startParticles()));

  if (prefersReducedMotion) drawParticles(); // single static frame
  else startParticles();

  /* ---------- 6. 3D PROFILE-CARD TILT ---------- */
  const tiltWrap = $("#tiltWrap");
  const card = $("#profileCard");

  if (tiltWrap && card && !isTouch && !prefersReducedMotion) {
    const MAX_TILT = 12; // degrees
    let frame = null;

    tiltWrap.addEventListener("mousemove", (e) => {
      const rect = tiltWrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
      const py = (e.clientY - rect.top) / rect.height;   // 0 → 1
      const rotY = (px - 0.5) * 2 * MAX_TILT;
      const rotX = (0.5 - py) * 2 * MAX_TILT;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.classList.add("is-tilting");
        card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px)`;
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
    });

    tiltWrap.addEventListener("mouseleave", () => {
      cancelAnimationFrame(frame);
      card.classList.remove("is-tilting");
      card.style.transform = ""; // eased back by CSS transition
    });
  }

  /* ---------- 7. SCROLL REVEAL + TERMINAL + SKILL BARS ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  // Skill bars: animate width and count up the percentage
  const animateSkill = (skill) => {
    const level = Number(skill.dataset.level);
    const fill = $(".bar__fill", skill);
    const pct = $(".skill__pct", skill);
    fill.style.width = `${level}%`;

    if (prefersReducedMotion) { pct.textContent = `${level}%`; return; }
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      pct.textContent = `${Math.round(level * eased)}%`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateSkill(entry.target);
        skillObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  $$(".skill").forEach((s) => skillObserver.observe(s));

  // Terminal: reveal output lines one by one when it scrolls into view
  const terminal = $("#terminal");
  if (terminal) {
    const lines = $$("[data-line]", terminal);
    const typeLine = (el, text, speed = 26) =>
      new Promise((resolve) => {
        el.textContent = "";
        let i = 0;
        const id = setInterval(() => {
          el.textContent += text[i++];
          if (i >= text.length) { clearInterval(id); resolve(); }
        }, speed);
      });

    if (!prefersReducedMotion) {
      const texts = lines.map((l) => l.textContent);
      lines.forEach((l) => (l.textContent = ""));
      const terminalObserver = new IntersectionObserver(
        async (entries) => {
          if (!entries[0].isIntersecting) return;
          terminalObserver.disconnect();
          for (let i = 0; i < lines.length; i++) {
            await new Promise((r) => setTimeout(r, 350));
            await typeLine(lines[i], texts[i]);
          }
        },
        { threshold: 0.5 }
      );
      terminalObserver.observe(terminal);
    }
  }

  /* ---------- 8. CUSTOM CURSOR (desktop only) ---------- */
  const cursor = $("#cursor");
  if (cursor && !isTouch && window.innerWidth > 991 && !prefersReducedMotion) {
    document.body.classList.add("has-cursor");
    let tx = 0, ty = 0, cx = 0, cy = 0;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      document.body.classList.add("cursor-visible");
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-visible"));

    const follow = () => {
      cx += (tx - cx) * 0.22; // smooth easing
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    };
    follow();

    const hoverTargets = "a, button, input, textarea, .project, .profile-card";
    document.addEventListener("mouseover", (e) => cursor.classList.toggle("is-hover", !!e.target.closest(hoverTargets)));
  }

  /* ---------- 9. CONTACT FORM VALIDATION ---------- */
  // Static site: nothing is sent to a server. On success we prepare a mailto link instead.
  const form = $("#contactForm");
  const status = $("#formStatus");
  const mailtoBtn = $("#mailtoFallback");
  const TO_EMAIL = "atik.cmttiu1001@gmail.com";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters)."),
    email: (v) => (emailPattern.test(v.trim()) ? "" : "Enter a valid email address, like name@example.com."),
    subject: (v) => (v.trim().length >= 3 ? "" : "Enter a subject (at least 3 characters)."),
    message: (v) => (v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."),
  };

  const validateField = (input) => {
    const error = rules[input.name](input.value);
    const wrapper = input.closest(".field");
    wrapper.classList.toggle("has-error", !!error);
    input.setAttribute("aria-invalid", error ? "true" : "false");
    $(`#${input.id}-error`).textContent = error;
    return !error;
  };

  if (form) {
    const inputs = $$("input, textarea", form);
    inputs.forEach((input) => {
      input.setAttribute("aria-describedby", `${input.id}-error`);
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => { if (input.closest(".field").classList.contains("has-error")) validateField(input); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = inputs.map(validateField);
      if (results.includes(false)) {
        inputs[results.indexOf(false)].focus();
        status.hidden = true;
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      const body = `${data.message.trim()}\n\n— ${data.name.trim()} (${data.email.trim()})`;
      mailtoBtn.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(data.subject.trim())}&body=${encodeURIComponent(body)}`;
      status.hidden = false;
      status.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
    });
  }
})();
