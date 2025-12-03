
VANTA.HALO({
    el: "#hero",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,

    // zwarte achtergrond
    backgroundColor: 0x171717,
    baseColor: 0xb32b94,       // bijna zwart → super subtiel effect
    size: 0.60,                // kleiner halo-effect
    amplitudeFactor: 0.20,     // veel minder beweging
    xOffset: 0.00,
    yOffset: 0.00

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
