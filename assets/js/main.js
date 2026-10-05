(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
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

  if (!header) return;

  // Acrylic appears once the page scrolls
  const onScroll = () => { header.dataset.scrolled = String(window.scrollY > 8); };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const btn = header.querySelector(".nav-toggle");
  if (btn) {
    const set = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      header.dataset.open = String(open);
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    header.addEventListener("click", (e) => { if (e.target.closest(".site-nav a")) set(false); });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.dataset.open === "true") { set(false); btn.focus(); }
    });
  }
})();