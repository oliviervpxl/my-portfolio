/* =========================================================
   OLIVIER VLEESCHOUWERS — PORTFOLIO ENGINE
   Vanilla JS • Dark Glass & Technical Infrastructure System
   ========================================================= */

/* =========================
   Nav preview (desktop hover)
   ========================= */
(() => {
    const previewBox = document.querySelector(".preview-box");
    const navLinks = document.querySelectorAll(".nav-circle a");

    if (!previewBox || navLinks.length === 0) return;

    navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const content = link.dataset.preview;
            if (!content) return;
            previewBox.textContent = content;
            previewBox.classList.add("show");
        });

        link.addEventListener("mouseleave", () => {
            previewBox.classList.remove("show");
        });
    });
})();

/* =========================
   Hamburger toggle (.nav-circle)
   ========================= */
(() => {
    const nav = document.querySelector(".nav-circle");
    const btn = document.querySelector(".nav-toggle");
    if (!nav || !btn) return;

    const openMenu = () => {
        nav.classList.remove("collapsed");
        btn.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
        nav.classList.add("collapsed");
        btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (nav.classList.contains("collapsed")) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    // Close menu when clicking a link on mobile viewports
    nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            if (window.matchMedia("(max-width: 1024px)").matches) {
                closeMenu();
            }
        });
    });

    // Close menu when clicking outside on mobile viewports
    document.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width: 1024px)").matches) {
            if (!nav.classList.contains("collapsed") && !nav.contains(e.target) && !btn.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !nav.classList.contains("collapsed")) {
            closeMenu();
            btn.focus();
        }
    });

    // Mobile/tablet default collapsed state
    const mq = window.matchMedia("(max-width: 1024px)");
    const applyNavMedia = () => {
        if (mq.matches) {
            closeMenu();
        } else {
            nav.classList.remove("collapsed");
            btn.setAttribute("aria-expanded", "true");
        }
    };
    applyNavMedia();
    mq.addEventListener?.("change", applyNavMedia);
})();

/* =========================
   Ultra-dim toggle (persist)
   ========================= */
(() => {
    const btn = document.getElementById("dimToggle");
    if (!btn) return;

    const KEY = "ultraDim";

    const apply = (on) => {
        document.body.setAttribute("data-dim", on ? "1" : "0");
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.textContent = on ? "Normal" : "Dim";
    };

    const saved = localStorage.getItem(KEY);
    apply(saved === "1");

    btn.addEventListener("click", () => {
        const isOn = document.body.getAttribute("data-dim") === "1";
        const next = !isOn;
        localStorage.setItem(KEY, next ? "1" : "0");
        apply(next);
    });
})();

/* =========================
   DOMContentLoaded features
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
    /* -------------------------
       Back to top button
       ------------------------- */
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        const toggleBtn = () => {
            if (window.scrollY > 400) backToTop.classList.add("show");
            else backToTop.classList.remove("show");
        };
        toggleBtn();
        window.addEventListener("scroll", toggleBtn, { passive: true });

        backToTop.addEventListener("click", () => {
            if (window.portfolioPaging) {
                window.portfolioPaging.goToChapter(0);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    /* -------------------------
       Toast helper
       ------------------------- */
    const toast = document.getElementById("toast");
    let toastTimer = null;

    const showToast = (msg = "Copied ✅") => {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
    };

    /* -------------------------
       Copy buttons
       ------------------------- */
    document.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const value = btn.getAttribute("data-copy") || "";
            if (!value) return;

            try {
                await navigator.clipboard.writeText(value);
                showToast("Copied ✅");
            } catch {
                const t = document.createElement("textarea");
                t.value = value;
                document.body.appendChild(t);
                t.select();
                document.execCommand("copy");
                t.remove();
                showToast("Copied ✅");
            }
        });
    });

    /* =========================
       Network / Infrastructure Visual Motif
       ========================= */
    const networkSvg = document.getElementById("networkSvg");
    const nodeCoords = [
        { x: 180, y: 190 },  // 1. Home
        { x: 360, y: 520 },  // 2. About
        { x: 680, y: 220 },  // 3. Skills
        { x: 920, y: 620 },  // 4. Education & Projects
        { x: 1140, y: 300 }, // 5. CV
        { x: 1300, y: 660 }, // 6. Contact
        { x: 600, y: 780 }   // 7. Other Interests
    ];

    if (networkSvg) {
        // Build lines
        let svgHtml = '';
        for (let i = 0; i < nodeCoords.length - 1; i++) {
            const p1 = nodeCoords[i];
            const p2 = nodeCoords[i + 1];
            svgHtml += `<line class="network-line" id="netLine${i}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" />`;
        }
        // Connect last back to middle for topology depth
        svgHtml += `<line class="network-line" id="netLine6" x1="${nodeCoords[6].x}" y1="${nodeCoords[6].y}" x2="${nodeCoords[1].x}" y2="${nodeCoords[1].y}" />`;

        // Build nodes
        nodeCoords.forEach((p, idx) => {
            svgHtml += `<circle class="network-node${idx === 0 ? ' active' : ''}" id="netNode${idx}" cx="${p.x}" cy="${p.y}" r="${idx === 0 ? 5 : 3.5}" />`;
        });

        // Packet
        svgHtml += `<circle class="network-packet" id="netPacket" cx="${nodeCoords[0].x}" cy="${nodeCoords[0].y}" r="3.5" />`;
        networkSvg.innerHTML = svgHtml;
    }

    const updateNetworkMotif = (activeIdx) => {
        if (!networkSvg) return;
        const nodes = networkSvg.querySelectorAll(".network-node");
        const lines = networkSvg.querySelectorAll(".network-line");
        const packet = document.getElementById("netPacket");

        nodes.forEach((n, idx) => {
            if (idx === activeIdx) {
                n.classList.add("active");
                n.setAttribute("r", "5.5");
                n.style.fill = "#A7E8BD";
                n.style.stroke = "#74C69D";
            } else {
                n.classList.remove("active");
                n.setAttribute("r", "3.5");
                n.style.fill = "#1B3B2B";
                n.style.stroke = "rgba(116, 198, 157, 0.4)";
            }
        });

        lines.forEach((l, idx) => {
            if (idx === activeIdx || idx === activeIdx - 1) {
                l.classList.add("active");
                l.style.stroke = "#74C69D";
                l.style.opacity = "0.9";
            } else {
                l.classList.remove("active");
                l.style.stroke = "rgba(45, 106, 79, 0.45)";
                l.style.opacity = "0.4";
            }
        });

        if (packet && nodeCoords[activeIdx]) {
            packet.classList.add("moving");
            packet.setAttribute("cx", nodeCoords[activeIdx].x);
            packet.setAttribute("cy", nodeCoords[activeIdx].y);
            packet.style.fill = "#A7E8BD";
            setTimeout(() => {
                packet.classList.remove("moving");
            }, 700);
        }
    };

    /* =========================
       Interactive Terminal (single instance)
       ========================= */
    const out = document.getElementById("terminalOut");
    const input = document.getElementById("terminalInput");

    if (out && input) {
        const routes = {
            home: "#home",
            about: "#about",
            skills: "#skills",
            education: "#projects",
            projects: "#projects",
            music: "#otherinterests",
            interests: "#otherinterests",
            cv: "#cv",
            contact: "#contact",
            terminal: "#home"
        };

        const profile = {
            name: "Olivier Vleeschouwers",
            title: "System & Network Engineer (in training)",
            email: "oliviervleeschouwers@icloud.com",
            github: "https://github.com/oliviervpxl",
            linkedin: "https://www.linkedin.com/in/olivier-vleeschouwers",
            skillsTop: [
                "Windows Server / Active Directory",
                "Linux Server",
                "CCNA-level Networking (VLAN, OSPF)",
                "Automation (PowerShell, Ansible, GitHub Actions)",
                "Cloud (AWS, Azure, VMware ESXi)",
                "Monitoring (NetBox, Zabbix)"
            ],
            focus: "Cloud + Automation & Infrastructure",
            response: "< 24h",
            internship: "The Safe Group (Completed)"
        };

        const bootKey = "portfolio_boot_ts";
        const now = Date.now();
        const bootTs = Number(localStorage.getItem(bootKey)) || now;
        localStorage.setItem(bootKey, String(bootTs));
        const fmtDays = (ms) => Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));

        const line = (text, cls = "term-out") => {
            const div = document.createElement("div");
            div.className = `term-line ${cls}`.trim();
            div.textContent = text;
            out.appendChild(div);
            out.scrollTop = out.scrollHeight;
        };

        const promptLine = (cmd) => {
            const div = document.createElement("div");
            div.className = "term-line";
            div.innerHTML = `<span class="term-prompt">$ </span><span class="term-cmd"></span>`;
            out.appendChild(div);
            div.querySelector(".term-cmd").textContent = cmd;
            out.scrollTop = out.scrollHeight;
        };

        const clear = () => { out.innerHTML = ""; };

        const openRoute = (key) => {
            line(`Navigating to ${key}…`);
            setTimeout(() => {
                if (window.portfolioPaging && window.portfolioPaging.goToSection(key)) {
                    // Handled smoothly via in-page chapter transition
                } else if (routes[key]) {
                    window.location.hash = routes[key];
                }
            }, 300);
        };

        const sectionsList = ["home", "about", "skills", "education", "cv", "contact", "music"];
        const baseCommands = [
            "help", "ls", "whoami", "skills", "contact", "status", "clear", "ping", "uptime", "neofetch", "sudo", "man"
        ];

        const history = [];
        let histIndex = -1;

        const tokenize = (s) => s.trim().split(/\s+/).filter(Boolean);

        const printHelp = () => {
            line("commands:", "term-strong");
            line("  help                show available commands");
            line("  ls [ -l ]            list portfolio chapters");
            line("  whoami               about me");
            line("  skills [--top]       show key skills or navigate to skills");
            line("  contact              show contact details");
            line("  status               system status / internship / response time");
            line("  ping <target>        simulate network ping");
            line("  uptime               portfolio uptime");
            line("  neofetch             system summary");
            line("  man <topic>          mini manual");
            line("  clear                clear terminal");
            line("");
            line("chapters:", "term-strong");
            line(`  ${sectionsList.join(" | ")}`);
            line("");
            line("tip: type a chapter name to jump to it (e.g. 'skills' or 'cv')");
        };

        const printLs = (longMode) => {
            if (!longMode) {
                line(sectionsList.join("  "));
                return;
            }
            line("drwxr-xr-x  01_home");
            line("drwxr-xr-x  02_about");
            line("drwxr-xr-x  03_skills");
            line("drwxr-xr-x  04_education_projects");
            line("-rw-r--r--  05_cv.pdf");
            line("drwxr-xr-x  06_contact");
            line("drwxr-xr-x  07_other_interests");
        };

        const printWhoami = () => {
            line(profile.name);
            line(profile.title);
        };

        const printContact = () => {
            line("Email:    " + profile.email);
            line("GitHub:   " + profile.github);
            line("LinkedIn: " + profile.linkedin);
        };

        const printStatus = () => {
            line("System status:", "term-strong");
            line(`  internship        ${profile.internship}`);
            line(`  response_time     ${profile.response}`);
            line(`  current_focus     ${profile.focus}`);
        };

        const printSkillsTop = () => {
            profile.skillsTop.forEach((s) => line(`• ${s}`));
        };

        const printUptime = () => {
            line(`portfolio up for ${fmtDays(Date.now() - bootTs)} day(s)`);
        };

        const printNeofetch = () => {
            line("OS:        PortfolioOS / Debian-styled");
            line("Host:      GitHub Pages");
            line("Kernel:    Vanilla JS 2.0");
            line(`Uptime:    ${fmtDays(Date.now() - bootTs)} day(s)`);
            line("Shell:     infrastructure-web-term");
            line("Theme:     dark-glass-pro");
        };

        const printPing = (target) => {
            const t = target || "pxl.be";
            line(`PING ${t} (127.0.0.1): 56 data bytes`);
            const times = [2, 1, 3, 2].map((x) => x + Math.floor(Math.random() * 2));
            times.forEach((ms, i) =>
                line(`64 bytes from 127.0.0.1: icmp_seq=${i + 1} ttl=64 time=${ms} ms`)
            );
            line(`--- ${t} ping statistics ---`);
            line("4 packets transmitted, 4 received, 0% packet loss");
        };

        const printMan = (topic) => {
            const t = (topic || "").toLowerCase();
            if (!t) {
                line("usage: man <topic>");
                return;
            }
            const manuals = {
                olivier: [
                    "NAME",
                    "  Olivier Vleeschouwers",
                    "",
                    "DESCRIPTION",
                    "  System & Network Administration student at Hogeschool PXL.",
                    "  Internship completed at The Safe Group.",
                    "  Focused on stability, automation, network topology and cloud infrastructure.",
                    "",
                    "SEE ALSO",
                    "  skills, status, contact, cv"
                ],
                skills: [
                    "NAME",
                    "  skills [--top]",
                    "",
                    "DESCRIPTION",
                    "  Displays core networking and server management skills."
                ],
                status: [
                    "NAME",
                    "  status",
                    "",
                    "DESCRIPTION",
                    "  Shows availability, response time, and current technical focus."
                ],
                contact: [
                    "NAME",
                    "  contact",
                    "",
                    "DESCRIPTION",
                    "  Outputs email, GitHub and LinkedIn links."
                ]
            };
            const page = manuals[t] || ["No manual entry for this topic.", "Try: man olivier | man skills | man status | man contact"];
            page.forEach((l) => line(l));
        };

        const runCommand = (raw) => {
            const cmd = raw.trim();
            if (!cmd) return;

            const parts = tokenize(cmd);
            const head = (parts[0] || "").toLowerCase();

            if (routes[head]) {
                openRoute(head);
                return;
            }

            switch (head) {
                case "help": printHelp(); break;
                case "ls": printLs(parts.includes("-l")); break;
                case "whoami": printWhoami(); break;
                case "skills":
                    if (parts.includes("--top")) printSkillsTop();
                    else openRoute("skills");
                    break;
                case "contact": printContact(); break;
                case "status": printStatus(); break;
                case "clear": clear(); break;
                case "uptime": printUptime(); break;
                case "neofetch": printNeofetch(); break;
                case "ping": printPing(parts[1]); break;
                case "sudo": line("Permission denied. Nice try 🙂"); break;
                case "man": printMan(parts[1]); break;
                default:
                    line(`Command not found: ${head}`);
                    line(`Type 'help' for options.`);
                    break;
            }
        };

        const autocomplete = () => {
            const v = input.value.trim().toLowerCase();
            if (!v) return;
            const pool = [...baseCommands, ...sectionsList, "olivier"];
            const matches = pool.filter((x) => x.startsWith(v));
            if (matches.length === 1) {
                input.value = matches[0];
                return;
            }
            if (matches.length > 1) {
                line(matches.join("  "));
            }
        };

        const historyUp = () => {
            if (history.length === 0) return;
            if (histIndex === -1) histIndex = history.length - 1;
            else histIndex = Math.max(0, histIndex - 1);
            input.value = history[histIndex];
        };

        const historyDown = () => {
            if (history.length === 0) return;
            if (histIndex === -1) return;
            histIndex = Math.min(history.length, histIndex + 1);
            input.value = histIndex === history.length ? "" : history[histIndex];
            if (histIndex === history.length) histIndex = -1;
        };

        line("Welcome to Olivier's Portfolio.");
        line("Type 'help' to explore commands or type a chapter name. (TAB = autocomplete)");
        line("");

        input.addEventListener("keydown", (e) => {
            // NEVER propagate terminal keys to window scroll/chapter paging
            e.stopPropagation();

            if (e.key === "Enter") {
                const cmd = input.value;
                if (!cmd.trim()) return;
                history.push(cmd);
                if (history.length > 50) history.shift();
                histIndex = -1;
                promptLine(cmd);
                input.value = "";
                runCommand(cmd);
            } else if (e.key === "Tab") {
                e.preventDefault();
                autocomplete();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                historyUp();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                historyDown();
            }
        });

        out.closest(".terminal")?.addEventListener("click", () => input.focus());
    }

    /* =========================================================
       DESKTOP CHAPTER PAGING & NAVIGATION ENGINE
       ========================================================= */
    const sections = Array.from(document.querySelectorAll(".portfolio-section"));
    const navLinks = Array.from(document.querySelectorAll(".nav-circle a"));
    const chapterLabel = document.getElementById("chapterLabel");
    const chapterProgress = document.getElementById("chapterProgress");
    const srAnnouncer = document.getElementById("sr-announcer");

    if (sections.length > 0) {
        let currentChapterIndex = 0;
        let isTransitioning = false;
        let lastWheelTime = 0;

        const isDesktopPaging = () => {
            const mqSize = window.matchMedia("(min-width: 1025px) and (min-height: 651px)").matches;
            const mqMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            return mqSize && mqMotion;
        };

        const updatePagingMode = () => {
            if (isDesktopPaging()) {
                document.body.classList.add("is-paging");
                sections.forEach((sec, idx) => {
                    sec.classList.remove("is-active", "is-prev", "is-next");
                    if (idx === currentChapterIndex) {
                        sec.classList.add("is-active");
                    } else if (idx < currentChapterIndex) {
                        sec.classList.add("is-prev");
                    } else {
                        sec.classList.add("is-next");
                    }
                });
            } else {
                document.body.classList.remove("is-paging");
                sections.forEach((sec) => {
                    sec.classList.remove("is-prev", "is-next");
                });
            }
            updateActiveUI(currentChapterIndex);
        };

        const updateActiveUI = (index) => {
            const activeSec = sections[index];
            if (!activeSec) return;

            // Nav link highlight
            navLinks.forEach((link) => {
                const href = link.getAttribute("href") || "";
                const secKey = link.getAttribute("data-section") || "";
                if (href === "#" + activeSec.id || secKey === activeSec.id) {
                    link.classList.add("is-active");
                    link.setAttribute("aria-current", "page");
                } else {
                    link.classList.remove("is-active");
                    link.removeAttribute("aria-current");
                }
            });

            // Chapter tracker
            if (chapterLabel) {
                chapterLabel.textContent = String(index + 1).padStart(2, "0") + " / " + String(sections.length).padStart(2, "0");
            }
            if (chapterProgress) {
                chapterProgress.style.width = ((index + 1) / sections.length * 100) + "%";
            }

            // Network motif
            updateNetworkMotif(index);
        };

        const goToChapter = (targetIndex, force = false) => {
            targetIndex = Math.max(0, Math.min(sections.length - 1, targetIndex));
            if (targetIndex === currentChapterIndex && !force) return;
            if (isTransitioning && !force) return;

            const dir = targetIndex > currentChapterIndex ? "down" : "up";
            currentChapterIndex = targetIndex;
            const activeSec = sections[targetIndex];

            if (isDesktopPaging()) {
                isTransitioning = true;
                setTimeout(() => { isTransitioning = false; }, 900);

                sections.forEach((sec, idx) => {
                    sec.classList.remove("is-active", "is-prev", "is-next");
                    if (idx === targetIndex) {
                        sec.classList.add("is-active");
                    } else if (idx < targetIndex) {
                        sec.classList.add("is-prev");
                    } else {
                        sec.classList.add("is-next");
                    }
                });

                // Position scroll for natural reading
                if (dir === "down") {
                    activeSec.scrollTop = 0;
                } else {
                    activeSec.scrollTop = Math.max(0, activeSec.scrollHeight - activeSec.clientHeight);
                }
            } else {
                isTransitioning = false;
                activeSec.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            updateActiveUI(targetIndex);

            // Update URL hash without polluting browser history
            if (window.location.hash !== "#" + activeSec.id) {
                history.replaceState(null, "", "#" + activeSec.id);
            }

            // Screen reader announcement
            if (srAnnouncer) {
                srAnnouncer.textContent = "Chapter " + (targetIndex + 1) + " of " + sections.length + ": " + (activeSec.dataset.title || activeSec.id);
            }

            // Move focus politely to heading
            const heading = activeSec.querySelector("h1, h2");
            if (heading) {
                heading.setAttribute("tabindex", "-1");
                heading.focus({ preventScroll: true });
            }
        };

        // Wheel listener with trackpad inertia protection & inner scroll preservation
        window.addEventListener("wheel", (e) => {
            if (!isDesktopPaging()) return;

            // Never intercept if pointer is inside inputs, terminal, iframe, or details summary
            if (e.target.closest("#terminalInput, .terminal, input, textarea, select, button, a, iframe, .embed-wrap, details summary")) {
                return;
            }

            const now = Date.now();
            if (isTransitioning || now - lastWheelTime < 850) {
                e.preventDefault();
                return;
            }

            // Minimum magnitude threshold to filter out tiny trackpad drift
            if (Math.abs(e.deltaY) < 20) return;

            const currentSec = sections[currentChapterIndex];
            if (!currentSec) return;

            const maxScroll = currentSec.scrollHeight - currentSec.clientHeight;
            const isScrollable = maxScroll > 8;

            if (isScrollable) {
                const atTop = currentSec.scrollTop <= 6;
                const atBottom = currentSec.scrollTop >= maxScroll - 6;

                if (e.deltaY > 0) {
                    // Scrolling downward: let inner scroll occur unless already at bottom
                    if (!atBottom) return;
                } else if (e.deltaY < 0) {
                    // Scrolling upward: let inner scroll occur unless already at top
                    if (!atTop) return;
                }
            }

            // Boundaries check (do not loop around)
            if (currentChapterIndex === 0 && e.deltaY < 0) return;
            if (currentChapterIndex === sections.length - 1 && e.deltaY > 0) return;

            e.preventDefault();
            lastWheelTime = now;
            goToChapter(currentChapterIndex + (e.deltaY > 0 ? 1 : -1));
        }, { passive: false });

        // Keyboard listener (Arrow / PageUp / PageDown)
        window.addEventListener("keydown", (e) => {
            // Never intercept when user is typing in terminal or any input
            if (e.target.closest("#terminalInput, .terminal, input, textarea, select")) return;

            if (e.key === "PageDown" || (e.key === "ArrowDown" && e.altKey)) {
                e.preventDefault();
                goToChapter(currentChapterIndex + 1);
            } else if (e.key === "PageUp" || (e.key === "ArrowUp" && e.altKey)) {
                e.preventDefault();
                goToChapter(currentChapterIndex - 1);
            } else if (e.key === "Home" && !e.target.closest("input, textarea")) {
                e.preventDefault();
                goToChapter(0);
            } else if (e.key === "End" && !e.target.closest("input, textarea")) {
                e.preventDefault();
                goToChapter(sections.length - 1);
            }
        });

        // Navigation links click listener
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href") || "";
                if (href.startsWith("#")) {
                    e.preventDefault();
                    const secId = href.slice(1);
                    const targetIdx = sections.findIndex((s) => s.id === secId);
                    if (targetIdx !== -1) {
                        goToChapter(targetIdx);
                        if (window.matchMedia("(max-width: 1024px)").matches) {
                            document.querySelector(".nav-circle")?.classList.add("collapsed");
                            document.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
                        }
                    }
                }
            });
        });

        // Mobile IntersectionObserver for natural scrolling mode
        const observer = new IntersectionObserver((entries) => {
            if (isDesktopPaging()) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const idx = sections.indexOf(entry.target);
                    if (idx !== -1) {
                        currentChapterIndex = idx;
                        updateActiveUI(idx);
                        if (window.location.hash !== "#" + entry.target.id) {
                            history.replaceState(null, "", "#" + entry.target.id);
                        }
                    }
                }
            });
        }, { threshold: 0.35 });
        sections.forEach((s) => observer.observe(s));

        // Router helper for terminal
        window.portfolioPaging = {
            goToChapter,
            goToSection: (secKey) => {
                const aliasMap = {
                    home: "home",
                    about: "about",
                    skills: "skills",
                    education: "projects",
                    projects: "projects",
                    cv: "cv",
                    contact: "contact",
                    music: "otherinterests",
                    interests: "otherinterests"
                };
                const targetId = aliasMap[secKey] || secKey;
                const idx = sections.findIndex((s) => s.id === targetId);
                if (idx !== -1) {
                    goToChapter(idx);
                    return true;
                }
                return false;
            }
        };

        // Deep link check on load
        const handleInitialHash = () => {
            if (window.location.hash) {
                const secId = window.location.hash.slice(1);
                const targetIdx = sections.findIndex((s) => s.id === secId);
                if (targetIdx !== -1) {
                    goToChapter(targetIdx, true);
                    return;
                }
            }
            updatePagingMode();
        };

        handleInitialHash();

        // Browser Back / Forward buttons handling
        window.addEventListener("popstate", () => {
            if (window.location.hash) {
                const secId = window.location.hash.slice(1);
                const targetIdx = sections.findIndex((s) => s.id === secId);
                if (targetIdx !== -1) {
                    goToChapter(targetIdx, true);
                }
            } else {
                goToChapter(0, true);
            }
        });

        // Resize / orientation handling
        window.addEventListener("resize", () => {
            updatePagingMode();
        });
    }
});
