

const previewBox = document.querySelector('.preview-box');
const navLinks = document.querySelectorAll('.nav-circle a');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const content = link.dataset.preview;
        previewBox.textContent = content; // Hier kan ook HTML voor icoon of afbeelding
        previewBox.classList.add('show');
    });



    link.addEventListener('mouseleave', () => {
        previewBox.classList.remove('show');
    });
});
// Mobile nav: 3 dots toggle
(() => {
    const nav = document.querySelector(".nav-circle.nav-mobile");
    const btn = document.querySelector(".nav-toggle");
    if (!nav || !btn) return;

    const closeMenu = () => {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });

    // klik buiten menu = sluiten
    document.addEventListener("click", closeMenu);

    // klik op een link = sluiten
    nav.querySelectorAll(".nav-panel a").forEach(a => {
        a.addEventListener("click", closeMenu);
    });
})();
// Hamburger toggle voor bestaande .nav-circle (geen class refactor nodig)
(() => {
    const nav = document.querySelector(".nav-circle");
    const btn = document.querySelector(".nav-toggle");
    if (!nav || !btn) return;

    // Start op mobile standaard dicht (optioneel):
    // nav.classList.add("collapsed");
    // btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", () => {
        nav.classList.toggle("collapsed");
        const expanded = !nav.classList.contains("collapsed");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
})();
(() => {
    const btn = document.getElementById("dimToggle");
    if (!btn) return;

    const KEY = "ultraDim";
    const apply = (on) => {
        document.body.setAttribute("data-dim", on ? "1" : "0");
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.textContent = on ? "Normal" : "Dim";
    };

    // init from storage
    const saved = localStorage.getItem(KEY);
    const on = saved === "1";
    apply(on);

    btn.addEventListener("click", () => {
        const isOn = document.body.getAttribute("data-dim") === "1";
        const next = !isOn;
        localStorage.setItem(KEY, next ? "1" : "0");
        apply(next);
    });
})();
