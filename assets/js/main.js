(() => {
  const root = document.documentElement;
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme || (mq.matches ? "dark" : "light");

  // Theme toggle
  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    const label = () => toggle.setAttribute("aria-label",
      current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    label();
    toggle.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
    mq.addEventListener("change", label);
  }

  const side = document.querySelector(".sidebar");
  if (!side) return;

  // Mobile menu
  const btn = side.querySelector(".side-toggle");
  const setOpen = (open) => {
    if (!btn) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    side.dataset.open = String(open);
  };
  if (btn) btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && side.dataset.open === "true") { setOpen(false); if (btn) btn.focus(); }
  });

  // Active section highlight
  const links = [...side.querySelectorAll(".side__nav a")];
  const keyOf = (a) => new URL(a.href, location.href).hash.slice(1);
  const setActive = (key) => links.forEach((a) => {
    const on = keyOf(a) === key;
    a.classList.toggle("is-active", on);
    if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
  });

  // Sections without their own nav button count toward the nearest one above.
  const alias = { education: "research", achievements: "projects", skills: "projects", publications: "projects" };
  const sections = [...document.querySelectorAll("main section[id]")];
  let lockUntil = 0;

  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (Date.now() < lockUntil) return;
      entries.forEach((e) => { if (e.isIntersecting) setActive(alias[e.target.id] || e.target.id); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((s) => io.observe(s));
    addEventListener("scroll", () => {
      if (Date.now() >= lockUntil && scrollY < 120) setActive(null);
    }, { passive: true });
  }

  // Click: highlight right away, play the arrival animation, close the mobile menu
  side.addEventListener("click", (e) => {
    const a = e.target.closest(".side__nav a");
    if (!a) return;
    const id = keyOf(a);
    const target = id && document.getElementById(id);
    if (target) {
      lockUntil = Date.now() + 900;
      setActive(id);
      target.classList.remove("is-arriving");
      void target.offsetWidth;
      target.classList.add("is-arriving");
      setTimeout(() => target.classList.remove("is-arriving"), 900);
    }
    setOpen(false);
  });
})();