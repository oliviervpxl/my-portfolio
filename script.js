
VANTA.HALO({
    el: "#hero",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    baseColor: 0x0,
    backgroundColor: 0x6080a,
    amplitudeFactor: 0.00,
    xOffset: -0.04,
    size: 0.5

});
const previewBox = document.querySelector('.preview-box');
const navLinks = document.querySelectorAll('.nav-circle a');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const content = link.dataset.preview;
        previewBox.innerHTML = content; // Hier kan ook HTML voor icoon of afbeelding
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
